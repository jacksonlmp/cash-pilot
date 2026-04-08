import { getJson } from "@/services/http";
import type { Card } from "@/types/domain";

type CardSummaryApiResponse = {
  benefit_card: {
    title: string;
    holder_name: string;
    last_four: string;
    current_balance: string;
    monthly_spend: string;
    usage_percent: string;
  };
  results: Array<{
    id: number;
    name: string;
    card_kind: "benefit" | "credit";
    holder_name: string;
    brand: string;
    last_four: string;
    current_balance: string;
    monthly_spend: string;
    total_limit: string;
    closing_day: number;
  }>;
};

export const cardsService = {
  async list() {
    const data = await getJson<CardSummaryApiResponse>("/cards/summary/");
    return data.results.map(
      (card): Card => ({
        id: card.id,
        cardKind: card.card_kind,
        brand: card.brand,
        name: card.name,
        holderName: card.holder_name,
        lastFour: card.last_four,
        currentBalance: Number(card.current_balance),
        monthlySpend: Number(card.monthly_spend),
        usagePercent:
          Number(card.total_limit) > 0
            ? (Number(card.monthly_spend) / Number(card.total_limit)) * 100
            : 0,
      }),
    );
  },
};
