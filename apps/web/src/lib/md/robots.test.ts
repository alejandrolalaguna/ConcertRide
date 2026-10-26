import { describe, expect, it } from "vitest";
import { ROBOTS_ALLOW, ROBOTS_DISALLOW } from "./site";
import robots from "../../../public/robots.txt?raw";

// robots.txt ⇄ ROBOTS_DISALLOW (also published in /ai.txt § Scope Limitations).
// A bot that matches a named group ignores `*` (RFC 9309 §2.2.1), so every
// group must carry the same rules — the bug fixed on 2026-10-26.

interface Group {
  agents: string[];
  allow: string[];
  disallow: string[];
}

function parseGroups(txt: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  let lastWasAgent = false;
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const [key, ...rest] = line.split(":");
    const k = key!.trim().toLowerCase();
    const v = rest.join(":").trim();
    if (k === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], allow: [], disallow: [] };
        groups.push(current);
      }
      current.agents.push(v);
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (k === "allow") current?.allow.push(v);
      if (k === "disallow") current?.disallow.push(v);
    }
  }
  return groups;
}

const groups = parseGroups(robots);

describe("robots.txt", () => {
  it("every group disallows exactly ROBOTS_DISALLOW and allows ROBOTS_ALLOW", () => {
    expect(groups.length).toBeGreaterThan(0);
    for (const g of groups) {
      expect({ agents: g.agents[0], disallow: [...g.disallow].sort() }).toEqual({
        agents: g.agents[0],
        disallow: [...ROBOTS_DISALLOW].sort(),
      });
      expect([...g.allow].sort()).toEqual([...ROBOTS_ALLOW].sort());
    }
  });

  it("explicitly lists the AI search and user-fetch crawlers", () => {
    const agents = new Set(groups.flatMap((g) => g.agents));
    for (const bot of ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"]) {
      expect(agents.has(bot)).toBe(true);
    }
  });

  it("never blocks the markdown endpoints (they carry noindex, SKILL §AF)", () => {
    expect(ROBOTS_ALLOW).toContain("/api/md/");
    expect(ROBOTS_DISALLOW.some((d) => d.endsWith(".md"))).toBe(false);
  });

  it("points to the agent files and the sitemap", () => {
    expect(robots).toMatch(/llms\.txt/);
    expect(robots).toMatch(/ai\.txt/);
    expect(robots).toMatch(/^Sitemap: https:\/\/concertride\.me\/sitemap\.xml$/m);
  });
});
