import { expect, test, type BrowserContext } from "@playwright/test";

const API = "http://127.0.0.1:8787";

async function seedUser(
  context: BrowserContext,
  email: string,
  name: string,
) {
  const res = await context.request.post(`${API}/api/__test__/seed`, {
    data: { email, name },
  });
  if (![200, 201].includes(res.status())) {
    throw new Error(
      `__test__/seed returned ${res.status()}. Is TEST_MODE=true in .dev.vars?`,
    );
  }
  const body = (await res.json()) as { user: { id: string } };
  return body.user.id;
}

test.describe("Crew invite + accept flow", () => {
  test("user A invites user B; B sees the pending invite on /crew and accepts; both now show each other in their crew list", async ({
    browser,
  }) => {
    const stamp = Date.now();
    const aCtx = await browser.newContext();
    const bCtx = await browser.newContext();

    const aId = await seedUser(aCtx, `crew-a-${stamp}@e2e.test`, "Alpha Crew");
    const bId = await seedUser(bCtx, `crew-b-${stamp}@e2e.test`, "Bravo Crew");

    // A invites B via the API (UI flow for invitations is contextual to ride
    // pages — the API call exercises the same code path)
    const invite = await aCtx.request.post(`${API}/api/crew/invite`, {
      data: { user_id: bId },
    });
    expect(invite.status()).toBe(201);

    // B opens /crew and accepts the pending invite via the UI
    const bPage = await bCtx.newPage();
    await bPage.goto("/crew");
    await bPage.waitForLoadState("domcontentloaded");

    // Pending invite from A should appear
    await expect(bPage.getByText(/Alpha Crew/i)).toBeVisible({ timeout: 15_000 });
    const acceptBtn = bPage.getByRole("button", { name: /Aceptar/i }).first();
    await expect(acceptBtn).toBeVisible();
    await acceptBtn.click();

    // After accept, A appears in B's active crew (not pending anymore)
    await expect(
      bPage.getByRole("heading", { name: /Crew activa/i }),
    ).toBeVisible({ timeout: 10_000 });

    // Verify on A's side too via API (avoids UI race in CI)
    const aListRes = await aCtx.request.get(`${API}/api/crew`);
    expect(aListRes.status()).toBe(200);
    const aList = (await aListRes.json()) as {
      crew: Array<{ user: { id: string } }>;
      pending_outgoing: unknown[];
    };
    expect(aList.crew.some((m) => m.user.id === bId)).toBe(true);
    expect(aList.pending_outgoing).toHaveLength(0);

    void aId;
    await aCtx.close();
    await bCtx.close();
  });
});
