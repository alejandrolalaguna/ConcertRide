/**
 * WebMCP — expose ConcertRide site tools to AI agents via the browser.
 * Spec: https://webmachinelearning.github.io/webmcp/
 * Docs: https://developer.chrome.com/blog/webmcp-epp
 *
 * Call initWebMCP() once at page load (before React hydration) so the browser
 * detection mechanism can locate the tools. Returns an AbortController whose
 * signal can be used to deregister tools on cleanup.
 */

interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
}

declare global {
  interface Navigator {
    modelContext?: {
      registerTool: (tool: WebMCPTool) => { signal?: AbortSignal };
    };
  }
}

export function initWebMCP(): AbortController | null {
  if (typeof navigator === "undefined" || !navigator.modelContext) return null;

  const controller = new AbortController();

  const tools: WebMCPTool[] = [
    {
      name: "search_concerts",
      description:
        "Busca conciertos y festivales en España disponibles en ConcertRide. " +
        "Devuelve una lista de eventos con artista, recinto, ciudad y fecha.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Nombre del artista, festival o ciudad (e.g. 'Mad Cool', 'Barcelona', 'Primavera Sound')",
          },
          city: {
            type: "string",
            description: "Filtrar por ciudad del recinto (e.g. 'Madrid', 'Barcelona')",
          },
          date_from: {
            type: "string",
            format: "date",
            description: "Fecha de inicio en formato YYYY-MM-DD",
          },
          date_to: {
            type: "string",
            format: "date",
            description: "Fecha de fin en formato YYYY-MM-DD",
          },
          festivals_only: {
            type: "boolean",
            description: "Si es true, devuelve solo festivales (no conciertos individuales)",
          },
        },
      },
      execute: async (input) => {
        const params = new URLSearchParams();
        if (input.query) params.set("q", String(input.query));
        if (input.city) params.set("city", String(input.city));
        if (input.date_from) params.set("date_from", String(input.date_from));
        if (input.date_to) params.set("date_to", String(input.date_to));
        if (input.festivals_only) params.set("festivals_only", "true");
        const res = await fetch(`/api/concerts?${params}`);
        if (!res.ok) throw new Error(`search_concerts failed: ${res.status}`);
        return res.json();
      },
    },

    {
      name: "search_rides",
      description:
        "Busca viajes compartidos disponibles para un concierto específico en ConcertRide. " +
        "Útil para responder preguntas como '¿hay carpooling desde Madrid al Mad Cool?'",
      inputSchema: {
        type: "object",
        required: ["concert_id"],
        properties: {
          concert_id: {
            type: "string",
            description: "ID del concierto (obtenido con search_concerts)",
          },
          origin_city: {
            type: "string",
            description: "Ciudad de origen del viaje (e.g. 'Madrid', 'Barcelona')",
          },
        },
      },
      execute: async (input) => {
        const params = new URLSearchParams({ concert_id: String(input.concert_id) });
        if (input.origin_city) params.set("origin_city", String(input.origin_city));
        const res = await fetch(`/api/rides?${params}`);
        if (!res.ok) throw new Error(`search_rides failed: ${res.status}`);
        return res.json();
      },
    },

    {
      name: "get_festival_info",
      description:
        "Devuelve información detallada sobre un festival de música en España: " +
        "fechas, recinto, precios de carpooling desde distintas ciudades, FAQ de transporte. " +
        "Cubre Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Resurrection Fest, Arenal Sound, " +
        "Medusa, Viña Rock, O Son do Camiño, Cala Mijas, Sonorama, Low Festival, Tomavistas, Zevra, Cruïlla.",
      inputSchema: {
        type: "object",
        required: ["festival_slug"],
        properties: {
          festival_slug: {
            type: "string",
            description: "Slug del festival (e.g. 'mad-cool', 'primavera-sound', 'sonar')",
            enum: [
              "mad-cool", "primavera-sound", "sonar", "fib", "bbk-live",
              "resurrection-fest", "arenal-sound", "medusa-festival", "vina-rock",
              "o-son-do-camino", "cala-mijas", "sonorama-ribera", "low-festival",
              "tomavistas", "zevra-festival", "cruilla",
            ],
          },
        },
      },
      execute: async (input) => {
        const slug = String(input.festival_slug);
        const res = await fetch(`/festivales/${slug}`, {
          headers: { Accept: "text/markdown" },
        });
        if (!res.ok) throw new Error(`get_festival_info failed: ${res.status}`);
        const markdown = await res.text();
        return { slug, markdown, url: `https://concertride.es/festivales/${slug}` };
      },
    },

    {
      name: "get_city_concerts",
      description:
        "Devuelve la página de conciertos de una ciudad española en formato markdown. " +
        "Útil para responder '¿qué conciertos hay en Madrid?'",
      inputSchema: {
        type: "object",
        required: ["city_slug"],
        properties: {
          city_slug: {
            type: "string",
            description: "Slug de la ciudad",
            enum: [
              "madrid", "barcelona", "valencia", "sevilla", "bilbao",
              "malaga", "zaragoza", "granada", "donostia", "santiago-de-compostela",
            ],
          },
        },
      },
      execute: async (input) => {
        const slug = String(input.city_slug);
        const res = await fetch(`/conciertos/${slug}`, {
          headers: { Accept: "text/markdown" },
        });
        if (!res.ok) throw new Error(`get_city_concerts failed: ${res.status}`);
        const markdown = await res.text();
        return { slug, markdown, url: `https://concertride.es/conciertos/${slug}` };
      },
    },

    {
      name: "get_transport_guide",
      description:
        "Devuelve la guía completa de transporte para festivales en España: " +
        "comparativa carpooling vs bus vs taxi vs metro, precios, consejos para volver de madrugada.",
      inputSchema: {
        type: "object",
        properties: {},
      },
      execute: async () => {
        const res = await fetch("/guia-transporte-festivales", {
          headers: { Accept: "text/markdown" },
        });
        if (!res.ok) throw new Error(`get_transport_guide failed: ${res.status}`);
        const markdown = await res.text();
        return { markdown, url: "https://concertride.es/guia-transporte-festivales" };
      },
    },
  ];

  for (const tool of tools) {
    try {
      navigator.modelContext.registerTool(tool);
    } catch {
      // Browser doesn't support this tool — ignore
    }
  }

  return controller;
}
