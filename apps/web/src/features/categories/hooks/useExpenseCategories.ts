import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { categoriesService } from "@/features/categories/services/categoriesService";

export function useExpenseCategories() {
  return useQuery({
    queryKey: queryKeys.expenseCategories,
    queryFn: categoriesService.listExpenseCategories,
  });
}
