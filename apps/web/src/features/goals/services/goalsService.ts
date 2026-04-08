import { getJson } from "@/services/http";
import type { Goal } from "@/types/domain";

type GoalSummaryApiResponse = {
  title: string;
  monthly_target: string;
  progress_percent: string;
  missing_amount: string;
  results: Array<{
    id: number;
    name: string;
    goal_type: string;
    target_amount: string;
    current_amount: string;
    monthly_target: string;
  }>;
};

export const goalsService = {
  async list() {
    const data = await getJson<GoalSummaryApiResponse>("/goals/summary/");
    return data.results.map(
      (goal): Goal => ({
        id: goal.id,
        name: goal.name,
        goalType: goal.goal_type,
        targetAmount: Number(goal.target_amount),
        currentAmount: Number(goal.current_amount),
        monthlyTarget: Number(goal.monthly_target),
      }),
    );
  },
};
