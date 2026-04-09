import type {
  Card,
  Debt,
  Goal,
  Insight,
  Transaction,
  Wallet,
} from "@/types/domain";

export type DashboardHeader = {
  displayName: string;
  currentBalance: number;
  statusLabel: string;
};

export type MonthlySummary = {
  income: number;
  expenses: number;
  netBalance: number;
  budgetProgressPercent: number;
  variableBudgetRemaining: number;
};

export type ReserveGoalSummary = {
  title: string;
  monthlyTarget: number;
  progressPercent: number;
  missingAmount: number;
};

export type DebtSummaryCard = {
  strategyName: string;
  payoffMonth: string | null;
  totalRemaining: number;
  monthlyPayment: number;
};

export type BenefitCardSummary = {
  title: string;
  holderName: string;
  lastFour: string;
  currentBalance: number;
  monthlySpend: number;
  usagePercent: number;
};

export type DashboardView = {
  header: DashboardHeader;
  monthlySummary: MonthlySummary;
  reserveGoal: ReserveGoalSummary;
  debtSummary: DebtSummaryCard;
  alerts: Insight[];
  benefitCard: BenefitCardSummary;
  transactionsPreview: Transaction[];
};

export type DashboardSnapshot = {
  summary: import("@/types/domain").DashboardSummary;
  wallets: Wallet[];
  debts: Debt[];
  goals: Goal[];
  insights: Insight[];
  transactions: Transaction[];
  cards: Card[];
};
