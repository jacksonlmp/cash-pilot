import { CreditCard, PiggyBank, PlusCircle, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";

const actions = [
  { label: "Nova transacao", icon: PlusCircle, helper: "Entrada ou saida" },
  { label: "Ajustar reserva", icon: PiggyBank, helper: "Mover para meta" },
  { label: "Ver cartoes", icon: CreditCard, helper: "Fechamento e limite" },
  { label: "Reconciliar wallet", icon: Wallet, helper: "Saldo e beneficios" },
];

export function QuickActionsCard() {
  return (
    <Card className="space-y-5 bg-surface-container-low">
      <div>
        <p className="text-sm text-on-surface-variant">Quick actions</p>
        <h3 className="mt-1 font-display text-2xl font-bold">Fluxos de alta frequencia</h3>
      </div>
      <div className="grid gap-3">
        {actions.map(({ label, icon: Icon, helper }) => (
          <button
            key={label}
            type="button"
            className="flex items-center justify-between rounded-3xl bg-surface-container-lowest px-4 py-4 text-left shadow-ambient transition duration-300 ease-kinetic hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-container-low text-primary">
                <Icon size={18} strokeWidth={1.5} />
              </span>
              <span>
                <span className="block text-sm font-medium text-on-surface">{label}</span>
                <span className="block text-xs text-on-surface-variant">{helper}</span>
              </span>
            </div>
            <span className="text-sm text-on-surface-variant">Abrir</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
