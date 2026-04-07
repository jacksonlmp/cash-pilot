import type {
  Card,
  DashboardSummary,
  Debt,
  Goal,
  Insight,
  Transaction,
  Wallet,
} from "@/types/domain";

export type DashboardSnapshot = {
  summary: DashboardSummary;
  wallets: Wallet[];
  debts: Debt[];
  goals: Goal[];
  insights: Insight[];
  transactions: Transaction[];
  cards: Card[];
};
