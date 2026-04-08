import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";

type TransactionRecord = {
  id: number;
  title: string;
  category: string;
  kind: "income" | "expense";
  amount: string;
  occurred_at: string;
  wallet_id: number | null;
  card_id?: number | null;
  payment_method?: "benefit" | "credit" | "debit" | "pix";
  expense_type?: "essential" | "non_essential";
  is_installment?: boolean;
  installment_count?: number;
};

function createMockState() {
  const transactions: TransactionRecord[] = [
    {
      id: 1,
      title: "Salario principal",
      category: "Salário",
      kind: "income",
      amount: "8400.00",
      occurred_at: "2026-04-07T10:00:00.000Z",
      wallet_id: 1,
    },
    {
      id: 2,
      title: "Freela dashboard",
      category: "Extra",
      kind: "income",
      amount: "4000.00",
      occurred_at: "2026-04-06T10:00:00.000Z",
      wallet_id: 1,
    },
    {
      id: 3,
      title: "Jantar com amigos",
      category: "Lazer",
      kind: "expense",
      amount: "250.00",
      occurred_at: "2026-04-05T10:00:00.000Z",
      wallet_id: null,
      card_id: 2,
      payment_method: "credit",
      expense_type: "non_essential",
      is_installment: true,
      installment_count: 5,
    },
  ];

  const expenseCategories = [
    { id: 1, name: "Lazer", category_kind: "expense", display_order: 1 },
    { id: 2, name: "Alimentação", category_kind: "expense", display_order: 2 },
    { id: 3, name: "Transporte", category_kind: "expense", display_order: 3 },
    { id: 4, name: "Saúde", category_kind: "expense", display_order: 4 },
    { id: 5, name: "Moradia", category_kind: "expense", display_order: 5 },
    { id: 6, name: "Casa", category_kind: "expense", display_order: 6 },
  ];

  const wallets = [
    {
      id: 1,
      name: "Conta Principal",
      type: "bank",
      balance: "142850.42",
      monthly_budget: "7480.00",
    },
    {
      id: 2,
      name: "Caju Beneficios",
      type: "benefit",
      balance: "1420.00",
      monthly_budget: "0.00",
    },
  ];

  const goals = [
    {
      id: 1,
      name: "Meta: Reserva",
      goal_type: "reserve",
      target_amount: "200.00",
      current_amount: "120.00",
      monthly_target: "200.00",
    },
  ];

  const debts = [
    {
      id: 1,
      title: "Plano de Quitacao Principal",
      strategy_name: "Bola de Neve",
      total_remaining: "24100.00",
      monthly_payment: "1250.00",
      payoff_month: "Julho / 2026",
    },
  ];

  function buildDashboard() {
    return {
      header: {
        display_name: "Jackson",
        current_balance: "142850.42",
        status_label: "No azul",
      },
      monthly_summary: {
        income: "12400.00",
        expenses: "4820.00",
        net_balance: "7580.00",
        budget_progress_percent: "64.44",
        variable_budget_remaining: "2660.00",
      },
      reserve_goal: {
        title: "Meta: Reserva",
        monthly_target: "200.00",
        progress_percent: "60.00",
        missing_amount: "80.00",
      },
      debt_summary: {
        strategy_name: "Bola de Neve",
        payoff_month: "Julho / 2026",
        total_remaining: "24100.00",
        monthly_payment: "1250.00",
      },
      alerts: [
        {
          type: "warning",
          title: "Restaurante acima do limite",
          description: "Voce ja gastou 115% da verba de lazer.",
          icon_key: "warning",
        },
      ],
      benefit_card: {
        title: "Cartao MultiBeneficios",
        holder_name: "Jackson Silva",
        last_four: "4492",
        current_balance: "1420.00",
        monthly_spend: "850.00",
        usage_percent: "37.44",
      },
      transactions_preview: transactions.slice(0, 5),
    };
  }

  return {
    transactions,
    expenseCategories,
    wallets,
    goals,
    debts,
    buildDashboard,
  };
}

beforeEach(() => {
  const state = createMockState();

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      const pathname = new URL(url, "http://localhost").pathname;
      const method = init?.method ?? "GET";

      if (pathname === "/api/dashboard/summary/") {
        return new Response(JSON.stringify(state.buildDashboard()), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (pathname === "/api/wallets/summary/") {
        return new Response(
          JSON.stringify({
            total_balance: "142850.42",
            grouped_balances: { bank: "142850.42" },
            results: state.wallets,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (pathname === "/api/categories/expense/") {
        return new Response(JSON.stringify(state.expenseCategories), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (pathname === "/api/goals/summary/") {
        return new Response(
          JSON.stringify({
            title: "Meta: Reserva",
            monthly_target: "200.00",
            progress_percent: "60.00",
            missing_amount: "80.00",
            results: state.goals,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (pathname === "/api/debts/summary/") {
        return new Response(
          JSON.stringify({
            strategy_name: "Bola de Neve",
            payoff_month: "Julho / 2026",
            total_remaining: "24100.00",
            monthly_payment: "1250.00",
            results: state.debts,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (pathname === "/api/transactions/" && method === "GET") {
        return new Response(
          JSON.stringify({
            count: state.transactions.length,
            results: state.transactions,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (pathname === "/api/transactions/" && method === "POST") {
        const body = JSON.parse(init?.body as string);
        const created = {
          id: state.transactions.length + 1,
          title: body.title,
          category:
            body.category ??
            state.expenseCategories.find((category) => category.id === Number(body.category_id))?.name ??
            "Categoria",
          kind: body.kind,
          amount: String(Number(body.amount).toFixed(2)),
          occurred_at: body.occurred_at ?? "2026-04-08T10:00:00.000Z",
          wallet_id: body.wallet_id ? Number(body.wallet_id) : null,
          card_id: body.card_id ? Number(body.card_id) : null,
          payment_method: body.payment_method,
          expense_type: body.expense_type,
          is_installment: body.is_installment ?? false,
          installment_count: body.installment_count ?? 1,
        };
        state.transactions.unshift(created);
        return new Response(JSON.stringify(created), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (pathname === "/api/cards/summary/") {
        return new Response(
          JSON.stringify({
            benefit_card: {
              title: "Cartao MultiBeneficios",
              holder_name: "Jackson Silva",
              last_four: "4492",
              current_balance: "1420.00",
              monthly_spend: "850.00",
              usage_percent: "37.44",
            },
            results: [
              {
                id: 1,
                name: "Cartao MultiBeneficios",
                card_kind: "benefit",
                holder_name: "Jackson Silva",
                brand: "Caju",
                last_four: "4492",
                current_balance: "1420.00",
                monthly_spend: "850.00",
                total_limit: "2270.00",
                closing_day: 30,
              },
              {
                id: 2,
                name: "Cartao Principal",
                card_kind: "credit",
                holder_name: "Jackson Silva",
                brand: "Visa",
                last_four: "1458",
                current_balance: "2520.00",
                monthly_spend: "2520.00",
                total_limit: "6000.00",
                closing_day: 19,
              },
            ],
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (pathname === "/api/insights/alerts/") {
        return new Response(
          JSON.stringify({
            results: [
              {
                type: "warning",
                title: "Restaurante acima do limite",
                description: "Voce ja gastou 115% da verba de lazer.",
                icon_key: "warning",
              },
            ],
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(JSON.stringify({ detail: `Unhandled ${pathname}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});
