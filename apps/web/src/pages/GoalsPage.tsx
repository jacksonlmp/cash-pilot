import { Card } from "@/components/ui/Card";
import { FeaturePreviewPage } from "@/components/layout/FeaturePreviewPage";
import { useGoals } from "@/features/goals/hooks/useGoals";
import { formatCurrency } from "@/lib/formatters";

export function GoalsPage() {
  const query = useGoals();

  return (
    <FeaturePreviewPage
      eyebrow="Goals"
      title="Metas e reservas"
      description="Leitura simples de progresso para o planejamento financeiro principal."
      query={query}
      chips={["Prioritarias", "Em andamento", "Concluidas"]}
      renderContent={(goals) => (
        <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((goal) => {
            const target = goal.monthlyTarget || goal.targetAmount;
            const progress = Math.min((goal.currentAmount / target) * 100, 100);
            return (
              <Card key={goal.id} className="space-y-4">
                <div>
                  <p className="text-sm font-medium">{goal.name}</p>
                  <p className="text-xs text-on-surface-variant">{goal.goalType}</p>
                </div>
                <p className="font-display text-4xl font-bold">{progress.toFixed(0)}%</p>
                <div className="h-3 rounded-full bg-surface-container-low">
                  <div
                    className="h-3 rounded-full bg-secondary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span>{formatCurrency(target)}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      emptyTitle="Nenhuma meta definida"
      emptyDescription="Crie a primeira reserva e acompanhe o progresso com menos atrito."
    />
  );
}
