export type CurrencyCode = "BRL";

export type TransactionKind = "income" | "expense" | "transfer";

export type Transaction = {
  id: number | string;
  title: string;
  category: string;
  kind: TransactionKind;
  amount: number;
  occurredAt: string;
  walletId?: number | string | null;
  cardId?: number | string | null;
  paymentMethod?: "benefit" | "credit" | "debit" | "pix" | "";
  expenseType?: "essential" | "non_essential" | "";
  isInstallment?: boolean;
  installmentCount?: number;
};

export type Wallet = {
  id: number | string;
  name: string;
  type: "cash" | "bank" | "benefit" | "reserve";
  balance: number;
  trend?: number;
  monthlyBudget?: number;
};

export type Debt = {
  id: number | string;
  lender?: string;
  title?: string;
  strategyName?: string;
  monthlyPayment: number;
  outstandingBalance?: number;
  totalRemaining?: number;
  payoffMonth: string;
  apr?: number;
};

export type Goal = {
  id: number | string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  dueLabel?: string;
  monthlyTarget?: number;
  goalType?: string;
};

export type Card = {
  id: number | string;
  brand: "Visa" | "Mastercard" | "Elo" | "Caju" | string;
  cardKind?: "benefit" | "credit";
  issuer?: string;
  name?: string;
  holderName?: string;
  lastFour?: string;
  limit?: number;
  used?: number;
  dueDay?: number;
  currentBalance?: number;
  monthlySpend?: number;
  usagePercent?: number;
};

export type ExpenseCategory = {
  id: number | string;
  name: string;
  categoryKind: "expense";
  displayOrder: number;
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
  currentBalance?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  reserveStatus?: string;
  debtVisibility?: string;
};
