import { Card } from "@/components/ui/Card";
import { formatCompactCurrency } from "@/lib/formatters";
import type { Goal } from "@/types/domain";

type GoalsProgressCardProps = {
  goals: Goal[];
};

export function GoalsProgressCard({ goals }: GoalsProgressCardProps) {
  return (
    <Card className="space-y-5 bg-surface-container-low">
      <div>
        <p className="text-sm text-on-surface-variant">Goals</p>
        <h3 className="mt-1 font-display text-2xl font-bold">Reservas em construcao</h3>
      </div>
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          return (
            <div key={goal.id} className="space-y-2 rounded-3xl bg-surface-container-lowest p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-on-surface">{goal.name}</p>
                  <p className="text-xs text-on-surface-variant">{goal.dueLabel}</p>
                </div>
                <p className="text-sm text-on-surface-variant">{progress.toFixed(0)}%</p>
              </div>
              <div className="h-2 rounded-full bg-surface-container-high">
                <div
                  className="h-2 rounded-full bg-secondary"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>{formatCompactCurrency(goal.currentAmount)}</span>
                <span>{formatCompactCurrency(goal.targetAmount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
