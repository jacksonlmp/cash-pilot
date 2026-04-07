import { NavLink } from "react-router-dom";
import { Landmark } from "lucide-react";
import { appRoutes } from "@/constants/routes";
import { cn } from "@/lib/cn";

export function SidebarNav() {
  return (
    <aside className="glass-panel rounded-xl3 p-4 shadow-ambient lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-[280px] lg:p-6">
      <div className="space-y-10">
        <div className="space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-hero-gradient text-white shadow-floating">
            <Landmark size={22} />
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold tracking-tight text-on-surface">
              CashPilot
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Kinetic Vault workspace para seu caixa pessoal.
            </p>
          </div>
        </div>
        <nav aria-label="Menu principal" className="space-y-2">
          {appRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition duration-300 ease-kinetic",
                    isActive
                      ? "bg-surface-container-lowest text-on-surface shadow-ambient"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
                  )
                }
              >
                <Icon size={18} strokeWidth={1.5} />
                <span>{route.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
