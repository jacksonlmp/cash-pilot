import { mockDb } from "@/services/mockDb";

export const debtsService = {
  list: () => mockDb.getDebts(),
};
