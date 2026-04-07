import { ReactNode } from "react";
import { BellDot, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

type TopbarProps = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaIcon?: ReactNode;
};

export function Topbar({ title, description, ctaLabel, ctaIcon }: TopbarProps) {
  return (
    <header className="glass-panel flex flex-col gap-4 rounded-xl3 p-5 shadow-ambient md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">
          Workspace autenticado
        </p>
        <h1 className="font-display text-3xl font-extrabold text-on-surface">{title}</h1>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-full bg-surface-container-lowest px-4 py-3 text-sm text-on-surface-variant">
          <Search size={16} />
          <span>Busca futura por transacoes, tags e insights</span>
        </div>
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest text-on-surface-variant shadow-ambient transition duration-300 ease-kinetic hover:scale-[1.02]"
          aria-label="Notificacoes"
        >
          <BellDot size={18} />
        </button>
        <Button size="lg">
          {ctaIcon}
          {ctaLabel}
        </Button>
      </div>
    </header>
  );
}
