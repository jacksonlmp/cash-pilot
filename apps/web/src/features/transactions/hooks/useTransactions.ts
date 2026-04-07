import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { transactionsService } from "@/features/transactions/services/transactionsService";

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: transactionsService.list,
  });
}
