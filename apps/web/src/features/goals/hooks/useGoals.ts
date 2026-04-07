import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { goalsService } from "@/features/goals/services/goalsService";

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: goalsService.list,
  });
}
