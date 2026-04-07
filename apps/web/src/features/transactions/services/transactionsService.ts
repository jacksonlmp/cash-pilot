import { mockDb } from "@/services/mockDb";

export const transactionsService = {
  list: () => mockDb.getTransactions(),
  create: mockDb.addTransaction,
};
