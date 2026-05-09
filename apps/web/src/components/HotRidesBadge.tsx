interface Props {
  seatsTaken: number;
  seatsTotal: number;
}

export function HotRidesBadge({ seatsTaken, seatsTotal }: Props) {
  const occupancyRate = seatsTotal > 0 ? (seatsTaken / seatsTotal) * 100 : 0;
  if (occupancyRate < 75) return null;

  return (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-cr-secondary bg-cr-secondary/[0.12] border border-cr-secondary/30 px-2 py-0.5 uppercase tracking-[0.08em]">
      🔥 Popular
    </span>
  );
}
