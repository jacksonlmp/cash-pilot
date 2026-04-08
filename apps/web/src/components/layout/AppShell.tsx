import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { AddTransactionModal } from "@/features/transactions/components/AddTransactionModal";
import { mobileRoutes } from "@/constants/routes";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Topbar } from "@/components/layout/Topbar";

export type AppShellOutletContext = {
  openQuickActionModal: (kind: "income" | "expense") => void;
};

export function AppShell() {
  const location = useLocation();
  const [transactionKind, setTransactionKind] = useState<"income" | "expense">("expense");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openQuickActionModal(kind: "income" | "expense") {
    setTransactionKind(kind);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-surface">
      <SidebarNav />
      <Topbar onQuickAction={openQuickActionModal} />
      <div className="pt-20 md:pl-72">
        <main className="min-h-screen px-4 pb-24 md:px-8 md:pb-8">
          <div>
            <Outlet context={{ openQuickActionModal }} />
          </div>
        </main>
      </div>
      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        <button
          type="button"
          onClick={() => {
            setTransactionKind("expense");
            setIsModalOpen(true);
          }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-all duration-300 ease-kinetic hover:scale-110"
        >
          <Plus size={30} />
        </button>
      </div>
      <nav className="fixed bottom-0 left-0 z-40 flex h-16 w-full items-center justify-around border-t border-outline/10 bg-white/80 px-4 backdrop-blur-xl md:hidden">
        {mobileRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                isActive
                  ? "flex flex-col items-center gap-1 text-primary"
                  : "flex flex-col items-center gap-1 text-on-surface-variant"
              }
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{route.shortLabel}</span>
            </NavLink>
          );
        })}
      </nav>
      <AddTransactionModal
        defaultKind={transactionKind}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
