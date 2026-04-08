import { getJson } from "@/services/http";
import type { Wallet } from "@/types/domain";

type WalletSummaryApiResponse = {
  total_balance: string;
  grouped_balances: Record<string, string>;
  results: Array<{
    id: number;
    name: string;
    type: Wallet["type"];
    balance: string;
    monthly_budget: string;
  }>;
};

export const walletService = {
  async list() {
    const data = await getJson<WalletSummaryApiResponse>("/wallets/summary/");
    return data.results.map((wallet) => ({
      id: wallet.id,
      name: wallet.name,
      type: wallet.type,
      balance: Number(wallet.balance),
      monthlyBudget: Number(wallet.monthly_budget),
    }));
  },
};
