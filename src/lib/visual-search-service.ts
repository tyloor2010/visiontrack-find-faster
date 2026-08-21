/**
 * visualSearchService
 *
 * Abstraction boundary between the VisionTrack interface and a computer-vision
 * backend. In this environment every response is simulated sample output and is
 * labelled as such in the UI. Replacing `adapter` with an HTTP client that calls
 * a real inference service is the only change required — no UI code depends on
 * the simulation.
 */

import { matches, type PotentialMatch } from "./demo-data";

export type SearchStage =
  | "queued"
  | "preparing"
  | "analyzing"
  | "comparing"
  | "ranking"
  | "complete"
  | "failed";

export const STAGE_LABELS: Record<SearchStage, string> = {
  queued: "Queued",
  preparing: "Preparing image",
  analyzing: "Analyzing visual features",
  comparing: "Comparing authorized evidence",
  ranking: "Ranking potential matches",
  complete: "Search complete",
  failed: "Search failed",
};

export interface SearchJobInput {
  caseId: string;
  referenceImageName?: string;
  searchAreaKm: number;
  dateRange: string;
  evidenceSource: string;
  similarityThreshold: number;
}

export interface SearchJob {
  id: string;
  input: SearchJobInput;
  createdAt: string;
  stage: SearchStage;
  candidatesScanned: number;
}

export interface SearchResultSet {
  jobId: string;
  simulated: true;
  candidatesScanned: number;
  results: PotentialMatch[];
}

export interface UploadedEvidence {
  id: string;
  name: string;
  sizeLabel: string;
  kind: "Image" | "Video" | "Document" | "Other";
  previewSeed: number;
}

const STAGE_ORDER: SearchStage[] = ["preparing", "analyzing", "comparing", "ranking", "complete"];

function id(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 8999)}`;
}

export const visualSearchService = {
  createSearchJob(input: SearchJobInput): SearchJob {
    return {
      id: id("SJ"),
      input,
      createdAt: new Date().toISOString(),
      stage: "queued",
      candidatesScanned: 0,
    };
  },

  uploadEvidence(file: File): UploadedEvidence {
    const kind: UploadedEvidence["kind"] = file.type.startsWith("image/")
      ? "Image"
      : file.type.startsWith("video/")
        ? "Video"
        : file.type.includes("pdf") || file.type.includes("text")
          ? "Document"
          : "Other";
    return {
      id: id("EV"),
      name: file.name,
      sizeLabel: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      kind,
      previewSeed: Math.floor(Math.random() * 360),
    };
  },

  /** Drives the staged progress of a job. Returns a cancel function. */
  processImage(
    job: SearchJob,
    onStage: (stage: SearchStage, progress: number, scanned: number) => void,
    onDone: (results: SearchResultSet) => void,
    onError?: (message: string) => void,
  ): () => void {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const total = 900 + Math.floor(Math.random() * 900);

    STAGE_ORDER.forEach((stage, index) => {
      timers.push(
        setTimeout(
          () => {
            if (cancelled) return;
            const progress = Math.round(((index + 1) / STAGE_ORDER.length) * 100);
            onStage(stage, progress, Math.round((total * (index + 1)) / STAGE_ORDER.length));
            if (stage === "complete") {
              try {
                onDone(this.getSearchResults(job, total));
              } catch (error) {
                onError?.(error instanceof Error ? error.message : "Unexpected error");
              }
            }
          },
          650 * (index + 1),
        ),
      );
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  },

  getSearchResults(job: SearchJob, candidatesScanned = 1200): SearchResultSet {
    const pool = matches.filter((m) => m.caseId === job.input.caseId);
    const base = pool.length > 0 ? pool : matches.slice(0, 3).map((m) => ({ ...m, caseId: job.input.caseId }));
    const results = base
      .filter((m) => m.similarity >= job.input.similarityThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .map((m, i) => ({ ...m, rank: i + 1 }));
    return { jobId: job.id, simulated: true, candidatesScanned, results };
  },

  reviewResult(
    resultId: string,
    decision: "saved" | "dismissed" | "in-review",
    reviewer: string,
  ): { resultId: string; status: PotentialMatch["status"]; reviewer: string; decidedAt: string } {
    const status: PotentialMatch["status"] =
      decision === "saved" ? "Saved Lead" : decision === "dismissed" ? "Dismissed" : "In Review";
    return { resultId, status, reviewer, decidedAt: new Date().toISOString() };
  },
};

export const SIMILARITY_DISCLAIMER =
  "Similarity scores are algorithmic indicators, not identity confirmation. Every potential match must be reviewed by an authorized human.";
