import { getJson } from "@/services/http";
import type { Insight } from "@/types/domain";

type AlertsApiResponse = {
  results: Array<{
    type: string;
    title: string;
    description: string;
    icon_key: string;
  }>;
};

export const insightsService = {
  async list() {
    const data = await getJson<AlertsApiResponse>("/insights/alerts/");
    return data.results.map(
      (item, index): Insight => ({
        id: `${item.icon_key}-${index}`,
        title: item.title,
        description: item.description,
        tone: item.type === "card" ? "neutral" : "alert",
      }),
    );
  },
};
