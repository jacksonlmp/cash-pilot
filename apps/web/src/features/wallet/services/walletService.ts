import { mockDb } from "@/services/mockDb";

export const walletService = {
  list: () => mockDb.getWallets(),
};
