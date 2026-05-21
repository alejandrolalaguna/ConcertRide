// Module-level in-memory mailbox used by the Worker (NOT by vitest).
// The real `lib/email.ts` wrappers append here whenever the Worker boots with
// env.TEST_MODE === "true". Read via GET /api/__test__/emails.
//
// In vitest, the module is fully replaced via vi.mock() — see test/mocks/email.ts.
// So this file is only ever exercised when wrangler dev is running with TEST_MODE.

export interface LoggedEmail {
  template: string;
  to: string;
  subject?: string;
  payload: Record<string, unknown>;
  sentAt: string;
}

const log: LoggedEmail[] = [];

export function logTestEmail(entry: Omit<LoggedEmail, "sentAt">): void {
  log.push({ ...entry, sentAt: new Date().toISOString() });
  // Keep the log bounded so a long-running dev session doesn't OOM.
  if (log.length > 500) log.splice(0, log.length - 500);
}

export function getTestEmailLog(): LoggedEmail[] {
  return [...log];
}

export function clearTestEmailLog(): void {
  log.length = 0;
}
