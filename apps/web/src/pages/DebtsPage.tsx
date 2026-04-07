import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FeaturePreviewPage } from "@/components/layout/FeaturePreviewPage";
import { useDebts } from "@/features/debts/hooks/useDebts";
import { formatCurrency } from "@/lib/formatters";

export function DebtsPage() {
  const query = useDebts();

  return (
    <FeaturePreviewPage
      eyebrow="Debts"
      title="Clareza sobre impacto mensal e payoff timeline"
      description="A leitura prioriza o que pesa agora e quando cada compromisso deixa de pressionar o caixa."
      query={query}
      chips={["Mais urgentes", "Impacto mensal", "Simulacao"]}
      renderContent={(debts) => (
        <div className="grid gap-4 lg:grid-cols-2">
          {debts.map((debt) => (
            <Card key={debt.id} className="space-y-4 bg-surface-container-low">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-on-surface">{debt.lender}</p>
                  <p className="text-xs text-on-surface-variant">Encerramento em {debt.payoffMonth}</p>
                </div>
                <Badge tone="alert">APR {debt.apr}%</Badge>
              </div>
              <div className="grid gap-3 rounded-3xl bg-surface-container-lowest p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-on-surface-variant">
                    Parcela
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold">
                    {formatCurrency(debt.monthlyPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-on-surface-variant">
                    Saldo
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold">
                    {formatCurrency(debt.outstandingBalance)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      emptyTitle="Nenhuma divida ativa"
      emptyDescription="Quando o app detectar financiamentos ou parcelamentos, a linha do tempo aparece aqui."
    />
  );
}
