import { expect, test, type BrowserContext } from "@playwright/test";

const API = "http://127.0.0.1:8787";

async function seedUser(context: BrowserContext, email: string, name: string) {
  const res = await context.request.post(`${API}/api/__test__/seed`, {
    data: { email, name, license_verified: true },
  });
  if (![200, 201].includes(res.status())) {
    throw new Error(
      `__test__/seed returned ${res.status()}. Is TEST_MODE=true in .dev.vars?`,
    );
  }
  const body = (await res.json()) as { user: { id: string } };
  return body.user.id;
}

test.describe("Direct messages — bidirectional conversation", () => {
  test("A starts a DM to B, B sees it and replies, both see both messages", async ({ browser }) => {
    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();

    const stamp = Date.now();
    const idA = await seedUser(ctxA, `dm-a-${stamp}@e2e.test`, "AliceDM");
    const idB = await seedUser(ctxB, `dm-b-${stamp}@e2e.test`, "BobDM");
    void idA;

    const pageA = await ctxA.newPage();
    await pageA.goto("/mensajes");
    await expect(pageA.getByText(/todavía no tienes conversaciones/i)).toBeVisible({
      timeout: 15_000,
    });

    // A opens DM to B directly via the URL pattern
    await pageA.goto(`/mensajes/${idB}`);
    const msgFromA = `Hola Bob ${stamp}`;
    const inputA = pageA.getByPlaceholder(/escribe un mensaje/i).first();
    await expect(inputA).toBeVisible({ timeout: 15_000 });
    await inputA.fill(msgFromA);
    await pageA.getByRole("button", { name: /enviar mensaje/i }).first().click();
    await expect(pageA.getByText(msgFromA)).toBeVisible({ timeout: 10_000 });

    // B opens the conversations list — should see Alice
    const pageB = await ctxB.newPage();
    await pageB.goto("/mensajes");
    await expect(pageB.getByRole("link", { name: /AliceDM/i })).toBeVisible({ timeout: 15_000 });

    // B clicks into the conversation and replies
    await pageB.getByRole("link", { name: /AliceDM/i }).click();
    const inputB = pageB.getByPlaceholder(/escribe un mensaje/i).first();
    await expect(inputB).toBeVisible({ timeout: 15_000 });
    await expect(pageB.getByText(msgFromA)).toBeVisible();

    const msgFromB = `Hola Alice, voy ${stamp}`;
    await inputB.fill(msgFromB);
    await pageB.getByRole("button", { name: /enviar mensaje/i }).first().click();
    await expect(pageB.getByText(msgFromB)).toBeVisible({ timeout: 10_000 });

    // A reloads and sees B's reply
    await pageA.reload();
    await expect(pageA.getByText(msgFromA)).toBeVisible({ timeout: 15_000 });
    await expect(pageA.getByText(msgFromB)).toBeVisible({ timeout: 15_000 });

    await ctxA.close();
    await ctxB.close();
  });
});
