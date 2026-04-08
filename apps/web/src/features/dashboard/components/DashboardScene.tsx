import { Plus } from "lucide-react";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { QuickActionMenu } from "@/components/layout/QuickActionMenu";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useDashboardSnapshot } from "@/features/dashboard/hooks/useDashboardSnapshot";
import { TransactionsList } from "@/features/transactions/components/TransactionsList";
import { formatCurrency } from "@/lib/formatters";
import { mapErrorMessage } from "@/services/errorMapper";

type DashboardSceneProps = {
  onQuickAction: (kind: "income" | "expense") => void;
};

export function DashboardScene({ onQuickAction }: DashboardSceneProps) {
  const dashboardQuery = useDashboardSnapshot();

  if (dashboardQuery.isLoading) {
    return <LoadingState />;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <ErrorState
        message={mapErrorMessage(dashboardQuery.error)}
        onRetry={() => void dashboardQuery.refetch()}
      />
    );
  }

  const { header, monthlySummary, reserveGoal, debtSummary, alerts, benefitCard, transactionsPreview } =
    dashboardQuery.data;

  return (
    <div className="space-y-8 pb-8">
      <section className="mb-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-on-surface">
              Ola, {header.displayName} 👋
            </h2>
            <div className="mt-2 flex items-end gap-3">
              <h1 className="font-display text-5xl font-extrabold tracking-tighter text-on-surface">
                {formatCurrency(header.currentBalance)}
              </h1>
              <Badge tone="positive" className="mb-2 gap-2 px-3 py-1 font-bold">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                {header.statusLabel}
              </Badge>
            </div>
          </div>
          <div className="hidden md:flex md:items-start md:justify-end">
            <QuickActionMenu onQuickAction={onQuickAction} />
          </div>
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => onQuickAction("expense")}
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition-all duration-300 ease-kinetic hover:shadow-lg"
            >
              <Plus size={18} />
              Adicionar
            </button>
          </div>
        </div>
      </section>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8 space-y-8 rounded-xl border border-outline/10 p-8 shadow-sm">
          <h3 className="font-display text-lg font-bold">Situacao do Mes</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="mb-1 text-[10px] font-bold uppercase text-on-surface-variant">
                Entradas
              </p>
              <p className="font-display text-xl font-bold text-secondary">
                {formatCurrency(monthlySummary.income)}
              </p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="mb-1 text-[10px] font-bold uppercase text-on-surface-variant">
                Saidas
              </p>
              <p className="font-display text-xl font-bold text-error">
                {formatCurrency(monthlySummary.expenses)}
              </p>
            </div>
            <div className="rounded-xl bg-primary p-4 text-white">
              <p className="mb-1 text-[10px] font-bold uppercase text-white/70">Saldo</p>
              <p className="font-display text-xl font-bold">
                {formatCurrency(monthlySummary.netBalance)}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-on-surface">
                Progresso do Orcamento
              </span>
              <span className="text-sm font-bold text-on-surface-variant">
                {Math.round(monthlySummary.budgetProgressPercent)}% gasto
              </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full bg-primary"
                style={{ width: `${Math.min(monthlySummary.budgetProgressPercent, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] font-medium text-on-surface-variant">
              Dica: Voce ainda tem {formatCurrency(monthlySummary.variableBudgetRemaining)}{" "}
              disponiveis para gastos variaveis este mes.
            </p>
          </div>
        </Card>

        <Card className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-outline/10 p-8 shadow-sm">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">S</div>
              <h3 className="font-display text-lg font-bold">{reserveGoal.title}</h3>
            </div>
            <p className="mb-6 text-sm text-on-surface-variant">
              Objetivo: Poupar {formatCurrency(reserveGoal.monthlyTarget)}/mes
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide">
                Progresso Mensal
              </span>
              <span className="text-sm font-bold text-primary">
                {Math.round(reserveGoal.progressPercent)}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full bg-primary"
                style={{ width: `${Math.min(reserveGoal.progressPercent, 100)}%` }}
              />
            </div>
            <p className="text-center text-xs text-on-surface-variant">
              Faltam {formatCurrency(reserveGoal.missingAmount)} para bater a meta!
            </p>
          </div>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 rounded-xl border border-outline/10 p-8 shadow-sm">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold">Dividas</h3>
              <p className="mt-1 text-xs text-on-surface-variant">
                Estrategia: {debtSummary.strategyName}
              </p>
            </div>
            <div className="rounded-lg bg-error/10 px-4 py-2 text-error">
              <p className="text-[10px] font-bold uppercase">Voce ficara livre em:</p>
              <p className="text-sm font-black">{debtSummary.payoffMonth ?? "Em breve"}</p>
            </div>
          </div>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="border-l-4 border-error pl-4">
              <p className="text-[10px] font-bold uppercase text-on-surface-variant">
                Total Restante
              </p>
              <p className="font-display text-2xl font-black text-on-surface">
                {formatCurrency(debtSummary.totalRemaining)}
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <p className="text-[10px] font-bold uppercase text-on-surface-variant">
                Parcela do Mes
              </p>
              <p className="font-display text-2xl font-black text-on-surface">
                {formatCurrency(debtSummary.monthlyPayment)}
              </p>
            </div>
          </div>
          <button className="w-full rounded-xl bg-primary py-3 font-bold text-white transition-all hover:bg-primary/90">
            Ver plano de quitacao
          </button>
        </Card>

        <Card className="lg:col-span-5 rounded-xl border border-outline/10 p-8 shadow-sm">
          <h3 className="mb-6 font-display text-lg font-bold">Alertas Inteligentes</h3>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl border p-4 ${
                  alert.tone === "alert"
                    ? "border-error/10 bg-error/10"
                    : "border-primary/10 bg-primary/10"
                }`}
              >
                <p className="text-sm font-bold text-on-surface">{alert.title}</p>
                <p className="text-xs text-on-surface-variant">{alert.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <section className="mb-8">
        <Card className="rounded-xl border border-outline/10 p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-2xl text-white">
                C
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">{benefitCard.title}</h3>
                <p className="text-sm text-on-surface-variant">
                  Final {benefitCard.lastFour} • {benefitCard.holderName}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase text-on-surface-variant">
                  Saldo Atual
                </p>
                <p className="font-display text-xl font-bold">
                  {formatCurrency(benefitCard.currentBalance)}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase text-on-surface-variant">
                  Gasto no Mes
                </p>
                <p className="font-display text-xl font-bold text-error">
                  {formatCurrency(benefitCard.monthlySpend)}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="mb-1 text-[10px] font-bold uppercase text-on-surface-variant">
                  Uso
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                    <div
                      className="h-full bg-secondary"
                      style={{ width: `${Math.min(benefitCard.usagePercent, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold">
                    {Math.round(benefitCard.usagePercent)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <TransactionsList transactions={transactionsPreview} />
    </div>
  );
}
