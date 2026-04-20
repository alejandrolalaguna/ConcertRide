// Fetches national average fuel prices from the Spanish Ministry (MITECO).
// The endpoint returns ~11k petrol stations — we average across all of them.
// Prices are in the format "1,759" (comma decimal, €/L).

const MITECO_URL =
  "https://sedeaplicaciones.gob.es/servws/gasolineras/rest/EstacionesTerrestresHist/FechaReciente";

export interface FuelPrices {
  gasoline95: number; // €/L, national average
  diesel: number;     // €/L, national average
  updatedAt: string;  // ISO date
}

function parsePrice(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const n = parseFloat(raw.replace(",", "."));
  return isNaN(n) || n <= 0 ? null : n;
}

export async function fetchFuelPrices(): Promise<FuelPrices> {
  const res = await fetch(MITECO_URL, {
    headers: { Accept: "application/json" },
    // Workers have a 30s subrequest limit — the payload is ~3MB but fast
    signal: AbortSignal.timeout(25_000),
  });

  if (!res.ok) throw new Error(`MITECO responded ${res.status}`);

  const data = (await res.json()) as {
    ListaEESSPrecio?: Array<Record<string, string>>;
  };

  const stations = data.ListaEESSPrecio ?? [];
  if (stations.length === 0) throw new Error("MITECO: empty station list");

  let sum95 = 0, count95 = 0;
  let sumDiesel = 0, countDiesel = 0;

  for (const s of stations) {
    const p95 = parsePrice(s["Precio Gasolina 95 E5"]);
    if (p95) { sum95 += p95; count95++; }
    const pd = parsePrice(s["Precio Gasoleo A"]);
    if (pd) { sumDiesel += pd; countDiesel++; }
  }

  if (count95 === 0 || countDiesel === 0) throw new Error("MITECO: no valid prices found");

  return {
    gasoline95: Math.round((sum95 / count95) * 1000) / 1000,
    diesel: Math.round((sumDiesel / countDiesel) * 1000) / 1000,
    updatedAt: new Date().toISOString(),
  };
}
