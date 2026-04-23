import type { Env } from "../env";

// Returns true if the given user ID is in the ADMIN_USER_IDS env var. The
// env var is a comma-separated list so we can have multiple admins without
// a DB column (good for a zero-cost MVP).
export function isAdminUserId(env: Env, userId: string): boolean {
  if (!env.ADMIN_USER_IDS) return false;
  const set = new Set(env.ADMIN_USER_IDS.split(",").map((s) => s.trim()).filter(Boolean));
  return set.has(userId);
}
