import { useEffect, useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type QuickActionMenuProps = {
  className?: string;
  onQuickAction: (kind: "income" | "expense") => void;
};

export function QuickActionMenu({ className, onQuickAction }: QuickActionMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
      <button
        id="add-button"
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition-all duration-300 ease-kinetic hover:shadow-lg"
      >
        <span className="flex items-center gap-2">
          <Plus size={18} />
          <span>Adicionar</span>
        </span>
        <ChevronDown size={16} />
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5">
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            onClick={() => {
              setOpen(false);
              onQuickAction("income");
            }}
            type="button"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white">
              +
            </span>
            Entrada
          </button>
          <button
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            onClick={() => {
              setOpen(false);
              onQuickAction("expense");
            }}
            type="button"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-error text-white">
              -
            </span>
            Saida
          </button>
        </div>
      ) : null}
    </div>
  );
}
