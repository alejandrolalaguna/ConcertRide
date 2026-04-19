import { createStubAdapter } from "./_stub";

// TODO(M5+): partner API when DICE_PARTNER_KEY is provisioned; fallback to
// public HTML otherwise.
export const dice = createStubAdapter({
  id: "dice",
  tier: 1,
  displayName: "DICE.fm España",
  mode: "api",
  legal: "partner-approved",
});
