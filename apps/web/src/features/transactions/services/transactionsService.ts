import { getJson, postJson } from "@/services/http";
import type { Transaction } from "@/types/domain";

type TransactionsApiResponse = {
  count: number;
  results: Array<{
    id: number;
    title: string;
    category: string;
    kind: Transaction["kind"];
    amount: string;
    occurred_at: string;
    wallet_id: number | null;
    card_id?: number | null;
    payment_method?: Transaction["paymentMethod"];
    expense_type?: Transaction["expenseType"];
    is_installment?: boolean;
    installment_count?: number;
  }>;
};

type CreateTransactionInput = {
  title: string;
  category: string;
  kind: "income" | "expense";
  amount: number;
  walletId?: number | string;
  categoryId?: number | string;
  cardId?: number | string;
  paymentMethod?: "benefit" | "credit" | "debit" | "pix";
  expenseType?: "essential" | "non_essential";
  isInstallment?: boolean;
  installmentCount?: number;
  occurredAt?: string;
};

function normalizeTransaction(transaction: TransactionsApiResponse["results"][number]): Transaction {
  return {
    id: transaction.id,
    title: transaction.title,
    category: transaction.category,
    kind: transaction.kind,
    amount: Number(transaction.amount),
    occurredAt: transaction.occurred_at,
    walletId: transaction.wallet_id,
    cardId: transaction.card_id ?? null,
    paymentMethod: transaction.payment_method ?? "",
    expenseType: transaction.expense_type ?? "",
    isInstallment: transaction.is_installment ?? false,
    installmentCount: transaction.installment_count ?? 1,
  };
}

export const transactionsService = {
  async list() {
    const data = await getJson<TransactionsApiResponse>("/transactions/");
    return data.results.map(normalizeTransaction);
  },
  async create(input: CreateTransactionInput) {
    const data = await postJson<
      TransactionsApiResponse["results"][number],
      {
        title: string;
        category: string;
        category_id?: number | string;
        kind: "income" | "expense";
        amount: number;
        wallet_id?: number | string;
        card_id?: number | string;
        payment_method?: "benefit" | "credit" | "debit" | "pix";
        expense_type?: "essential" | "non_essential";
        is_installment?: boolean;
        installment_count?: number;
        occurred_at?: string;
      }
    >("/transactions/", {
      title: input.title,
      category: input.category,
      category_id: input.categoryId,
      kind: input.kind,
      amount: input.amount,
      wallet_id: input.walletId,
      card_id: input.cardId,
      payment_method: input.paymentMethod,
      expense_type: input.expenseType,
      is_installment: input.isInstallment,
      installment_count: input.installmentCount,
      occurred_at: input.occurredAt,
    });
    return normalizeTransaction(data);
  },
};
