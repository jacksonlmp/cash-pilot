import { ArrowDownLeft, ArrowUpRight, MoveRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDateLabel } from "@/lib/formatters";
import type { Transaction } from "@/types/domain";

type TransactionsListProps = {
  transactions: Transaction[];
};

const iconMap = {
  income: ArrowUpRight,
  expense: ArrowDownLeft,
  transfer: MoveRight,
};

export function TransactionsList({ transactions }: TransactionsListProps) {
  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm text-on-surface-variant">Transactions</p>
        <h3 className="mt-1 font-display text-2xl font-bold">Historico recente</h3>
      </div>
      <div className="space-y-3">
        {transactions.map((transaction, index) => {
          const Icon = iconMap[transaction.kind];
          const isPositive = transaction.kind === "income";
          return (
            <div
              key={transaction.id}
              className={`flex items-center justify-between gap-4 rounded-3xl px-4 py-4 ${
                index % 2 === 0 ? "bg-surface" : "bg-surface-container-low"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                    isPositive
                      ? "bg-secondary-container/60 text-secondary"
                      : transaction.kind === "expense"
                        ? "bg-error/10 text-error"
                        : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-sm font-medium text-on-surface">{transaction.title}</p>
                  <p className="text-xs text-on-surface-variant">
                    {transaction.category} • {formatDateLabel(transaction.occurredAt)}
                  </p>
                </div>
              </div>
              <p className={`font-medium ${isPositive ? "text-secondary" : "text-on-surface"}`}>
                {isPositive ? "+" : transaction.kind === "expense" ? "-" : ""}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
