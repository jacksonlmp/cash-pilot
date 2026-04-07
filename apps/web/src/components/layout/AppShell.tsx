import { Outlet, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Topbar } from "@/components/layout/Topbar";
import { appRoutes } from "@/constants/routes";

export function AppShell() {
  const location = useLocation();
  const currentRoute = appRoutes.find((route) => route.path === location.pathname);

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <SidebarNav />
        <main className="flex-1">
          <Topbar
            title={currentRoute?.label ?? "CashPilot"}
            description={currentRoute?.description ?? "Painel editorial de saude financeira"}
            ctaLabel="Nova transacao"
            ctaIcon={<Plus size={18} />}
          />
          <div className="pt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
