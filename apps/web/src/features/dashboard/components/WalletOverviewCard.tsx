import { Card } from "@/components/ui/Card";
import { formatCompactCurrency, formatPercent } from "@/lib/formatters";
import type { Wallet } from "@/types/domain";

type WalletOverviewCardProps = {
  wallets: Wallet[];
};

export function WalletOverviewCard({ wallets }: WalletOverviewCardProps) {
  return (
    <Card className="space-y-5">
      <div>
        <p className="text-sm text-on-surface-variant">Wallet status</p>
        <h3 className="mt-1 font-display text-2xl font-bold">Onde o dinheiro esta agora</h3>
      </div>
      <div className="space-y-3">
        {wallets.map((wallet, index) => {
          const trend = wallet.trend ?? 0;
          return (
            <div
              key={wallet.id}
              className={`rounded-3xl px-4 py-4 ${
                index % 2 === 0 ? "bg-surface" : "bg-surface-container-low"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-on-surface">{wallet.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                    {wallet.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-on-surface">
                    {formatCompactCurrency(wallet.balance)}
                  </p>
                  <p className={`text-xs ${trend >= 0 ? "text-secondary" : "text-error"}`}>
                    {trend >= 0 ? "+" : ""}
                    {formatPercent(trend)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
