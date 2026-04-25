import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, ZoomControl, Marker, useMap, useMapEvents } from "react-leaflet";
import { f as formatDay, a as formatTime, L as Link } from "../entry-server.js";
import L from "leaflet";
import "react-dom/server";
import "@remix-run/router";
import "react-router";
import "react-dom";
import "posthog-js";
const markerIcon2x = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABSCAMAAAAhFXfZAAAC91BMVEVMaXEzeak2f7I4g7g3g7cua5gzeKg8hJo3grY4g7c3grU0gLI2frE0daAubJc2gbQwd6QzeKk2gLMtd5sxdKIua5g1frA2f7IydaM0e6w2fq41fK01eqo3grgubJgta5cxdKI1f7AydaQydaMxc6EubJgvbJkwcZ4ubZkwcJwubZgubJcydqUydKIxapgubJctbJcubZcubJcvbJYubJcvbZkubJctbJctbZcubJg2f7AubJcrbZcubJcubJcua5g3grY0fq8ubJcubJdEkdEwhsw6i88vhswuhcsuhMtBjMgthMsrg8srgss6is8qgcs8i9A9iMYtg8spgcoogMo7hcMngMonf8olfso4gr8kfck5iM8jfMk4iM8he8k1fro7itAgesk2hs8eecgzfLcofssdeMg0hc4cd8g2hcsxeLQbdsgZdcgxeLImfcszhM0vda4xgckzhM4xg84wf8Yxgs4udKsvfcQucqhUndROmdM1fK0wcZ8vb5w0eqpQm9MzeKhXoNVcpdYydKNWn9VZotVKltJFjsIwcJ1Rms9OlslLmtH///8+kc9epdYzd6dbo9VHkMM2f7FHmNBClM8ydqVcpNY9hro3gLM9hLczealQmcw3fa46f7A8gLMxc6I3eagyc6FIldJMl9JSnNRSntNNl9JPnNJFi75UnM9ZodVKksg8kM45jc09e6ZHltFBk883gbRBh7pDk9EwcaBzn784g7dKkcY2i81Om9M7j85Llc81is09g7Q4grY/j9A0eqxKmdFFltBEjcXf6fFImdBCiLxJl9FGlNFBi78yiMxVndEvbpo6js74+vx+psPP3+o/ks5HkcpGmNCjwdZCkNDM3ehYoNJEls+lxNkxh8xHks0+jdC1zd5Lg6r+/v/H2ufz9/o3jM3t8/edvdM/k89Th61OiLBSjbZklbaTt9BfptdjmL1AicBHj8hGk9FAgK1dkLNTjLRekrdClc/k7fM0icy0y9tgp9c4jc2NtM9Dlc8zicxeXZn3AAAAQ3RSTlMAHDdTb4yPA+LtnEQmC4L2EmHqB7XA0d0sr478x4/Yd5i1zOfyPkf1sLVq4Nh3FvjxopQ2/STNuFzUwFIwxKaejILpIBEV9wAABhVJREFUeF6s1NdyFEcY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";
const markerIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=";
const markerShadow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });
const SPAIN_CENTER = [40.4168, -3.7038];
const SPAIN_BOUNDS = [
  [35.9, -9.5],
  [43.8, 4.4]
];
const TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const concertIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-concert" aria-hidden="true"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});
const originIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-origin" aria-hidden="true"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});
function CtrlScrollZoom() {
  const map = useMap();
  const containerRef = useRef(null);
  useEffect(() => {
    containerRef.current = map.getContainer();
    const el = containerRef.current;
    function onWheel(e) {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -1 : 1;
        map.setZoom(map.getZoom() + delta, { animate: true });
      }
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [map]);
  return null;
}
function CtrlHint() {
  const map = useMap();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => {
    const el = map.getContainer();
    function onWheel(e) {
      if (!e.ctrlKey) {
        setVisible(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setVisible(false), 1500);
      }
    }
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [map]);
  if (!visible) return null;
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-[999] flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxs("div", { className: "bg-cr-bg/90 backdrop-blur border border-cr-border px-4 py-2 font-mono text-xs text-cr-text-muted", children: [
    "Mantén ",
    /* @__PURE__ */ jsx("kbd", { className: "font-sans text-[10px] border border-cr-border px-1 py-0.5 text-cr-primary", children: "Ctrl" }),
    " para hacer zoom"
  ] }) });
}
function CloseOnMapClick({
  onClose,
  skipRef
}) {
  useMapEvents({
    click: () => {
      if (Date.now() - (skipRef.current ?? 0) > 80) onClose();
    }
  });
  return null;
}
function MapView({ concerts, rides }) {
  const [activeCity, setActiveCity] = useState(null);
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);
  const justOpenedRef = useRef(0);
  function closeAll() {
    setSelectedConcert(null);
    setSelectedRide(null);
  }
  function openConcert(c) {
    justOpenedRef.current = Date.now();
    setSelectedRide(null);
    setSelectedConcert(c);
  }
  function openRide(r) {
    justOpenedRef.current = Date.now();
    setSelectedConcert(null);
    setSelectedRide(r);
  }
  const cities = useMemo(() => {
    const set = new Set(concerts.map((c) => c.venue.city));
    return Array.from(set).sort();
  }, [concerts]);
  const visibleConcerts = useMemo(() => {
    if (!activeCity) return concerts;
    return concerts.filter((c) => c.venue.city === activeCity);
  }, [concerts, activeCity]);
  const visibleOrigins = useMemo(() => {
    if (!activeCity) return rides;
    const visibleIds = new Set(visibleConcerts.map((c) => c.id));
    return rides.filter((r) => visibleIds.has(r.concert_id));
  }, [rides, visibleConcerts, activeCity]);
  const ridesByConcert = useMemo(() => {
    const map = {};
    for (const r of rides) {
      const existing = map[r.concert_id];
      if (!existing) {
        map[r.concert_id] = [r];
      } else {
        existing.push(r);
      }
    }
    return map;
  }, [rides]);
  const concertRides = selectedConcert ? ridesByConcert[selectedConcert.id] ?? [] : [];
  const rideConcert = selectedRide ? concerts.find((c) => c.id === selectedRide.concert_id) ?? null : null;
  return /* @__PURE__ */ jsxs("div", { className: "cr-map relative h-[60vh] min-h-[420px] w-full border-y border-cr-border", children: [
    /* @__PURE__ */ jsxs(
      MapContainer,
      {
        center: SPAIN_CENTER,
        zoom: 6,
        maxBounds: SPAIN_BOUNDS,
        minZoom: 5,
        maxZoom: 14,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: true,
        className: "h-full w-full",
        children: [
          /* @__PURE__ */ jsx(TileLayer, { url: TILE_URL, attribution: TILE_ATTR, subdomains: "abcd" }),
          /* @__PURE__ */ jsx(ZoomControl, { position: "topright" }),
          /* @__PURE__ */ jsx(CtrlScrollZoom, {}),
          /* @__PURE__ */ jsx(CtrlHint, {}),
          /* @__PURE__ */ jsx(CloseOnMapClick, { onClose: closeAll, skipRef: justOpenedRef }),
          visibleConcerts.map((c) => /* @__PURE__ */ jsx(
            Marker,
            {
              position: [c.venue.lat, c.venue.lng],
              icon: concertIcon,
              title: `${c.artist} — ${c.venue.city}`,
              eventHandlers: { click: () => openConcert(c) }
            },
            c.id
          )),
          visibleOrigins.map((r) => /* @__PURE__ */ jsx(
            Marker,
            {
              position: [r.origin_lat, r.origin_lng],
              icon: originIcon,
              title: `${r.origin_city} → ${r.concert.venue.city} · €${r.price_per_seat} · ${r.seats_left} plaza${r.seats_left === 1 ? "" : "s"}`,
              eventHandlers: { click: () => openRide(r) }
            },
            r.id
          ))
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "absolute top-3 left-3 z-[1000] pointer-events-auto", children: [
      /* @__PURE__ */ jsx("label", { className: "sr-only", htmlFor: "map-city-filter", children: "Ciudad" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          id: "map-city-filter",
          value: activeCity ?? "",
          onChange: (e) => setActiveCity(e.target.value || null),
          className: "bg-cr-bg/90 backdrop-blur border border-cr-border text-cr-text font-sans text-[11px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 pr-7 hover:border-cr-primary focus:border-cr-primary focus:outline-none transition-colors [color-scheme:dark]",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Todas las ciudades" }),
            cities.map((city) => /* @__PURE__ */ jsx("option", { value: city, children: city }, city))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-8 left-3 z-[1000] pointer-events-none", children: /* @__PURE__ */ jsxs("div", { className: "bg-cr-bg/85 backdrop-blur border border-cr-border/60 px-3 py-1.5 font-mono text-[10px] flex gap-3", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-cr-primary font-semibold", children: visibleConcerts.length }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-cr-text-muted", children: "conciertos" })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-cr-border", children: "·" }),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-cr-secondary font-semibold", children: visibleOrigins.length }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-cr-text-muted", children: "viajes" })
      ] })
    ] }) }),
    selectedRide && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 right-3 z-[1000] w-[min(300px,calc(100vw-24px))] bg-cr-surface/96 backdrop-blur-md border border-cr-border pointer-events-auto shadow-[0_0_32px_rgba(0,0,0,0.8)]", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: closeAll,
          className: "absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center font-mono text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
          "aria-label": "Cerrar",
          children: "✕"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-cr-secondary flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-cr-secondary inline-block" }),
            "Salida desde ",
            selectedRide.origin_city
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-xl uppercase leading-tight pr-6", children: selectedRide.concert.artist }),
          /* @__PURE__ */ jsxs("p", { className: "font-mono text-[11px] text-cr-text-muted", children: [
            selectedRide.concert.venue.name,
            " · ",
            formatDay(selectedRide.concert.date)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("dl", { className: "grid grid-cols-3 gap-2 border-t border-dashed border-cr-border pt-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { className: "font-sans text-[9px] font-semibold uppercase tracking-[0.1em] text-cr-text-muted", children: "Precio" }),
            /* @__PURE__ */ jsxs("dd", { className: "font-mono text-sm text-cr-primary mt-0.5", children: [
              "€",
              selectedRide.price_per_seat
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { className: "font-sans text-[9px] font-semibold uppercase tracking-[0.1em] text-cr-text-muted", children: "Plazas" }),
            /* @__PURE__ */ jsx("dd", { className: "font-mono text-sm text-cr-text mt-0.5", children: selectedRide.seats_left })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { className: "font-sans text-[9px] font-semibold uppercase tracking-[0.1em] text-cr-text-muted", children: "Salida" }),
            /* @__PURE__ */ jsx("dd", { className: "font-mono text-[11px] text-cr-text mt-0.5", children: formatTime(selectedRide.departure_time) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "font-mono text-[11px] text-cr-text-muted", children: [
          "Conductor: ",
          /* @__PURE__ */ jsx("span", { className: "text-cr-text", children: selectedRide.driver.name }),
          selectedRide.instant_booking && /* @__PURE__ */ jsx("span", { className: "ml-2 font-sans text-[9px] font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-1.5 py-0.5", children: "Instant" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: `/rides/${selectedRide.id}`,
              className: "flex-1 flex items-center justify-center font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black py-2.5 hover:bg-cr-primary/90 transition-colors",
              children: "Ver viaje →"
            }
          ),
          rideConcert && /* @__PURE__ */ jsx(
            Link,
            {
              to: `/concerts/${rideConcert.id}`,
              className: "px-3 flex items-center justify-center font-sans text-xs font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors",
              children: "Concierto"
            }
          )
        ] })
      ] })
    ] }),
    selectedConcert && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 right-3 z-[1000] w-[min(320px,calc(100vw-24px))] bg-cr-surface/96 backdrop-blur-md border border-cr-border pointer-events-auto shadow-[0_0_32px_rgba(0,0,0,0.8)] flex flex-col max-h-[min(480px,55vh)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: closeAll,
            className: "absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center font-mono text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
            "aria-label": "Cerrar",
            children: "✕"
          }
        ),
        selectedConcert.image_url && /* @__PURE__ */ jsxs("div", { className: "h-24 overflow-hidden", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: selectedConcert.image_url,
              alt: "",
              "aria-hidden": "true",
              className: "w-full h-full object-cover opacity-50"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 h-24 bg-gradient-to-b from-transparent to-cr-surface/90" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 pb-2 space-y-0.5", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-cr-primary flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-cr-primary inline-block animate-pulse" }),
            concertRides.length,
            " viaje",
            concertRides.length === 1 ? "" : "s",
            " con plazas"
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-xl uppercase leading-tight pr-6", children: selectedConcert.artist }),
          /* @__PURE__ */ jsxs("p", { className: "font-mono text-[11px] text-cr-text-muted", children: [
            selectedConcert.venue.name,
            " · ",
            formatDay(selectedConcert.date)
          ] })
        ] })
      ] }),
      concertRides.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "flex-1 overflow-y-auto divide-y divide-cr-border border-t border-cr-border", children: concertRides.map((r) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/rides/${r.id}`,
          className: "flex items-center justify-between gap-3 px-4 py-3 hover:bg-cr-surface-2 transition-colors group",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-0.5", children: [
              /* @__PURE__ */ jsxs("p", { className: "font-sans text-xs font-semibold text-cr-text group-hover:text-cr-primary transition-colors truncate", children: [
                r.origin_city,
                r.origin_city !== selectedConcert.venue.city && /* @__PURE__ */ jsxs("span", { className: "text-cr-text-dim font-normal", children: [
                  " → ",
                  selectedConcert.venue.city
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "font-mono text-[10px] text-cr-text-muted", children: [
                formatTime(r.departure_time),
                " · ",
                r.driver.name
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 text-right space-y-0.5", children: [
              /* @__PURE__ */ jsxs("p", { className: "font-mono text-sm text-cr-primary leading-none", children: [
                "€",
                r.price_per_seat
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "font-mono text-[10px] text-cr-text-dim", children: [
                r.seats_left,
                " plaza",
                r.seats_left === 1 ? "" : "s"
              ] })
            ] })
          ]
        }
      ) }, r.id)) }) : /* @__PURE__ */ jsx("p", { className: "px-4 py-3 font-mono text-xs text-cr-text-dim border-t border-cr-border", children: "Sin viajes disponibles." }),
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 border-t border-cr-border p-3", children: /* @__PURE__ */ jsx(
        Link,
        {
          to: `/concerts/${selectedConcert.id}`,
          className: "w-full flex items-center justify-center font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black py-2.5 hover:bg-cr-primary/90 transition-colors",
          children: "Ver concierto completo →"
        }
      ) })
    ] })
  ] });
}
export {
  MapView as default
};
