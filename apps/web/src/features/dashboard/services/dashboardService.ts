import { getJson } from "@/services/http";
import type { DashboardView } from "@/types/view";
import type { Insight, Transaction } from "@/types/domain";

type DashboardApiResponse = {
  header: {
    display_name: string;
    current_balance: string;
    status_label: string;
  };
  monthly_summary: {
    income: string;
    expenses: string;
    net_balance: string;
    budget_progress_percent: string;
    variable_budget_remaining: string;
  };
  reserve_goal: {
    title: string;
    monthly_target: string;
    progress_percent: string;
    missing_amount: string;
  };
  debt_summary: {
    strategy_name: string;
    payoff_month: string | null;
    total_remaining: string;
    monthly_payment: string;
  };
  alerts: Array<{
    type: Insight["tone"] | string;
    title: string;
    description: string;
    icon_key: string;
  }>;
  benefit_card: {
    title: string;
    holder_name: string;
    last_four: string;
    current_balance: string;
    monthly_spend: string;
    usage_percent: string;
  };
  transactions_preview: Array<{
    id: number;
    title: string;
    category: string;
    kind: Transaction["kind"];
    amount: string;
    occurred_at: string;
    wallet_id: number;
  }>;
};

function toNumber(value: string) {
  return Number(value);
}

export const dashboardService = {
  async getSnapshot(): Promise<DashboardView> {
    const data = await getJson<DashboardApiResponse>("/dashboard/summary/");
    return {
      header: {
        displayName: data.header.display_name,
        currentBalance: toNumber(data.header.current_balance),
        statusLabel: data.header.status_label,
      },
      monthlySummary: {
        income: toNumber(data.monthly_summary.income),
        expenses: toNumber(data.monthly_summary.expenses),
        netBalance: toNumber(data.monthly_summary.net_balance),
        budgetProgressPercent: toNumber(data.monthly_summary.budget_progress_percent),
        variableBudgetRemaining: toNumber(
          data.monthly_summary.variable_budget_remaining,
        ),
      },
      reserveGoal: {
        title: data.reserve_goal.title,
        monthlyTarget: toNumber(data.reserve_goal.monthly_target),
        progressPercent: toNumber(data.reserve_goal.progress_percent),
        missingAmount: toNumber(data.reserve_goal.missing_amount),
      },
      debtSummary: {
        strategyName: data.debt_summary.strategy_name,
        payoffMonth: data.debt_summary.payoff_month,
        totalRemaining: toNumber(data.debt_summary.total_remaining),
        monthlyPayment: toNumber(data.debt_summary.monthly_payment),
      },
      alerts: data.alerts.map((alert, index) => ({
        id: `${index}-${alert.icon_key}`,
        title: alert.title,
        description: alert.description,
        tone:
          alert.type === "warning" || alert.type === "benefit"
            ? "alert"
            : alert.type === "positive"
              ? "positive"
              : "neutral",
      })),
      benefitCard: {
        title: data.benefit_card.title,
        holderName: data.benefit_card.holder_name,
        lastFour: data.benefit_card.last_four,
        currentBalance: toNumber(data.benefit_card.current_balance),
        monthlySpend: toNumber(data.benefit_card.monthly_spend),
        usagePercent: toNumber(data.benefit_card.usage_percent),
      },
      transactionsPreview: data.transactions_preview.map((transaction) => ({
        id: transaction.id,
        title: transaction.title,
        category: transaction.category,
        kind: transaction.kind,
        amount: toNumber(transaction.amount),
        occurredAt: transaction.occurred_at,
        walletId: transaction.wallet_id,
      })),
    };
  },
};
