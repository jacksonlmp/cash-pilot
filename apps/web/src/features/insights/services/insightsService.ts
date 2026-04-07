import { mockDb } from "@/services/mockDb";

export const insightsService = {
  list: () => mockDb.getInsights(),
};
