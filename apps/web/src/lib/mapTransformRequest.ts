// MapLibre GL transformRequest helper — adds an identifying User-Agent header
// to tile.openstreetmap.org requests. Required by the OSM Tile Usage Policy:
// https://operations.osmfoundation.org/policies/tiles/
//
// Note: browsers strip the User-Agent header from fetch() in most cases (they
// keep their own). The Referer (concertride.me in prod) plus the descriptive
// header on the server-rendered prerender requests is what makes us
// identifiable to OSMF if traffic ever needs to be investigated. We still set
// it where the browser permits it.

import type { RequestParameters, ResourceType } from "maplibre-gl";

const CONCERTRIDE_UA = "ConcertRide/1.0 (https://concertride.me)";

export function mapTransformRequest(
  url: string,
  _resourceType?: ResourceType,
): RequestParameters {
  if (url.includes("tile.openstreetmap.org")) {
    return {
      url,
      headers: { "User-Agent": CONCERTRIDE_UA },
    };
  }
  return { url };
}
