import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Insight } from "@/types/domain";

type InsightsPanelProps = {
  insights: Insight[];
};

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <Card className="space-y-5 bg-surface-container-low">
      <div>
        <p className="text-sm text-on-surface-variant">Insights</p>
        <h3 className="mt-1 font-display text-2xl font-bold">Leituras acionaveis desta semana</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-3xl bg-surface-container-lowest p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">{insight.title}</p>
              <Badge
                tone={
                  insight.tone === "positive"
                    ? "positive"
                    : insight.tone === "alert"
                      ? "alert"
                      : "neutral"
                }
              >
                {insight.tone}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-on-surface-variant">{insight.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
