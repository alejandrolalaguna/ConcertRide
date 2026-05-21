import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("@/lib/api", () => ({ api: {}, ApiError: class extends Error {} }));
vi.mock("../lib/api", () => ({ api: {}, ApiError: class extends Error {} }));

import { MemoryRouter } from "react-router-dom";
import MapView from "./MapView";
import RideRouteMap from "./RideRouteMap";
import { hasWebGL } from "../lib/webglSupport";

describe("Map components — graceful degradation without WebGL", () => {
  it("hasWebGL() returns false in jsdom (no WebGL runtime)", () => {
    // jsdom does not implement WebGLRenderingContext. hasWebGL() must return
    // false so MapLibre is never constructed in tests.
    expect(hasWebGL()).toBe(false);
  });

  it("MapView renders without throwing when WebGL is unavailable", () => {
    const { container } = render(
      <MemoryRouter>
        <MapView concerts={[]} rides={[]} />
      </MemoryRouter>,
    );
    // Map container exists with the documented aria-label
    const region = container.querySelector('[role="region"][aria-label*="Mapa"]');
    expect(region).not.toBeNull();
    // Attribution badge is rendered (OSM Tile Usage Policy compliance)
    expect(container.textContent).toMatch(/OpenStreetMap/i);
  });

  it("RideRouteMap renders origin + venue info bar even without WebGL", () => {
    const ride = {
      id: "r1",
      origin_lat: 39.47,
      origin_lng: -0.37,
      origin_address: "Estación Norte",
      origin_city: "Valencia",
      concert: {
        venue: { name: "WiZink Center", city: "Madrid", lat: 40.42, lng: -3.67 },
      },
    } as never;
    const { container, getByText } = render(
      <MemoryRouter>
        <RideRouteMap ride={ride} />
      </MemoryRouter>,
    );
    // Info bar shows origin + venue (even if WebGL canvas can't render)
    expect(getByText(/Estación Norte/)).toBeInTheDocument();
    expect(getByText(/WiZink Center/)).toBeInTheDocument();
    // Attribution always present
    expect(container.textContent).toMatch(/OpenStreetMap/i);
  });
});
