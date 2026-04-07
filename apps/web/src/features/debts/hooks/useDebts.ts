import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { debtsService } from "@/features/debts/services/debtsService";

export function useDebts() {
  return useQuery({
    queryKey: queryKeys.debts,
    queryFn: debtsService.list,
  });
}
