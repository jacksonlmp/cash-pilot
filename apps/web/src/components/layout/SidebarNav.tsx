import { NavLink } from "react-router-dom";
import { Landmark } from "lucide-react";
import { appRouteSections } from "@/constants/routes";
import { cn } from "@/lib/cn";

export function SidebarNav() {
  return (
    <aside className="hidden md:flex md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:flex-col md:overflow-y-auto md:bg-surface md:px-6 md:py-6">
      <div className="space-y-8">
        <div className="px-2">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-hero-gradient text-white shadow-floating">
              <Landmark size={22} />
            </div>
            <div>
              <p className="font-display text-2xl font-black tracking-tight text-primary">
                CashPilot
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Kinetic Vault
              </p>
            </div>
          </div>
        </div>
        <nav aria-label="Menu principal" className="space-y-6">
          {appRouteSections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((route) => {
                  const Icon = route.icon;
                  return (
                    <NavLink
                      key={route.path}
                      to={route.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 ease-kinetic",
                          route.status === "soon"
                            ? "text-on-surface-variant hover:bg-primary/5 hover:text-primary"
                            : "",
                          isActive && route.status === "active"
                            ? "scale-[1.02] border-l-4 border-primary bg-surface-container-low font-bold text-primary"
                            : "font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary",
                        )
                      }
                    >
                      <Icon size={18} strokeWidth={1.5} />
                      <span>{route.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="pt-4">
            <a
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:text-error"
              href="#"
            >
              <span>Sair</span>
            </a>
          </div>
        </nav>
      </div>
    </aside>
  );
}
