import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatters";
import type { DashboardSummary } from "@/types/domain";

type BalanceHeroProps = {
  summary: DashboardSummary;
};

export function BalanceHero({ summary }: BalanceHeroProps) {
  const monthlyNet = summary.monthlyIncome - summary.monthlyExpenses;

  return (
    <Card className="overflow-hidden bg-hero-gradient p-8 text-white shadow-floating">
      <div className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <Badge className="bg-white/15 text-white" tone="neutral">
            Kinetic Vault dashboard
          </Badge>
          <div className="space-y-3">
            <p className="text-sm text-white/72">Saldo atual consolidado</p>
            <h2 className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">
              {formatCurrency(summary.currentBalance)}
            </h2>
            <p className="max-w-xl text-sm text-white/72">{summary.reserveStatus}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[1.75rem] bg-white/10 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-white/72">
              <span className="text-sm">Entrada mensal</span>
              <ArrowUpRight size={18} />
            </div>
            <p className="mt-4 font-display text-3xl font-bold">
              {formatCurrency(summary.monthlyIncome)}
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-white/10 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-white/72">
              <span className="text-sm">Saida mensal</span>
              <ArrowDownRight size={18} />
            </div>
            <p className="mt-4 font-display text-3xl font-bold">
              {formatCurrency(summary.monthlyExpenses)}
            </p>
            <p className="mt-2 text-xs text-white/72">
              Resultado liquido do mes: {formatCurrency(monthlyNet)}
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-white/15 text-white hover:bg-white/20"
          >
            Explorar simulacao de folego
          </Button>
        </div>
      </div>
    </Card>
  );
}
