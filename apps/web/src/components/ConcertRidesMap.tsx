import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import maplibregl, { Map as MapLibreMap, LngLatBounds } from "maplibre-gl";
import type { Concert, Ride } from "@concertride/types";
import { OSM_RASTER_STYLE } from "@/lib/mapStyle";
import { mapTransformRequest } from "@/lib/mapTransformRequest";
import { hasWebGL } from "@/lib/webglSupport";
import MapAttribution from "./MapAttribution";
import "./MapView.css";

interface Props {
  concert: Concert;
  rides: Ride[];
}

function makeVenueMarkerElement(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "cr-marker-wrapper";
  const inner = document.createElement("span");
  inner.className = "cr-marker-concert";
  inner.setAttribute("aria-hidden", "true");
  wrap.appendChild(inner);
  return wrap;
}

function makeOriginMarkerElement(rideId: string, onClick: (id: string) => void): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "cr-marker-wrapper";
  wrap.setAttribute("role", "button");
  wrap.setAttribute("tabindex", "0");
  wrap.setAttribute("aria-label", "Ver detalle del viaje");
  const inner = document.createElement("span");
  inner.className = "cr-marker-origin";
  inner.setAttribute("aria-hidden", "true");
  wrap.appendChild(inner);

  const handler = (e: Event) => {
    e.stopPropagation();
    onClick(rideId);
  };
  wrap.addEventListener("click", handler);
  wrap.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(rideId);
    }
  });
  return wrap;
}

function makeClusterMarkerElement(count: number): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "cr-marker-wrapper";
  wrap.setAttribute("role", "button");
  wrap.setAttribute("tabindex", "0");
  wrap.setAttribute("aria-label", `${count} viajes agrupados. Ampliar para ver detalle.`);
  const inner = document.createElement("span");
  inner.className = "cr-marker-cluster";
  inner.textContent = String(count);
  inner.setAttribute("aria-hidden", "true");
  wrap.appendChild(inner);
  return wrap;
}

