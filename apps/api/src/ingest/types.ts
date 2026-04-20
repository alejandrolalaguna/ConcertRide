export type SourceId =
  | "ticketmaster"
  | "dice"
  | "eventbrite"
  | "bandsintown";

export type SourceTier = 1 | 2 | 3;

export type SourceMode = "api" | "scrape" | "feed";
export type SourceLegal = "public-api" | "public-html" | "partner-approved";

export interface RawConcert {
  source: SourceId;
  source_event_id: string;
  source_url: string;
  artist: string;
  title: string | null;
  venue_name: string;
  venue_city: string;
  venue_lat: number | null;
  venue_lng: number | null;
  date_iso: string;
  image_url: string | null;
  price_min: number | null;
  price_max: number | null;
  genre: string | null;
  fetched_at: string;
}

export interface FetchOptions {
  fromDate: string;
  toDate: string;
}

export interface SourceAdapter {
  id: SourceId;
  tier: SourceTier;
  displayName: string;
  mode: SourceMode;
  legal: SourceLegal;
  fetch(opts: FetchOptions, env: AdapterEnv): Promise<RawConcert[]>;
}

// Subset of the Worker Env that adapters actually need — avoids a circular
// import with routes/index.
export interface AdapterEnv {
  TICKETMASTER_API_KEY?: string | undefined;
  EVENTBRITE_TOKEN?: string | undefined;
  DICE_PARTNER_KEY?: string | undefined;
}

export interface SourceRunStats {
  source: SourceId;
  fetched: number;
  inserted: number;
  merged: number;
  errors: string[];
  started_at: string;
  finished_at: string;
}

export interface TierRunStatus {
  tier: SourceTier;
  started_at: string;
  finished_at: string | null;
  sources: SourceRunStats[];
}
