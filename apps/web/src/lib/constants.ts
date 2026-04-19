export interface CityCoord {
  name: string;
  lat: number;
  lng: number;
}

export const SPANISH_CITIES: CityCoord[] = [
  { name: "Madrid", lat: 40.4168, lng: -3.7038 },
  { name: "Barcelona", lat: 41.3851, lng: 2.1734 },
  { name: "Valencia", lat: 39.4699, lng: -0.3763 },
  { name: "Sevilla", lat: 37.3891, lng: -5.9845 },
  { name: "Zaragoza", lat: 41.6488, lng: -0.8891 },
  { name: "Málaga", lat: 36.7213, lng: -4.4213 },
  { name: "Murcia", lat: 37.9922, lng: -1.1307 },
  { name: "Palma de Mallorca", lat: 39.5696, lng: 2.6502 },
  { name: "Las Palmas", lat: 28.1235, lng: -15.4363 },
  { name: "Bilbao", lat: 43.263, lng: -2.935 },
  { name: "Alicante", lat: 38.3452, lng: -0.481 },
  { name: "Córdoba", lat: 37.8882, lng: -4.7794 },
  { name: "Valladolid", lat: 41.6523, lng: -4.7245 },
  { name: "Vigo", lat: 42.2406, lng: -8.7207 },
  { name: "Gijón", lat: 43.5322, lng: -5.6611 },
  { name: "Oviedo", lat: 43.3619, lng: -5.8494 },
  { name: "A Coruña", lat: 43.3623, lng: -8.4115 },
  { name: "Granada", lat: 37.1773, lng: -3.5986 },
  { name: "Pamplona", lat: 42.8125, lng: -1.6458 },
  { name: "Santander", lat: 43.4623, lng: -3.8099 },
];

export const SPANISH_CITIES_BY_NAME: Record<string, CityCoord> = Object.fromEntries(
  SPANISH_CITIES.map((c) => [c.name, c]),
);

export const VIBE_LABELS = {
  party: { emoji: "🎉", label: "PARTY", description: "Volumen al máximo, playlist colaborativa." },
  chill: { emoji: "😌", label: "CHILL", description: "Conversación tranquila, música de fondo." },
  mixed: { emoji: "🎵", label: "MIXED", description: "Depende del grupo y del momento." },
} as const;
