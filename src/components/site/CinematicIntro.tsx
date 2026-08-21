import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  sx: number;
  sy: number;
  delay: number;
  tx: number;
  ty: number;
  r: number;
  hue: number;
};

const WORD = "VISIONTRACK";

/**
 * Cinematic particle intro: thousands of points scatter, then assemble into the
 * VisionTrack wordmark before the overlay dissolves into the page.
 */
export function CinematicIntro() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<"playing" | "leaving" | "done">("playing");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("vt-intro-played") === "1") {
      setPhase("done");
      return;
    }
    window.sessionStorage.setItem("vt-intro-played", "1");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    // Sample the wordmark into target points.
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const octx = off.getContext("2d")!;
    const fontSize = Math.min(w / (WORD.length * 0.78), h * 0.18);
    octx.fillStyle = "#fff";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.font = `700 ${fontSize}px "IBM Plex Sans", system-ui, sans-serif`;
    octx.letterSpacing = `${fontSize * 0.02}px`;
    octx.fillText(WORD, w / 2, h / 2);

    const data = octx.getImageData(0, 0, w, h).data;
    const gap = Math.max(3, Math.round(fontSize / 26));
    const targets: Array<{ x: number; y: number }> = [];
    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        if (data[(y * w + x) * 4 + 3]! > 140) targets.push({ x, y });
      }
    }

    const particles: Particle[] = targets.map((t) => {
      const a = Math.random() * Math.PI * 2;
      const d = Math.max(w, h) * (0.4 + Math.random() * 0.8);
      return {
        x: w / 2 + Math.cos(a) * d,
        y: h / 2 + Math.sin(a) * d,
        sx: w / 2 + Math.cos(a) * d,
        sy: h / 2 + Math.sin(a) * d,
        delay: Math.random() * 420,
        tx: t.x,
        ty: t.y,
        r: gap * (0.32 + Math.random() * 0.28),
        hue: 190 + Math.random() * 90,
      };
    });

    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, w, h);
      const settle = Math.min(1, t / 1400);

      for (const p of particles) {
        const local = Math.min(1, Math.max(0, (t - p.delay) / 1500));
        const e = 1 - Math.pow(1 - local, 3);
        const wobble = (1 - e) * 26;
        p.x = p.sx + (p.tx - p.sx) * e + (Math.random() - 0.5) * wobble;
        p.y = p.sy + (p.ty - p.sy) * e + (Math.random() - 0.5) * wobble;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, ${58 + settle * 18}%, ${0.35 + settle * 0.6})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Scan sweep across the assembled wordmark.
      if (t > 2100) {
        const sweep = ((t - 2100) / 900) % 1;
        const gx = sweep * w;
        const g = ctx.createLinearGradient(gx - 160, 0, gx + 160, 0);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.5, "rgba(255,255,255,0.16)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      }

      if (t < 4200) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const leave = window.setTimeout(() => setPhase("leaving"), 3600);
    const finish = window.setTimeout(() => setPhase("done"), 4600);

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(leave);
      window.clearTimeout(finish);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] bg-navy transition-opacity duration-[900ms] ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 grid-blueprint opacity-30" />
      <div className="vt-aurora absolute inset-0 opacity-70" />
      <canvas ref={canvasRef} className="relative h-full w-full" />
      <p className="eyebrow absolute inset-x-0 bottom-10 text-center text-navy-foreground/45 vt-fade-up">
        See Further. Find Faster.
      </p>
    </div>
  );
}
