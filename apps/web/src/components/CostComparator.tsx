import { useState, useEffect } from "react";
import { Car, Fuel, Train, DollarSign } from "lucide-react";
import type { OriginCity } from "@/lib/festivalLandings";
import { api } from "@/lib/api";

interface Props {
  originCities: OriginCity[];
  festivalName: string;
  festivalCity: string;
}

const AVG_CONSUMPTION_L_PER_100KM = 7; // litros/100km
const TAXI_RATE_PER_KM = 1.1;          // €/km fuera de ciudad
const DEFAULT_FUEL_PRICE = 1.65;        // fallback si el API falla

function parsePriceFrom(range: string): number {
  const match = range.match(/(\d+(?:\.\d+)?)/);
  return match?.[1] != null ? parseFloat(match[1]) : 5;
}

function parsePriceTo(range: string): number {
  const matches = [...range.matchAll(/(\d+(?:\.\d+)?)/g)];
  const second = matches[1]?.[1];
  return second != null ? parseFloat(second) : parsePriceFrom(range) + 4;
}

export function CostComparator({ originCities, festivalName, festivalCity }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [persons, setPersons] = useState(2);
  const [fuelPrice, setFuelPrice] = useState(DEFAULT_FUEL_PRICE);

  useEffect(() => {
    api.fuel.prices()
      .then((r) => {
        if (r.gasoline95) setFuelPrice(r.gasoline95);
      })
      .catch(() => {}); // silently use default
  }, []);

  const origin = originCities[selectedIdx];
  if (!origin) return null;

  const km = origin.km;
  const totalKm = km * 2; // ida + vuelta

  // Coste gasolina (coche propio, ida+vuelta, dividido entre N personas)
  const fuelCostTotal = (totalKm * AVG_CONSUMPTION_L_PER_100KM / 100) * fuelPrice;
  const fuelCostPerPerson = fuelCostTotal / persons;

  // Carpooling ConcertRide (precio por asiento, solo ida)
  const carpoolFrom = parsePriceFrom(origin.concertRideRange);
  const carpoolTo = parsePriceTo(origin.concertRideRange);

  // Taxi estimado (solo ida)
  const taxiCost = Math.round(km * TAXI_RATE_PER_KM * 1.3); // +30% nocturno/festival

  const options = [
    {
      label: "ConcertRide",
      icon: Car,
      color: "text-cr-primary",
      bg: "bg-cr-primary/10",
      border: "border-cr-primary/40",
      priceLabel: carpoolFrom === carpoolTo
        ? `${carpoolFrom} €/asiento`
        : `${carpoolFrom}–${carpoolTo} €/asiento`,
      priceNote: "Sin comisión · ida",
      highlight: true,
    },
    {
      label: "Coche propio",
      icon: Fuel,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20",
      priceLabel: `~${fuelCostPerPerson.toFixed(0)} €/persona`,
      priceNote: `Gasolina ida+vuelta (${persons} personas, ${AVG_CONSUMPTION_L_PER_100KM.toFixed(0)}L/100km, ${fuelPrice.toFixed(2)} €/L)`,
      highlight: false,
    },
    {
      label: "Taxi / VTC",
      icon: DollarSign,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
      priceLabel: `~${taxiCost} €`,
      priceNote: "Solo ida · tarifa festiva +30%",
      highlight: false,
    },
    {
      label: "Bus / Tren",
      icon: Train,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
      priceLabel: "Variable",
      priceNote: "Consultar horarios · puede requerir transbordo",
      highlight: false,
    },
  ];

  return (
    <section className="my-10 rounded-2xl border border-white/10 bg-white/3 p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-cr-text">
          ¿Cuánto cuesta ir a {festivalName}?
        </h2>
        <div className="flex items-center gap-3 text-sm">
          <label className="text-cr-text-muted">Desde</label>
          <select
            value={selectedIdx}
            onChange={(e) => setSelectedIdx(Number(e.target.value))}
            className="rounded-lg border border-white/20 bg-cr-bg px-3 py-1.5 text-cr-text text-sm"
          >
            {originCities.map((c, i) => (
              <option key={c.city} value={i}>{c.city}</option>
            ))}
          </select>
          <label className="text-cr-text-muted">Personas</label>
          <select
            value={persons}
            onChange={(e) => setPersons(Number(e.target.value))}
            className="rounded-lg border border-white/20 bg-cr-bg px-3 py-1.5 text-cr-text text-sm"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-cr-text-muted">
        {origin.city} → {festivalCity} · {origin.km} km · {origin.drivingTime}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {options.map((opt) => (
          <div
            key={opt.label}
            className={`rounded-xl border p-4 space-y-2 ${opt.border} ${opt.bg} ${opt.highlight ? "ring-1 ring-cr-primary/30" : ""}`}
          >
            <div className={`flex items-center gap-2 text-sm font-semibold ${opt.color}`}>
              <opt.icon size={16} />
              {opt.label}
              {opt.highlight && (
                <span className="ml-auto rounded-full bg-cr-primary text-black text-[10px] font-bold px-1.5 py-0.5">
                  MEJOR PRECIO
                </span>
              )}
            </div>
            <p className="text-xl font-bold text-cr-text">{opt.priceLabel}</p>
            <p className="text-[11px] text-cr-text-muted leading-tight">{opt.priceNote}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <a
          href="/concerts"
          className="inline-flex items-center gap-2 rounded-xl bg-cr-primary px-6 py-3 text-sm font-bold text-black hover:bg-cr-primary/90 transition-colors"
        >
          <Car size={16} />
          Buscar carpooling a {festivalName} →
        </a>
      </div>
    </section>
  );
}
