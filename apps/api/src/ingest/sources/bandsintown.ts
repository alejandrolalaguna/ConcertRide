import { createStubAdapter } from "./_stub";

// TODO(M5+): BandsInTown public API for artist-based lookups. Primarily used
// as enrichment (canonical artist IDs) + dedup helper against Ticketmaster.
export const bandsintown = createStubAdapter({
  id: "bandsintown",
  tier: 3,
  displayName: "BandsInTown",
  mode: "api",
  legal: "public-api",
});
