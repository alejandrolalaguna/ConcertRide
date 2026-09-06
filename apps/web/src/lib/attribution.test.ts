import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ATTRIBUTION_STORAGE_KEY,
  attributionProperties,
  captureAttribution,
  clearAttribution,
  getAttribution,
  parseAttribution,
} from "./attribution";

/** Point jsdom's location at a given URL without a real navigation. */
function setUrl(url: string) {
  window.history.replaceState({}, "", url);
}

function setReferrer(value: string) {
  Object.defineProperty(document, "referrer", {
    configurable: true,
    value,
  });
}

describe("attribution", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    clearAttribution();
    setReferrer("");
    setUrl("/");
  });

  describe("parseAttribution", () => {
    it("extracts every utm_* param plus click ids", () => {
      const rec = parseAttribution(
        "?utm_source=tardeo&utm_medium=referral&utm_campaign=piloto-2026&utm_content=granada-sound-2026-cich14il&utm_term=carpooling&gclid=abc&fbclid=def",
        { landingPath: "/festivales/granada-sound", referrerHost: null },
      );
      expect(rec).not.toBeNull();
      expect(rec).toMatchObject({
        utm_source: "tardeo",
        utm_medium: "referral",
        utm_campaign: "piloto-2026",
        utm_content: "granada-sound-2026-cich14il",
        utm_term: "carpooling",
        gclid: "abc",
        fbclid: "def",
        landing_path: "/festivales/granada-sound",
      });
      expect(typeof rec!.first_seen_at).toBe("string");
    });

    it("promotes ?ref= to utm_source when no utm_source is present", () => {
      const rec = parseAttribution("?ref=tardeo", {
        landingPath: "/",
        referrerHost: null,
      });
      expect(rec?.utm_source).toBe("tardeo");
      expect(rec?.utm_medium).toBe("referral");
      expect(rec?.ref).toBe("tardeo");
    });

    it("falls back to the referrer host when there are no params", () => {
      const rec = parseAttribution("", {
        landingPath: "/festivales/mad-cool",
        referrerHost: "tardeo.app",
      });
      expect(rec).toMatchObject({
        utm_source: "tardeo.app",
        utm_medium: "referral",
        referrer_host: "tardeo.app",
      });
    });

    it("returns null for direct traffic (no params, no referrer)", () => {
      expect(parseAttribution("", { landingPath: "/", referrerHost: null })).toBeNull();
    });

    it("tolerates malformed query strings", () => {
      expect(() =>
        parseAttribution("?%%%&&=&utm_source=tardeo&utm_medium", {
          landingPath: "/",
          referrerHost: null,
        }),
      ).not.toThrow();
      const rec = parseAttribution("?%%%&&=&utm_source=tardeo&utm_medium", {
        landingPath: "/",
        referrerHost: null,
      });
      expect(rec?.utm_source).toBe("tardeo");
      // Present-but-empty param must normalise to null, not "".
      expect(rec?.utm_medium).toBeNull();
    });

    it("ignores whitespace-only values and truncates absurdly long ones", () => {
      const long = "x".repeat(500);
      const rec = parseAttribution(
        `?utm_source=tardeo&utm_campaign=${long}&utm_term=%20%20`,
        { landingPath: "/", referrerHost: null },
      );
      expect(rec?.utm_campaign).toHaveLength(200);
      expect(rec?.utm_term).toBeNull();
    });
  });

  describe("captureAttribution — first touch wins", () => {
    it("stores the record on the first attributed page view", () => {
      setUrl("/festivales/granada-sound?utm_source=tardeo&utm_medium=referral&utm_campaign=piloto-2026");
      const rec = captureAttribution();
      expect(rec?.utm_source).toBe("tardeo");
      expect(rec?.landing_path).toBe("/festivales/granada-sound");
      expect(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)).toBeTruthy();
    });

    it("returns null and does NOT overwrite on a second attributed view", () => {
      setUrl("/?utm_source=tardeo&utm_campaign=piloto-2026");
      expect(captureAttribution()?.utm_source).toBe("tardeo");

      setUrl("/?utm_source=instagram&utm_campaign=otra");
      expect(captureAttribution()).toBeNull();
      expect(getAttribution()?.utm_source).toBe("tardeo");
      expect(getAttribution()?.utm_campaign).toBe("piloto-2026");
    });

    it("does not wipe attribution on a param-less internal navigation", () => {
      setUrl("/?utm_source=tardeo");
      captureAttribution();
      setUrl("/publish");
      expect(captureAttribution()).toBeNull();
      expect(getAttribution()?.utm_source).toBe("tardeo");
    });

    it("returns null for direct traffic and stores nothing", () => {
      setUrl("/concerts");
      expect(captureAttribution()).toBeNull();
      expect(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)).toBeNull();
    });

    it("ignores a self-referral as an acquisition signal", () => {
      setReferrer(`${window.location.origin}/concerts`);
      setUrl("/concerts/123");
      expect(captureAttribution()).toBeNull();
    });

    it("never throws when sessionStorage is unavailable", () => {
      const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("SecurityError: storage disabled");
      });
      setUrl("/?utm_source=tardeo");
      expect(() => captureAttribution()).not.toThrow();
      expect(captureAttribution()).toBeNull();
      spy.mockRestore();
    });

    it("does not report a capture it could not persist", () => {
      const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
      setUrl("/?utm_source=tardeo");
      expect(captureAttribution()).toBeNull();
      spy.mockRestore();
    });
  });

  describe("getAttribution", () => {
    it("returns null on corrupted stored JSON", () => {
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, "{not json");
      expect(getAttribution()).toBeNull();
    });

    it("returns null on a stored value with the wrong shape", () => {
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify({ foo: 1 }));
      expect(getAttribution()).toBeNull();
    });
  });

  describe("attributionProperties", () => {
    it("prefixes keys and omits nulls", () => {
      setUrl("/rutas/madrid-mad-cool?utm_source=tardeo&utm_medium=referral");
      captureAttribution();
      const props = attributionProperties();
      expect(props.attr_source).toBe("tardeo");
      expect(props.attr_medium).toBe("referral");
      expect(props.attr_landing_path).toBe("/rutas/madrid-mad-cool");
      expect(props).not.toHaveProperty("attr_gclid");
    });

    it("returns an empty object when there is no attribution", () => {
      expect(attributionProperties(null)).toEqual({});
    });
  });
});
