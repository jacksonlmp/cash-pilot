import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { walletService } from "@/features/wallet/services/walletService";

export function useWallets() {
  return useQuery({
    queryKey: queryKeys.wallet,
    queryFn: walletService.list,
  });
}
