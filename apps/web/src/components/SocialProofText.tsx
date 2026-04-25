interface Props {
  seatsTaken: number;
  seatsTotal: number;
}

export function SocialProofText({ seatsTaken, seatsTotal }: Props) {
  if (seatsTotal === 0 || seatsTaken === 0) return null;

  const percentage = Math.round((seatsTaken / seatsTotal) * 100);

  return (
    <p className="font-mono text-[10px] text-cr-text-dim mt-1">
      {seatsTaken} confirmado{seatsTaken === 1 ? "" : "s"} · {percentage}% lleno
    </p>
  );
}
