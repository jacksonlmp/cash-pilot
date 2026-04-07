export type CurrencyCode = "BRL";

export type TransactionKind = "income" | "expense" | "transfer";

export type Transaction = {
  id: string;
  title: string;
  category: string;
  kind: TransactionKind;
  amount: number;
  occurredAt: string;
  walletId: string;
};

export type Wallet = {
  id: string;
  name: string;
  type: "cash" | "bank" | "benefit" | "reserve";
  balance: number;
  trend: number;
};

export type Debt = {
  id: string;
  lender: string;
  monthlyPayment: number;
  outstandingBalance: number;
  payoffMonth: string;
  apr: number;
};

export type Goal = {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  dueLabel: string;
};

export type Card = {
  id: string;
  brand: "Visa" | "Mastercard" | "Elo";
  issuer: string;
  limit: number;
  used: number;
  dueDay: number;
};

export type InsightTone = "positive" | "alert" | "neutral";

export type Insight = {
  id: string;
  title: string;
  description: string;
  tone: InsightTone;
};

export type DashboardSummary = {
  currency: CurrencyCode;
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  reserveStatus: string;
  debtVisibility: string;
};
