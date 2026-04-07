import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { dashboardService } from "@/features/dashboard/services/dashboardService";

export function useDashboardSnapshot() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardService.getSnapshot,
  });
}
