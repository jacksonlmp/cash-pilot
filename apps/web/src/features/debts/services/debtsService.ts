import { getJson } from "@/services/http";
import type { Debt } from "@/types/domain";

type DebtSummaryApiResponse = {
  strategy_name: string;
  payoff_month: string | null;
  total_remaining: string;
  monthly_payment: string;
  results: Array<{
    id: number;
    title: string;
    strategy_name: string;
    total_remaining: string;
    monthly_payment: string;
    payoff_month: string;
  }>;
};

export const debtsService = {
  async list() {
    const data = await getJson<DebtSummaryApiResponse>("/debts/summary/");
    return data.results.map(
      (debt): Debt => ({
        id: debt.id,
        title: debt.title,
        strategyName: debt.strategy_name,
        monthlyPayment: Number(debt.monthly_payment),
        totalRemaining: Number(debt.total_remaining),
        payoffMonth: debt.payoff_month,
      }),
    );
  },
};
