// Reusable OpenStreetMap attribution badge for ConcertRide maps. Required by
// the OSM Tile Usage Policy — must be visible and link to /copyright.
// We hide MapLibre's own attribution control via CSS and render this instead,
// styled to match ConcertRide's dark brutalist aesthetic.

type Props = {
  className?: string;
};

export function MapAttribution({ className = "" }: Props) {
  return (
    <div
      className={`pointer-events-auto absolute bottom-1 right-1 z-[2] rounded-sm bg-black/85 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wide text-cr-text/70 backdrop-blur-sm ${className}`}
    >
      ©{" "}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="text-cr-text/70 hover:text-cr-primary transition-colors"
      >
        OpenStreetMap
      </a>{" "}
      contributors
    </div>
  );
}

export default MapAttribution;
