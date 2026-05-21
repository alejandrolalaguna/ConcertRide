import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PUBLIC_PAGES = [
  { name: "concerts list", path: "/concerts" },
  { name: "login", path: "/login" },
  { name: "register", path: "/register" },
  { name: "publish gate", path: "/publish" },
  { name: "festival landing", path: "/festivales/mad-cool" },
  { name: "blog index", path: "/blog" },
  { name: "how it works", path: "/como-funciona" },
];

const COMMON_EXCLUDES = [".leaflet-control-attribution"];
const COMMON_DISABLED = ["frame-title", "target-size"];

for (const { name, path } of PUBLIC_PAGES) {
  test(`a11y: ${name} (${path})`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const builder = new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .disableRules(COMMON_DISABLED);
    for (const sel of COMMON_EXCLUDES) builder.exclude(sel);

    const results = await builder.analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );

    if (serious.length > 0) {
      // Surface the exact rules + nodes so failures are debuggable from CI logs
      console.log(
        `axe violations on ${path}:\n` +
          JSON.stringify(
            serious.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })),
            null,
            2,
          ),
      );
    }
    expect(serious).toHaveLength(0);
  });
}
