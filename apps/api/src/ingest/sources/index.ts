import type { SourceAdapter, SourceTier } from "../types";
import { ticketmaster } from "./ticketmaster";
import { wegow } from "./wegow";
import { dice } from "./dice";
import { ra } from "./ra";
import { eventbrite } from "./eventbrite";
import { bandsintown } from "./bandsintown";

export const ADAPTERS: SourceAdapter[] = [
  ticketmaster,
  wegow,
  dice,
  ra,
  eventbrite,
  bandsintown,
];

export function getAdaptersForTier(tier: SourceTier): SourceAdapter[] {
  return ADAPTERS.filter((a) => a.tier === tier);
}

export function findAdapter(id: string): SourceAdapter | undefined {
  return ADAPTERS.find((a) => a.id === id);
}
