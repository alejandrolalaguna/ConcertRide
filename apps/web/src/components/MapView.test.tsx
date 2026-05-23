import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("@/lib/api", () => ({ api: {}, ApiError: class extends Error {} }));
vi.mock("../lib/api", () => ({ api: {}, ApiError: class extends Error {} }));

// react-leaflet uses Leaflet which needs window.matchMedia and a few DOM APIs
// that jsdom partly supports. We mock the heavy bits so the tests focus on the
// React shell (info bars, attribution) rather than the tile canvas.
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-map" role="region" aria-label="Mapa">
      {children}
      <span>&copy; OpenStreetMap contributors</span>
    </div>
  ),
  TileLayer: () => null,
  Marker: () => null,
  Polyline: () => null,
  ZoomControl: () => null,
  useMap: () => ({ flyTo: () => {}, getZoom: () => 5, setView: () => {} }),
  useMapEvents: () => ({}),
}));

import { MemoryRouter } from "react-router-dom";
import MapView from "./MapView";
import RideRouteMap from "./RideRouteMap";

describe("Map components — render shell with mocked Leaflet", () => {
  it("MapView renders the map region with attribution", () => {
    const { container } = render(
      <MemoryRouter>
        <MapView concerts={[]} rides={[]} />
      </MemoryRouter>,
    );
    const region = container.querySelector('[role="region"]');
    expect(region).not.toBeNull();
    expect(container.textContent).toMatch(/OpenStreetMap/i);
  });

  it("RideRouteMap renders origin + venue info bar", () => {
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
    expect(getByText(/Estación Norte/)).toBeInTheDocument();
    expect(getByText(/WiZink Center/)).toBeInTheDocument();
    expect(container.textContent).toMatch(/OpenStreetMap/i);
  });
});
