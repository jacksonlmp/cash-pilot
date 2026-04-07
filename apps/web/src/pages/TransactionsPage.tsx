import { FeaturePreviewPage } from "@/components/layout/FeaturePreviewPage";
import { TransactionsList } from "@/features/transactions/components/TransactionsList";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";

export function TransactionsPage() {
  const query = useTransactions();

  return (
    <FeaturePreviewPage
      eyebrow="Transactions"
      title="Historico agrupado e preparado para filtros"
      description="A tela prioriza legibilidade, acesso rapido e estados consistentes antes da integracao real com a API."
      query={query}
      chips={["Hoje", "Ultimos 7 dias", "Saidas", "Entradas"]}
      renderContent={(transactions) => <TransactionsList transactions={transactions} />}
      emptyTitle="Nenhuma transacao por aqui"
      emptyDescription="Quando os primeiros movimentos entrarem, eles aparecerao aqui com agrupamento e filtros reutilizaveis."
    />
  );
}
