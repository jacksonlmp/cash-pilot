import {
  Activity,
  BarChart3,
  CreditCard,
  Flag,
  HandCoins,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ShieldQuestion,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AppRouteItem = {
  label: string;
  shortLabel: string;
  path: string;
  icon: LucideIcon;
  description: string;
  status: "active" | "soon";
  mobile?: boolean;
};

export type AppRouteSection = {
  label: string;
  items: AppRouteItem[];
};

export const appRouteSections: AppRouteSection[] = [
  {
    label: "Principal",
    items: [
      {
        label: "Painel",
        shortLabel: "Inicio",
        path: "/dashboard",
        icon: LayoutDashboard,
        description: "Painel financeiro premium",
        status: "active",
        mobile: true,
      },
      {
        label: "Transações",
        shortLabel: "Historico",
        path: "/transactions",
        icon: ReceiptText,
        description: "Historico agrupado e filtros rapidos",
        status: "active",
        mobile: true,
      },
    ],
  },
  {
    label: "Gestao",
    items: [
      {
        label: "Carteira",
        shortLabel: "Carteira",
        path: "/wallet",
        icon: Wallet,
        description: "Saldo real, beneficios e alocacao",
        status: "active",
        mobile: true,
      },
      {
        label: "Dívidas",
        shortLabel: "Dividas",
        path: "/debts",
        icon: HandCoins,
        description: "Parcelas, impacto mensal e payoff",
        status: "active",
        mobile: true,
      },
      {
        label: "Assinaturas",
        shortLabel: "Assinaturas",
        path: "/subscriptions",
        icon: CreditCard,
        description: "Painel ainda em construcao",
        status: "soon",
      },
      {
        label: "Limites",
        shortLabel: "Limites",
        path: "/limits",
        icon: Activity,
        description: "Painel ainda em construcao",
        status: "soon",
      },
      {
        label: "Categorias",
        shortLabel: "Categorias",
        path: "/categories",
        icon: BarChart3,
        description: "Painel ainda em construcao",
        status: "soon",
      },
    ],
  },
  {
    label: "Planejamento",
    items: [
      {
        label: "Metas",
        shortLabel: "Metas",
        path: "/goals",
        icon: Flag,
        description: "Progresso de reservas e objetivos",
        status: "active",
      },
      {
        label: "Análises",
        shortLabel: "Analises",
        path: "/analytics",
        icon: BarChart3,
        description: "Painel ainda em construcao",
        status: "soon",
      },
      {
        label: "Renda Extra",
        shortLabel: "Renda",
        path: "/extra-income",
        icon: HandCoins,
        description: "Painel ainda em construcao",
        status: "soon",
      },
    ],
  },
  {
    label: "Sistema",
    items: [
      {
        label: "Configurações",
        shortLabel: "Configuracoes",
        path: "/settings",
        icon: Settings,
        description: "Preferencias do workspace",
        status: "active",
      },
      {
        label: "Suporte",
        shortLabel: "Suporte",
        path: "/support",
        icon: ShieldQuestion,
        description: "Painel ainda em construcao",
        status: "soon",
      },
    ],
  },
];

export const appRoutes = appRouteSections.flatMap((section) => section.items);
export const mobileRoutes = appRoutes.filter((route) => route.mobile);