export default function ConcertRidesMap({ concert, rides }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!hasWebGL()) return;
    if (typeof concert.venue.lat !== "number" || typeof concert.venue.lng !== "number") return;

    const venue: [number, number] = [concert.venue.lng, concert.venue.lat];
    const validRides = rides.filter(
      (r) => typeof r.origin_lng === "number" && typeof r.origin_lat === "number",
    );

    // Build bounds: venue + all valid origins
    const bounds = new LngLatBounds(venue, venue);
    for (const r of validRides) {
      bounds.extend([r.origin_lng, r.origin_lat]);
    }

    const onlyVenue = validRides.length === 0;
    const useClustering = validRides.length > 10;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_RASTER_STYLE,
      ...(onlyVenue
        ? { center: venue, zoom: 10 }
        : { bounds, fitBoundsOptions: { padding: 60, animate: false } }),
      scrollZoom: false,
      attributionControl: false,
      transformRequest: mapTransformRequest,
    });

    const goToRide = (id: string) => {
      navigateRef.current(`/rides/${id}`);
    };

    const originMarkers: maplibregl.Marker[] = [];
    const clusterMarkers: maplibregl.Marker[] = [];

    function clearClusterMarkers() {
      while (clusterMarkers.length > 0) {
        const m = clusterMarkers.pop();
        if (m) m.remove();
      }
    }

    function renderClusterMarkers() {
      if (!useClustering) return;
      const features = map.querySourceFeatures("origins-cluster");
      clearClusterMarkers();

      const seen = new Set<number | string>();
      for (const feature of features) {
        const props = feature.properties ?? {};
        if (!props.cluster) continue;
        const clusterId = props.cluster_id as number;
        if (seen.has(clusterId)) continue;
        seen.add(clusterId);
        const geom = feature.geometry;
        if (!geom || geom.type !== "Point") continue;
        const [lng, lat] = geom.coordinates as [number, number];
        const count = Number(props.point_count ?? 0);
        const el = makeClusterMarkerElement(count);
        const expandCluster = () => {
          const src = map.getSource("origins-cluster") as maplibregl.GeoJSONSource | undefined;
          if (!src) return;
          src.getClusterExpansionZoom(clusterId).then((zoom) => {
            map.easeTo({ center: [lng, lat], zoom });
          }).catch(() => {});
        };
        el.addEventListener("click", expandCluster);
        el.addEventListener("keydown", (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            expandCluster();
          }
        });
        const marker = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
        clusterMarkers.push(marker);
      }
    }

    map.on("load", () => {
      if (useClustering) {
        map.addSource("origins-cluster", {
          type: "geojson",
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
          data: {
            type: "FeatureCollection",
            features: validRides.map((r) => ({
              type: "Feature",
              properties: { rideId: r.id },
              geometry: {
                type: "Point",
                coordinates: [r.origin_lng, r.origin_lat],
              },
            })),
          },
        });

        // Invisible circle layer so querySourceFeatures returns rendered clusters.
        // Visual rendering is done via HTML markers (cluster + origin).
        map.addLayer({
          id: "origins-clusters",
          type: "circle",
          source: "origins-cluster",
          filter: ["has", "point_count"],
          paint: {
            "circle-radius": 1,
            "circle-opacity": 0,
          },
        });
        map.addLayer({
          id: "origins-unclustered",
          type: "circle",
          source: "origins-cluster",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-radius": 1,
            "circle-opacity": 0,
          },
        });

        const refresh = () => {
          renderClusterMarkers();
          // Render unclustered origins as HTML markers too
          const features = map.querySourceFeatures("origins-cluster");
          // Remove any previous origin markers
          while (originMarkers.length > 0) {
            const m = originMarkers.pop();
            if (m) m.remove();
          }
          const seenRides = new Set<string>();
          for (const f of features) {
            const props = f.properties ?? {};
            if (props.cluster) continue;
            const rideId = String(props.rideId);
            if (seenRides.has(rideId)) continue;
            seenRides.add(rideId);
            const geom = f.geometry;
            if (!geom || geom.type !== "Point") continue;
            const [lng, lat] = geom.coordinates as [number, number];
            const el = makeOriginMarkerElement(rideId, goToRide);
            const marker = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
            originMarkers.push(marker);
          }
        };

        map.on("moveend", refresh);
        map.on("zoomend", refresh);
        map.on("sourcedata", (e) => {
          if (e.sourceId === "origins-cluster" && e.isSourceLoaded) refresh();
        });
        refresh();
      } else {
        // No clustering — render every origin as an interactive HTML marker.
        for (const r of validRides) {
          const el = makeOriginMarkerElement(r.id, goToRide);
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([r.origin_lng, r.origin_lat])
            .addTo(map);
          originMarkers.push(marker);
        }
      }
    });

    // Venue marker always rendered (above origins/clusters)
    new maplibregl.Marker({ element: makeVenueMarkerElement() }).setLngLat(venue).addTo(map);

    mapRef.current = map;

    return () => {
      while (originMarkers.length > 0) {
        const m = originMarkers.pop();
        if (m) m.remove();
      }
      while (clusterMarkers.length > 0) {
        const m = clusterMarkers.pop();
        if (m) m.remove();
      }
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concert.id, concert.venue.lat, concert.venue.lng, rides.length]);

  if (rides.length === 0) {
    return (
      <div className="cr-card p-6 text-center space-y-2">
        <p className="font-display text-lg uppercase">Sin viajes todavía</p>
        <p className="font-mono text-xs text-cr-text-muted">
          Sé el primero en publicar uno para {concert.artist}
        </p>
        <Link to={`/publicar?concert=${concert.id}`} className="cr-btn-primary mt-2 inline-block">
          Publicar viaje
        </Link>
      </div>
    );
  }

  return (
    <div className="cr-map border border-cr-border overflow-hidden">
      <div className="relative h-[360px] md:h-[480px] w-full">
        <div
          ref={containerRef}
          className="absolute inset-0"
          aria-label={`Mapa de ${concert.artist}: viajes hacia ${concert.venue.name}`}
          role="region"
        />
        <MapAttribution />
      </div>
    </div>
  );
}
