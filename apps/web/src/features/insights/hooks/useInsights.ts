import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { insightsService } from "@/features/insights/services/insightsService";

export function useInsights() {
  return useQuery({
    queryKey: queryKeys.insights,
    queryFn: insightsService.list,
  });
}
