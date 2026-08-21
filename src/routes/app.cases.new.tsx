import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/app/AppShell";
import { PersonThumb } from "@/components/common/PersonThumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { visualSearchService, type UploadedEvidence } from "@/lib/visual-search-service";
import type { CasePriority } from "@/lib/demo-data";

export const Route = createFileRoute("/app/cases/new")({
  component: CreateCase,
});

const STEPS = ["Basic Information", "Appearance", "Reference Images", "Case Details", "Review & Submit"] as const;

interface FormState {
  fullName: string;
  age: string;
  gender: string;
  dateLastSeen: string;
  timeLastSeen: string;
  lastKnownLocation: string;
  height: string;
  hair: string;
  clothing: string;
  features: string;
  accessories: string;
  circumstances: string;
  notes: string;
  contactName: string;
  contactRelation: string;
  contactPhone: string;
  priority: CasePriority;
}

const initial: FormState = {
  fullName: "",
  age: "",
  gender: "Female",
  dateLastSeen: "",
  timeLastSeen: "",
  lastKnownLocation: "",
  height: "",
  hair: "",
  clothing: "",
  features: "",
  accessories: "",
  circumstances: "",
  notes: "",
  contactName: "",
  contactRelation: "",
  contactPhone: "",
  priority: "High",
};

