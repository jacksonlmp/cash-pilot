import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="space-y-4 bg-surface-container-low">
      <div className="flex items-center gap-3 text-error">
        <AlertTriangle />
        <p className="font-medium">Nao foi possivel concluir a carga.</p>
      </div>
      <p className="text-sm text-on-surface-variant">{message}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </Card>
  );
}
