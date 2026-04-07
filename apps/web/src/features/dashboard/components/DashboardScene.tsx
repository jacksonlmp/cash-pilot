import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { mapErrorMessage } from "@/services/errorMapper";
import { useDashboardSnapshot } from "@/features/dashboard/hooks/useDashboardSnapshot";
import { AddTransactionForm } from "@/features/transactions/components/AddTransactionForm";
import { BalanceHero } from "@/features/dashboard/components/BalanceHero";
import { DebtPressureCard } from "@/features/dashboard/components/DebtPressureCard";
import { GoalsProgressCard } from "@/features/dashboard/components/GoalsProgressCard";
import { InsightsPanel } from "@/features/dashboard/components/InsightsPanel";
import { QuickActionsCard } from "@/features/dashboard/components/QuickActionsCard";
import { TransactionsList } from "@/features/transactions/components/TransactionsList";
import { WalletOverviewCard } from "@/features/dashboard/components/WalletOverviewCard";

export function DashboardScene() {
  const snapshotQuery = useDashboardSnapshot();

  if (snapshotQuery.isLoading) {
    return <LoadingState />;
  }

  if (snapshotQuery.isError || !snapshotQuery.data) {
    return (
      <ErrorState
        message={mapErrorMessage(snapshotQuery.error)}
        onRetry={() => void snapshotQuery.refetch()}
      />
    );
  }

  const { summary, wallets, debts, goals, insights, transactions, cards } = snapshotQuery.data;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Editorial fintech"
        title="Panorama do caixa pessoal"
        description="Um painel com hierarquia forte para saldo, dividas, reservas e sinais que pedem acao."
      />

      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
        <BalanceHero summary={summary} />
        <QuickActionsCard />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Saldo corrente"
          value={summary.currentBalance}
          changeLabel="Liquidez pronta para operar esta semana"
          trend="up"
        />
        <MetricCard
          label="Receita mensal"
          value={summary.monthlyIncome}
          changeLabel="Entrada acumulada no ciclo atual"
          trend="up"
        />
        <MetricCard
          label="Despesas mensais"
          value={summary.monthlyExpenses}
          changeLabel="Saidas fixas e variaveis em monitoramento"
          trend="down"
        />
        <MetricCard
          label="Reserva ativa"
          value={wallets.find((wallet) => wallet.type === "reserve")?.balance ?? 0}
          changeLabel="Base para os proximos choques"
          trend="up"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <WalletOverviewCard wallets={wallets} />
        <GoalsProgressCard goals={goals} />
      </div>

      <DebtPressureCard
        debts={debts}
        cards={cards}
        debtVisibility={summary.debtVisibility}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <TransactionsList transactions={transactions.slice(0, 5)} />
        <AddTransactionForm />
      </div>

      <InsightsPanel insights={insights} />
    </div>
  );
}
