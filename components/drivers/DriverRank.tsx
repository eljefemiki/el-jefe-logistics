import type { DriverRank } from "@/src/server/drivers/types";

interface DriverRankBadgeProps {
  rank: DriverRank;
}

const rankStyles: Record<DriverRank, string> = {
  TRAINEE:
    "border-slate-500/20 bg-slate-500/10 text-slate-300",
  JUNIOR:
    "border-blue-500/20 bg-blue-500/10 text-blue-300",
  SENIOR:
    "border-purple-500/20 bg-purple-500/10 text-purple-300",
  ELITE:
    "border-amber-500/20 bg-amber-500/10 text-amber-300",
};

const rankLabels: Record<DriverRank, string> = {
  TRAINEE: "Trainee",
  JUNIOR: "Junior",
  SENIOR: "Senior",
  ELITE: "Elite",
};

export default function DriverRankBadge({
  rank,
}: DriverRankBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${rankStyles[rank]}`}
    >
      {rankLabels[rank]}
    </span>
  );
}
