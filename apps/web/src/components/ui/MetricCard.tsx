import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/formatters";

type MetricCardProps = {
  label: string;
  value: number;
  changeLabel: string;
  trend: "up" | "down";
};

export function MetricCard({ label, value, changeLabel, trend }: MetricCardProps) {
  const Icon = trend === "up" ? TrendingUp : TrendingDown;

  return (
    <Card elevated className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">{label}</p>
        <span
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full",
            trend === "up" ? "bg-secondary-container/60 text-secondary" : "bg-error/10 text-error",
          )}
        >
          <Icon size={18} />
        </span>
      </div>
      <div className="space-y-1">
        <p className="font-display text-3xl font-extrabold text-on-surface">{formatCurrency(value)}</p>
        <p className="text-sm text-on-surface-variant">{changeLabel}</p>
      </div>
    </Card>
  );
}
