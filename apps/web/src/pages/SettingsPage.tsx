import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Settings"
        title="Preferencias do workspace"
        description="Estrutura pronta para temas, conectores, alertas e politicas de integracao futura."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3 bg-surface-container-low">
          <p className="text-sm font-medium text-on-surface">Origem de dados</p>
          <p className="text-sm text-on-surface-variant">
            Nesta fase o app opera com contratos tipados e mocks internos. A troca para API real
            ocorrera apenas na camada de services e hooks.
          </p>
        </Card>
        <Card className="space-y-3 bg-surface-container-low">
          <p className="text-sm font-medium text-on-surface">Autenticacao futura</p>
          <p className="text-sm text-on-surface-variant">
            O shell ja parte do pressuposto de area autenticada, mas sem login funcional neste v1.
          </p>
        </Card>
      </div>
    </div>
  );
}
