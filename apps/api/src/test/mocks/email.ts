// Shared in-memory mailbox for tests. Any test that wants to assert on
// outgoing emails imports `mockSent`, calls `clearSentEmails()` in beforeEach,
// then asserts after the request that triggered the email.
//
// Wiring: tests that need this MUST call `vi.mock("../lib/email", () => ...)`
// at module scope. The helper `installEmailMock()` below returns the factory
// you pass to vi.mock — it mocks every named export from lib/email.

import { vi } from "vitest";

export interface CapturedEmail {
  template: string;
  to: string;
  subject?: string;
  // Free-form payload — each wrapper records its own salient fields here.
  payload: Record<string, unknown>;
}

export const mockSent: CapturedEmail[] = [];

export function clearSentEmails(): void {
  mockSent.length = 0;
}

function record(template: string, to: string, payload: Record<string, unknown> = {}, subject?: string) {
  mockSent.push({ template, to, payload, subject });
  return Promise.resolve({ sent: true, id: `mock-${mockSent.length}` });
}

// Factory consumed by vi.mock("../lib/email", emailMockFactory)
export function emailMockFactory() {
  return {
    sendEmail: vi.fn(async (_env: unknown, params: { to: string; subject: string; html: string }) => {
      return record("raw", params.to, { html: params.html }, params.subject);
    }),
    sendPasswordResetEmail: vi.fn(async (_env: unknown, email: string, url: string) =>
      record("password_reset", email, { url }),
    ),
    sendMagicLinkEmail: vi.fn(async (_env: unknown, email: string, url: string) =>
      record("magic_link", email, { url }),
    ),
    sendWelcomeEmail: vi.fn(async (_env: unknown, email: string, name: string, verifyUrl: string) =>
      record("welcome", email, { name, verifyUrl }),
    ),
    sendSeatRequestedEmail: vi.fn(async (_env: unknown, driverEmail: string, payload: Record<string, unknown>) =>
      record("seat_requested", driverEmail, payload),
    ),
    sendSeatDecisionEmail: vi.fn(async (_env: unknown, passengerEmail: string, payload: Record<string, unknown>) =>
      record("seat_decision", passengerEmail, payload),
    ),
    sendRideReminderEmail: vi.fn(async (_env: unknown, email: string, payload: Record<string, unknown>) =>
      record("ride_reminder", email, payload),
    ),
    sendPreConcertReminderEmail: vi.fn(async (_env: unknown, email: string, payload: Record<string, unknown>) =>
      record("pre_concert", email, payload),
    ),
    sendCountdownReminderEmail: vi.fn(async (_env: unknown, email: string, payload: Record<string, unknown>) =>
      record("countdown", email, payload),
    ),
    sendPaymentReminderEmail: vi.fn(async (_env: unknown, email: string, payload: Record<string, unknown>) =>
      record("payment_reminder", email, payload),
    ),
    sendReviewPromptEmail: vi.fn(async (_env: unknown, email: string, payload: Record<string, unknown>) =>
      record("review_prompt", email, payload),
    ),
    sendDemandMatchEmail: vi.fn(async (_env: unknown, email: string, payload: Record<string, unknown>) =>
      record("demand_match", email, payload),
    ),
    sendLicenseReviewAdminEmail: vi.fn(async (env: { SUPPORT_EMAIL?: string }, payload: Record<string, unknown>) =>
      record("license_review_admin", env?.SUPPORT_EMAIL ?? "support@unknown", payload),
    ),
    sendLicenseReviewResultEmail: vi.fn(async (_env: unknown, email: string, payload: Record<string, unknown>) =>
      record("license_review_result", email, payload),
    ),
    sendIdentityReviewAdminEmail: vi.fn(async (env: { SUPPORT_EMAIL?: string }, payload: Record<string, unknown>) =>
      record("identity_review_admin", env?.SUPPORT_EMAIL ?? "support@unknown", payload),
    ),
    sendIdentityReviewResultEmail: vi.fn(async (_env: unknown, email: string, payload: Record<string, unknown>) =>
      record("identity_review_result", email, payload),
    ),
    sendBanNotificationEmail: vi.fn(async (_env: unknown, email: string, payload: Record<string, unknown>) =>
      record("ban_notification", email, payload),
    ),
  };
}

// Convenience: re-export for tests that just want `expect(mockSent[0].template).toBe(...)`.
export function lastSent(): CapturedEmail | undefined {
  return mockSent[mockSent.length - 1];
}

export function sentTo(email: string): CapturedEmail[] {
  return mockSent.filter((m) => m.to === email);
}

export function sentByTemplate(template: string): CapturedEmail[] {
  return mockSent.filter((m) => m.template === template);
}
