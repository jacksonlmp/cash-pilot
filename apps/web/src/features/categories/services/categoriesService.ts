import { getJson } from "@/services/http";
import type { ExpenseCategory } from "@/types/domain";

type ExpenseCategoryApiResponse = Array<{
  id: number;
  name: string;
  category_kind: "expense";
  display_order: number;
}>;

export const categoriesService = {
  async listExpenseCategories() {
    const data = await getJson<ExpenseCategoryApiResponse>("/categories/expense/");
    return data.map(
      (category): ExpenseCategory => ({
        id: category.id,
        name: category.name,
        categoryKind: category.category_kind,
        displayOrder: category.display_order,
      }),
    );
  },
};
