import { BellDot, Search } from "lucide-react";
import { QuickActionMenu } from "@/components/layout/QuickActionMenu";

type TopbarProps = {
  onQuickAction: (kind: "income" | "expense") => void;
};

export function Topbar({ onQuickAction }: TopbarProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-16 bg-white/70 shadow-sm backdrop-blur-xl md:left-80 md:right-8 md:rounded-2xl">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center md:hidden">
          <h1 className="font-display text-xl font-black tracking-tight text-primary">
            CashPilot
          </h1>
        </div>
        <div className="hidden max-w-xl flex-1 md:flex">
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              className="h-11 w-full rounded-xl bg-surface-container-high pl-10 pr-4 text-sm text-on-surface outline-none ring-0"
              placeholder="Buscar informacoes..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <QuickActionMenu className="md:hidden" onQuickAction={onQuickAction} />
          <button
            type="button"
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low"
            aria-label="Notificacoes"
          >
            <BellDot size={20} />
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-primary-container">
            <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-white">
              JS
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
