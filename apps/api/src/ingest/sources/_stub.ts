import type { RawConcert, SourceAdapter, SourceId, SourceLegal, SourceMode, SourceTier } from "../types";

// Creates a typed stub adapter. fetch() throws so the pipeline's per-source
// try/catch records it as an error without aborting the run. Replace with a
// real implementation per the M5 roadmap.
export function createStubAdapter(params: {
  id: SourceId;
  tier: SourceTier;
  displayName: string;
  mode: SourceMode;
  legal: SourceLegal;
}): SourceAdapter {
  return {
    ...params,
    async fetch(): Promise<RawConcert[]> {
      throw new Error(`adapter_not_implemented:${params.id}`);
    },
  };
}
