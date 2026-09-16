import { ROUTE_LANDINGS, BIG_ORIGIN_SLUGS, TIER1_FESTIVAL_SLUGS } from '../src/lib/routeLandings.ts';
let curated=0, big=0, tier1=0, other=0;
const tier1OnlyByFest = {};
for (const r of ROUTE_LANDINGS) {
  const isCur = r.festival.originCities.some(oc => oc.city === r.originCity);
  if (isCur) { curated++; continue; }
  if (BIG_ORIGIN_SLUGS.has(r.originCitySlug)) { big++; continue; }
  if (TIER1_FESTIVAL_SLUGS.has(r.festival.slug)) {
    tier1++;
    tier1OnlyByFest[r.festival.slug] = (tier1OnlyByFest[r.festival.slug]||0)+1;
    continue;
  }
  other++;
}
console.log('total:', ROUTE_LANDINGS.length);
console.log('curated:', curated);
console.log('algo via BIG_ORIGIN (>200k hab):', big);
console.log('algo via TIER1 festival ONLY (small city + big festival):', tier1);
console.log('unclassified:', other);
console.log('\nTIER1-only breakdown by festival:');
Object.entries(tier1OnlyByFest).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log('  ',k,v));
