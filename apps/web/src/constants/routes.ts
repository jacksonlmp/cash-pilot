import {
  ChartNoAxesCombined,
  Landmark,
  PiggyBank,
  Settings,
  Target,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AppRouteItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
};

export const appRoutes: AppRouteItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: ChartNoAxesCombined,
    description: "Panorama geral do caixa e das reservas",
  },
  {
    label: "Transações",
    path: "/transactions",
    icon: WalletCards,
    description: "Histórico agrupado e filtros rápidos",
  },
  {
    label: "Carteira",
    path: "/wallet",
    icon: Landmark,
    description: "Saldo real, benefícios e alocação",
  },
  {
    label: "Dívidas",
    path: "/debts",
    icon: PiggyBank,
    description: "Parcelas, impacto mensal e payoff",
  },
  {
    label: "Metas",
    path: "/goals",
    icon: Target,
    description: "Progresso de reservas e objetivos",
  },
  {
    label: "Configurações",
    path: "/settings",
    icon: Settings,
    description: "Preferências do workspace",
  },
];
