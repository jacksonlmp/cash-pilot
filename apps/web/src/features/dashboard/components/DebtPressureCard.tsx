import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCompactCurrency } from "@/lib/formatters";
import type { Card as CreditCard, Debt } from "@/types/domain";

type DebtPressureCardProps = {
  debts: Debt[];
  cards: CreditCard[];
  debtVisibility: string;
};

export function DebtPressureCard({
  debts,
  cards,
  debtVisibility,
}: DebtPressureCardProps) {
  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-on-surface-variant">Debt visibility</p>
          <h3 className="mt-1 font-display text-2xl font-bold">Impacto recorrente no caixa</h3>
        </div>
        <Badge tone="alert">Atencao</Badge>
      </div>
      <p className="text-sm text-on-surface-variant">{debtVisibility}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-3xl bg-surface-container-low p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
            Parcelas ativas
          </p>
          {debts.map((debt) => (
            <div key={debt.id} className="rounded-3xl bg-surface-container-lowest p-4">
              <p className="text-sm font-medium">{debt.lender}</p>
              <div className="mt-2 flex justify-between text-sm text-on-surface-variant">
                <span>{formatCompactCurrency(debt.monthlyPayment)}/mes</span>
                <span>Fim em {debt.payoffMonth}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3 rounded-3xl bg-surface-container-low p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
            Cartoes
          </p>
          {cards.map((card) => {
            const usage = Math.round((card.used / card.limit) * 100);
            return (
              <div key={card.id} className="rounded-3xl bg-surface-container-lowest p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{card.issuer}</p>
                    <p className="text-xs text-on-surface-variant">{card.brand}</p>
                  </div>
                  <p className="text-sm text-on-surface-variant">{usage}% do limite</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
