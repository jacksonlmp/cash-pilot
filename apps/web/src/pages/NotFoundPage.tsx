import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";

export function NotFoundPage() {
  return (
    <div className="py-16">
      <Card className="space-y-4 bg-surface-container-low text-center">
        <p className="font-display text-3xl font-bold">Rota nao encontrada</p>
        <p className="mx-auto max-w-xl text-sm text-on-surface-variant">
          Volte ao dashboard para continuar navegando pelo CashPilot.
        </p>
        <div>
          <Link
            to="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-full bg-hero-gradient px-5 text-sm font-medium text-white shadow-floating transition duration-300 ease-kinetic hover:scale-[1.02]"
          >
            Ir para dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}
