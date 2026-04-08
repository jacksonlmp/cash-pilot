import { Card } from "@/components/ui/Card";
import { FeaturePreviewPage } from "@/components/layout/FeaturePreviewPage";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { formatCurrency } from "@/lib/formatters";

export function WalletPage() {
  const query = useWallets();

  return (
    <FeaturePreviewPage
      eyebrow="Wallet"
      title="Carteiras e beneficios"
      description="Leitura consolidada por tipo para separar saldo real, reserva e beneficios."
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
                <p className="text-sm text-on-surface-variant">
                  Orcamento: {formatCurrency(wallet.monthlyBudget ?? 0)}
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
