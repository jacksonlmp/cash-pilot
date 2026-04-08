import type {
  Card,
  DashboardSummary,
  Debt,
  Goal,
  Insight,
  Transaction,
  Wallet,
} from "@/types/domain";
import type { DashboardSnapshot } from "@/types/view";

type MockStore = {
  summary: DashboardSummary;
  wallets: Wallet[];
  debts: Debt[];
  goals: Goal[];
  insights: Insight[];
  transactions: Transaction[];
  cards: Card[];
};

const store: MockStore = {
  summary: {
    currency: "BRL",
    currentBalance: 28450.32,
    monthlyIncome: 18400,
    monthlyExpenses: 12380,
    reserveStatus: "Reserva mensal acima da meta pela terceira semana seguida.",
    debtVisibility: "62% da pressao mensal esta concentrada em duas parcelas longas.",
  },
  wallets: [
    { id: "w1", name: "Conta principal", type: "bank", balance: 16420.2, trend: 4.8 },
    { id: "w2", name: "Reserva liquida", type: "reserve", balance: 8200, trend: 7.2 },
    { id: "w3", name: "Beneficios", type: "benefit", balance: 1830.12, trend: -1.6 },
  ],
  debts: [
    {
      id: "d1",
      lender: "Parcelamento notebook",
      monthlyPayment: 680,
      outstandingBalance: 5440,
      payoffMonth: "Ago 2026",
      apr: 12.5,
    },
    {
      id: "d2",
      lender: "Emprestimo studio",
      monthlyPayment: 1250,
      outstandingBalance: 9800,
      payoffMonth: "Jan 2027",
      apr: 9.2,
    },
  ],
  goals: [
    {
      id: "g1",
      name: "Colchao de 6 meses",
      currentAmount: 21200,
      targetAmount: 36000,
      dueLabel: "Meta para Dez 2026",
    },
    {
      id: "g2",
      name: "Viagem Lisboa",
      currentAmount: 5300,
      targetAmount: 12000,
      dueLabel: "Saida em Jul 2026",
    },
  ],
  insights: [
    {
      id: "i1",
      title: "Janela de folga melhorou",
      description: "Sua folga depois das despesas fixas cresceu 8% em relacao ao mes anterior.",
      tone: "positive",
    },
    {
      id: "i2",
      title: "Cartao premium pressiona o caixa",
      description: "O cartao principal ja consumiu 74% do limite antes do fechamento.",
      tone: "alert",
    },
    {
      id: "i3",
      title: "Meta de reserva em rota segura",
      description: "Mantendo o ritmo atual, a reserva chega a 92% da meta antes de novembro.",
      tone: "neutral",
    },
  ],
  transactions: [
    {
      id: "t1",
      title: "Salario consultoria",
      category: "Receita",
      kind: "income",
      amount: 12800,
      occurredAt: "2026-04-03T12:00:00.000Z",
      walletId: "w1",
    },
    {
      id: "t2",
      title: "Mensalidade academia",
      category: "Saude",
      kind: "expense",
      amount: 189.9,
      occurredAt: "2026-04-04T09:15:00.000Z",
      walletId: "w1",
    },
    {
      id: "t3",
      title: "Supermercado organico",
      category: "Casa",
      kind: "expense",
      amount: 428.7,
      occurredAt: "2026-04-05T18:45:00.000Z",
      walletId: "w1",
    },
    {
      id: "t4",
      title: "Reserva automatica",
      category: "Transferencia",
      kind: "transfer",
      amount: 1200,
      occurredAt: "2026-04-06T08:30:00.000Z",
      walletId: "w2",
    },
  ],
  cards: [
    { id: "c1", brand: "Visa", issuer: "Nubank Ultravioleta", limit: 15000, used: 11100, dueDay: 12 },
    { id: "c2", brand: "Mastercard", issuer: "XP One", limit: 9000, used: 2650, dueDay: 20 },
  ],
};

function delay<T>(payload: T, timeout = 180): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(payload), timeout);
  });
}

function buildSnapshot(): DashboardSnapshot {
  return {
    summary: {
      currentBalance: store.summary.currentBalance ?? 0,
      monthlyIncome: store.summary.monthlyIncome ?? 0,
      monthlyExpenses: store.summary.monthlyExpenses ?? 0,
      reserveStatus: store.summary.reserveStatus ?? "",
      debtVisibility: store.summary.debtVisibility ?? "",
      currency: "BRL",
    },
    wallets: [...store.wallets],
    debts: [...store.debts],
    goals: [...store.goals],
    insights: [...store.insights],
    transactions: [...store.transactions].sort((a, b) =>
      b.occurredAt.localeCompare(a.occurredAt),
    ),
    cards: [...store.cards],
  };
}

export const mockDb = {
  getDashboardSnapshot() {
    return delay(buildSnapshot());
  },
  getTransactions() {
    return delay([...buildSnapshot().transactions]);
  },
  getWallets() {
    return delay([...store.wallets]);
  },
  getDebts() {
    return delay([...store.debts]);
  },
  getGoals() {
    return delay([...store.goals]);
  },
  getInsights() {
    return delay([...store.insights]);
  },
  addTransaction(input: Omit<Transaction, "id" | "occurredAt">) {
    const transaction: Transaction = {
      ...input,
      id: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
    };

    store.transactions = [transaction, ...store.transactions];
    store.summary.currentBalance =
      transaction.kind === "income"
        ? (store.summary.currentBalance ?? 0) + transaction.amount
        : (store.summary.currentBalance ?? 0) - transaction.amount;

    if (transaction.kind === "income") {
      store.summary.monthlyIncome = (store.summary.monthlyIncome ?? 0) + transaction.amount;
    } else if (transaction.kind === "expense") {
      store.summary.monthlyExpenses =
        (store.summary.monthlyExpenses ?? 0) + transaction.amount;
    }

    const wallet = store.wallets.find((item) => item.id === transaction.walletId);
    if (wallet) {
      wallet.balance =
        transaction.kind === "income"
          ? wallet.balance + transaction.amount
          : wallet.balance - transaction.amount;
    }

    return delay(transaction, 220);
  },
};