function CreateCase() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<UploadedEvidence[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function validate(target: number) {
    const next: Record<string, string> = {};
    if (target > 0) {
      if (form.fullName.trim().length < 2) next["fullName"] = "Enter the person's full name.";
      const age = Number(form.age);
      if (!form.age || Number.isNaN(age) || age < 0 || age > 120) next["age"] = "Enter a valid age between 0 and 120.";
      if (!form.dateLastSeen) next["dateLastSeen"] = "Select the date last seen.";
      if (!form.timeLastSeen) next["timeLastSeen"] = "Enter an approximate time.";
      if (form.lastKnownLocation.trim().length < 3) next["lastKnownLocation"] = "Enter the last known location.";
    }
    if (target > 1) {
      if (form.clothing.trim().length < 3) next["clothing"] = "Describe the clothing worn when last seen.";
    }
    if (target > 3) {
      if (form.circumstances.trim().length < 10) next["circumstances"] = "Describe the circumstances in a sentence or two.";
      if (form.contactName.trim().length < 2) next["contactName"] = "Enter an emergency contact name.";
      if (form.contactPhone.trim().length < 6) next["contactPhone"] = "Enter a reachable contact number.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goto(target: number) {
    if (target > step && !validate(target)) {
      toast.error("Some required information is missing.");
      return;
    }
    setStep(target);
  }

  function onFiles(files: FileList | null) {
    if (!files) return;
    const accepted: UploadedEvidence[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file.`);
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 15 MB limit.`);
        return;
      }
      accepted.push(visualSearchService.uploadEvidence(file));
    });
    if (accepted.length) {
      setImages((prev) => [...prev, ...accepted]);
      toast.success(`${accepted.length} reference image${accepted.length > 1 ? "s" : ""} attached.`);
    }
  }

  function submit() {
    if (!validate(4)) {
      toast.error("Some required information is missing.");
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      toast.success("Case created", {
        description: "Demo environment — the case is not persisted. Opening a sample case record.",
      });
      navigate({ to: "/app/cases/$caseId", params: { caseId: "VT-1042" } });
    }, 700);
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-err`} className="text-xs text-critical">
        {errors[k]}
      </p>
    ) : null;
  const inv = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-err` } : {});

  return (
    <PageShell title="Create Case" description="Five steps. Everything entered here becomes the case record used by search and review.">
      <ol className="flex flex-wrap gap-px border border-border bg-border" aria-label="Case creation progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1">
            <button
              type="button"
              onClick={() => goto(i)}
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "flex w-full items-center gap-2.5 bg-card px-4 py-3 text-left text-sm transition-colors hover:bg-surface",
                i === step && "bg-surface-strong font-medium",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border font-mono text-[11px]",
                  i < step ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : String(i + 1).padStart(2, "0")}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="panel p-6" aria-live="polite">
          {step === 0 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Basic information</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} {...inv("fullName")} />
                  {err("fullName")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" inputMode="numeric" value={form.age} onChange={(e) => set("age", e.target.value)} {...inv("age")} />
                  {err("age")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                    <SelectTrigger id="gender"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Female", "Male", "Other", "Not recorded"].map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateLastSeen">Date last seen</Label>
                  <Input id="dateLastSeen" type="date" value={form.dateLastSeen} onChange={(e) => set("dateLastSeen", e.target.value)} {...inv("dateLastSeen")} />
                  {err("dateLastSeen")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeLastSeen">Time last seen</Label>
                  <Input id="timeLastSeen" type="time" value={form.timeLastSeen} onChange={(e) => set("timeLastSeen", e.target.value)} {...inv("timeLastSeen")} />
                  {err("timeLastSeen")}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="lastKnownLocation">Last known location</Label>
                  <Input id="lastKnownLocation" placeholder="District, city or specific address" value={form.lastKnownLocation} onChange={(e) => set("lastKnownLocation", e.target.value)} {...inv("lastKnownLocation")} />
                  {err("lastKnownLocation")}
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Appearance</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input id="height" placeholder="e.g. 168 cm" value={form.height} onChange={(e) => set("height", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hair">Hair</Label>
                  <Input id="hair" placeholder="Colour, length, style" value={form.hair} onChange={(e) => set("hair", e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="clothing">Clothing when last seen</Label>
                  <Textarea id="clothing" rows={3} value={form.clothing} onChange={(e) => set("clothing", e.target.value)} {...inv("clothing")} />
                  {err("clothing")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="features">Distinguishing features</Label>
                  <Textarea id="features" rows={3} placeholder="Scars, tattoos, glasses, mobility aids" value={form.features} onChange={(e) => set("features", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessories">Accessories</Label>
                  <Textarea id="accessories" rows={3} placeholder="Bags, jewellery, devices" value={form.accessories} onChange={(e) => set("accessories", e.target.value)} />
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Reference images</h2>
              <p className="text-sm text-muted-foreground">
                Upload clear, recent photographs you are authorized to use. Images are attached to this case only and
                are never used to search for people outside it. JPG or PNG, up to 15 MB each.
              </p>
              <div
                className="flex flex-col items-center justify-center border border-dashed border-border bg-surface px-6 py-10 text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onFiles(e.dataTransfer.files);
                }}
              >
                <ImagePlus className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                <p className="mt-3 text-sm">Drag images here, or</p>
                <Button type="button" variant="outline" className="mt-3" onClick={() => fileInput.current?.click()}>
                  Choose files
                </Button>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  aria-label="Reference images"
                  onChange={(e) => onFiles(e.target.files)}
                />
              </div>
              {images.length > 0 ? (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {images.map((img) => (
                    <li key={img.id} className="border border-border p-2">
                      <PersonThumb seed={img.id} label={img.kind} />
                      <p className="mt-2 truncate text-xs" title={img.name}>{img.name}</p>
                      <p className="text-[11px] text-muted-foreground">{img.sizeLabel}</p>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="mt-1 h-7 w-full text-xs"
                        onClick={() => setImages((prev) => prev.filter((i) => i.id !== img.id))}
                      >
                        <Trash2 className="mr-1.5 h-3 w-3" /> Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No reference images attached yet.</p>
              )}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Case details</h2>
              <div className="space-y-2">
                <Label htmlFor="circumstances">Circumstances</Label>
                <Textarea id="circumstances" rows={4} value={form.circumstances} onChange={(e) => set("circumstances", e.target.value)} {...inv("circumstances")} />
                {err("circumstances")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional notes</Label>
                <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Emergency contact</Label>
                  <Input id="contactName" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} {...inv("contactName")} />
                  {err("contactName")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactRelation">Relationship</Label>
                  <Input id="contactRelation" value={form.contactRelation} onChange={(e) => set("contactRelation", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact number</Label>
                  <Input id="contactPhone" inputMode="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} {...inv("contactPhone")} />
                  {err("contactPhone")}
                </div>
              </div>
              <div className="space-y-2 sm:w-56">
                <Label htmlFor="priority">Case priority</Label>
                <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                  <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Low", "Medium", "High", "Critical"] as CasePriority[]).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Review & submit</h2>
              <dl className="grid gap-px border border-border bg-border text-sm sm:grid-cols-2">
                {[
                  ["Full name", form.fullName],
                  ["Age", form.age],
                  ["Gender", form.gender],
                  ["Last seen", `${form.dateLastSeen} ${form.timeLastSeen}`],
                  ["Last known location", form.lastKnownLocation],
                  ["Height", form.height || "—"],
                  ["Hair", form.hair || "—"],
                  ["Clothing", form.clothing],
                  ["Distinguishing features", form.features || "—"],
                  ["Accessories", form.accessories || "—"],
                  ["Reference images", `${images.length} attached`],
                  ["Priority", form.priority],
                  ["Emergency contact", `${form.contactName} ${form.contactRelation ? `(${form.contactRelation})` : ""} ${form.contactPhone}`],
                  ["Circumstances", form.circumstances],
                ].map(([k, v]) => (
                  <div key={k} className="bg-card p-3">
                    <dt className="eyebrow text-muted-foreground">{k}</dt>
                    <dd className="mt-1 break-words">{v || "—"}</dd>
                  </div>
                ))}
              </dl>
              <p className="border-l-2 border-primary bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                By submitting you confirm your organization is authorized to hold and process this information for a
                missing-person search.
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={() => goto(step + 1)}>Continue</Button>
            ) : (
              <Button type="button" onClick={submit} disabled={submitting}>
                {submitting ? "Submitting…" : "Submit case"}
              </Button>
            )}
          </div>
        </section>

        <aside className="space-y-4 self-start">
          <div className="panel p-5">
            <h2 className="text-sm font-semibold">Why this detail matters</h2>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              <li>Precise last-seen time and place define the search radius used on the map.</li>
              <li>Clothing and distinguishing features give reviewers something to check beyond facial similarity.</li>
              <li>Reference images set the comparison baseline for every later visual search.</li>
              <li>Priority determines alerting and where the case sits in the review queue.</li>
            </ul>
          </div>
          <div className="panel border-l-2 border-l-critical p-5">
            <h2 className="text-sm font-semibold">Before you submit</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A VisionTrack case does not notify police or emergency services. Ensure an official report has been filed
              through the appropriate channel.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
