import { mockDb } from "@/services/mockDb";

export const cardsService = {
  list: async () => (await mockDb.getDashboardSnapshot()).cards,
};
