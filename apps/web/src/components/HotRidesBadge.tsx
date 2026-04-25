interface Props {
  seatsTaken: number;
  seatsTotal: number;
}

export function HotRidesBadge({ seatsTaken, seatsTotal }: Props) {
  // Show badge if 75%+ of seats are taken (high demand indicator)
  const occupancyRate = seatsTotal > 0 ? (seatsTaken / seatsTotal) * 100 : 0;

  if (occupancyRate < 75) return null;

  return (
    <span className="inline-block font-sans text-[10px] font-semibold text-cr-secondary bg-cr-secondary/20 px-1.5 py-0.5 tracking-[0.08em] rounded">
      🔥 Popular
    </span>
  );
}
