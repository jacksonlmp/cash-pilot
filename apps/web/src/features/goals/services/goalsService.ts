import { mockDb } from "@/services/mockDb";

export const goalsService = {
  list: () => mockDb.getGoals(),
};
