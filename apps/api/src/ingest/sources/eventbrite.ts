import { createStubAdapter } from "./_stub";

// TODO(M5+): Eventbrite OAuth + Event Search API with location.address=ES.
// Needs EVENTBRITE_TOKEN secret.
export const eventbrite = createStubAdapter({
  id: "eventbrite",
  tier: 2,
  displayName: "Eventbrite España",
  mode: "api",
  legal: "public-api",
});
