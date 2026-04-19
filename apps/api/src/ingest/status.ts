// In-memory run log. Resets on isolate churn — good enough for advisory status.
// Promoted to a DB table if/when durable history becomes a requirement.

import type { SourceTier, TierRunStatus } from "./types";

const runs = new Map<SourceTier, TierRunStatus>();

export function recordRun(status: TierRunStatus) {
  runs.set(status.tier, status);
}

export function listRuns(): TierRunStatus[] {
  return [...runs.values()].sort((a, b) => b.started_at.localeCompare(a.started_at));
}
