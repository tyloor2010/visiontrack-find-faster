import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Download, Eye, Flag, Link2, MessageSquarePlus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/app/AppShell";
import { DemoTag } from "@/components/common/badges";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auditLog, cases, evidence, formatDateTime, type EvidenceItem, type EvidenceType } from "@/lib/demo-data";
import { visualSearchService } from "@/lib/visual-search-service";

export const Route = createFileRoute("/app/evidence")({
  component: EvidenceCenter,
});

const TYPES: (EvidenceType | "All")[] = ["All", "Image", "Video", "Document", "Location", "Note"];

function EvidenceCenter() {
  const [items, setItems] = useState<EvidenceItem[]>(evidence);
  const [q, setQ] = useState("");
  const [caseFilter, setCaseFilter] = useState("all");
  const [active, setActive] = useState<EvidenceItem | null>(null);
  const [note, setNote] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const filtered = (type: EvidenceType | "All") =>
    items.filter(
      (e) =>
        (type === "All" || e.type === type) &&
        (caseFilter === "all" || e.caseId === caseFilter) &&
        (q.trim() === "" ||
          e.id.toLowerCase().includes(q.toLowerCase()) ||
          e.title.toLowerCase().includes(q.toLowerCase()) ||
          e.uploadedBy.toLowerCase().includes(q.toLowerCase())),
    );

  function upload(files: FileList | null) {
    if (!files?.length) return;
    const added: EvidenceItem[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 200 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 200 MB limit.`);
        return;
      }
      const uploaded = visualSearchService.uploadEvidence(file);
      if (uploaded.kind === "Other") {
        toast.error(`${file.name} is not an accepted evidence type.`);
        return;
      }
      added.push({
        id: uploaded.id,
        caseId: caseFilter === "all" ? cases[0]!.id : caseFilter,
        type: uploaded.kind,
        title: uploaded.name,
        uploadedBy: "You",
        uploadedAt: new Date().toISOString(),
        location: "Not recorded",
        status: "Pending Review",
        sizeLabel: uploaded.sizeLabel,
      });
    });
    if (added.length) {
      setItems((prev) => [...added, ...prev]);
      toast.success(`${added.length} item${added.length > 1 ? "s" : ""} uploaded`, {
        description: "Attributed to your account and queued for review.",
      });
    }
  }

  function Table({ type }: { type: EvidenceType | "All" }) {
    const rows = filtered(type);
    if (rows.length === 0) {
      return (
        <EmptyState
          icon={Boxes}
          title="No evidence uploaded"
          description="Upload photos, video frames, documents or location records to attach them to a case."
          action={<Button onClick={() => fileInput.current?.click()}>Upload evidence</Button>}
        />
      );
    }
    return (
      <div className="panel overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Evidence items</caption>
          <thead className="bg-surface text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">Evidence ID</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Type</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Title</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Case</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Uploaded by</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Date</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Location</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
              <th scope="col" className="px-4 py-2.5 font-medium"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-t border-border hover:bg-surface">
                <td className="px-4 py-2.5 font-mono text-xs">{e.id}</td>
                <td className="px-4 py-2.5">{e.type}</td>
                <td className="max-w-64 truncate px-4 py-2.5" title={e.title}>{e.title}</td>
                <td className="px-4 py-2.5">
                  <Link to="/app/cases/$caseId" params={{ caseId: e.caseId }} className="font-mono text-xs text-primary hover:underline">
                    {e.caseId}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{e.uploadedBy}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatDateTime(e.uploadedAt)}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{e.location}</td>
                <td className="px-4 py-2.5 text-xs">{e.status}</td>
                <td className="px-4 py-2.5 text-right">
                  <Button size="sm" variant="outline" onClick={() => setActive(e)}>
                    <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <PageShell
      title="Evidence Center"
      description="Every item is attributed, typed and traceable to the case it belongs to."
      actions={
        <>
          <DemoTag />
          <Button onClick={() => fileInput.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Upload evidence
          </Button>
        </>
      }
    >
      <input
        ref={fileInput}
        type="file"
        multiple
        className="sr-only"
        aria-label="Upload evidence files"
        onChange={(e) => upload(e.target.files)}
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-56 flex-1">
          <Label htmlFor="ev-q" className="sr-only">Search evidence</Label>
          <Input id="ev-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ID, title or uploader" />
        </div>
        <Select value={caseFilter} onValueChange={setCaseFilter}>
          <SelectTrigger className="w-56" aria-label="Filter by case"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cases</SelectItem>
            {cases.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.id} — {c.person.fullName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="All" className="mt-5">
        <TabsList className="flex flex-wrap justify-start">
          {TYPES.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t === "All" ? "All" : `${t}s`}
              <span className="ml-2 font-mono text-[10px] text-muted-foreground">{filtered(t).length}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {TYPES.map((t) => (
          <TabsContent key={t} value={t} className="mt-4">
            <Table type={t} />
          </TabsContent>
        ))}
      </Tabs>

      <section className="panel mt-6" aria-labelledby="audit-trail">
        <header className="border-b border-border px-4 py-3">
          <h2 id="audit-trail" className="text-sm font-semibold">Evidence audit trail</h2>
        </header>
        <ul className="divide-y divide-border">
          {auditLog
            .filter((l) => l.action.toLowerCase().includes("evidence"))
            .map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{l.timestamp}</span>
                <span className="font-medium">{l.user}</span>
                <span className="text-muted-foreground">{l.action}</span>
                <span className="font-mono text-xs">{l.object}</span>
                {l.caseId ? <span className="font-mono text-xs text-muted-foreground">{l.caseId}</span> : null}
                <span className="ml-auto text-xs text-muted-foreground">{l.metadata}</span>
              </li>
            ))}
        </ul>
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.id} — {active?.type}</DialogTitle>
            <DialogDescription>{active?.title}</DialogDescription>
          </DialogHeader>
          <dl className="grid gap-px border border-border bg-border text-sm sm:grid-cols-2">
            {[
              ["Case", active?.caseId ?? "—"],
              ["Uploaded by", active?.uploadedBy ?? "—"],
              ["Date", active ? formatDateTime(active.uploadedAt) : "—"],
              ["Location", active?.location ?? "—"],
              ["Status", active?.status ?? "—"],
              ["Size", active?.sizeLabel ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="bg-card px-3 py-2">
                <dt className="eyebrow text-muted-foreground">{k}</dt>
                <dd className="mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="space-y-2">
            <Label htmlFor="ev-note">Add a note</Label>
            <Textarea id="ev-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <DialogFooter className="flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.info("Download requires authorized access", { description: "Evidence files are stored privately in this environment." })}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button variant="outline" onClick={() => toast.success("Linked to case", { description: `${active?.id} linked to ${active?.caseId}.` })}>
              <Link2 className="mr-2 h-4 w-4" /> Link to case
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (active) {
                  setItems((prev) => prev.map((i) => (i.id === active.id ? { ...i, status: "Flagged" } : i)));
                  toast.success("Evidence flagged for review");
                  setActive(null);
                }
              }}
            >
              <Flag className="mr-2 h-4 w-4" /> Flag
            </Button>
            <Button
              disabled={note.trim().length < 3}
              onClick={() => {
                toast.success("Note added", { description: `Recorded against ${active?.id}.` });
                setNote("");
                setActive(null);
              }}
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" /> Save note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
