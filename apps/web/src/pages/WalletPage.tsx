import { Card } from "@/components/ui/Card";
import { FeaturePreviewPage } from "@/components/layout/FeaturePreviewPage";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { formatCurrency, formatPercent } from "@/lib/formatters";

export function WalletPage() {
  const query = useWallets();

  return (
    <FeaturePreviewPage
      eyebrow="Wallet"
      title="Separacao clara entre liquidez, beneficios e reserva"
      description="O modulo de wallet nasce preparado para evoluir sem misturar saldo real, credito e objetivos."
      query={query}
      chips={["Visao consolidada", "Liquidez", "Reserva", "Beneficios"]}
      renderContent={(wallets) => (
        <div className="grid gap-4 lg:grid-cols-2">
          {wallets.map((wallet) => (
            <Card key={wallet.id} elevated className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{wallet.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                    {wallet.type}
                  </p>
                </div>
                <p
                  className={`text-sm ${
                    wallet.trend >= 0 ? "text-secondary" : "text-error"
                  }`}
                >
                  {wallet.trend >= 0 ? "+" : ""}
                  {formatPercent(wallet.trend)}
                </p>
              </div>
              <p className="font-display text-4xl font-bold">{formatCurrency(wallet.balance)}</p>
            </Card>
          ))}
        </div>
      )}
      emptyTitle="Nenhuma carteira cadastrada"
      emptyDescription="Assim que voce conectar seus bolsos financeiros, o painel separa saldo real, beneficios e reservas."
    />
  );
}
