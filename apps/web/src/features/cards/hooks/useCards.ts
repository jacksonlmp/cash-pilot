import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { cardsService } from "@/features/cards/services/cardsService";

export function useCards() {
  return useQuery({
    queryKey: queryKeys.cards,
    queryFn: cardsService.list,
  });
}
