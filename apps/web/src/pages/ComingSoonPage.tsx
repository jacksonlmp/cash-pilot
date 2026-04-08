import { useLocation } from "react-router-dom";
import { EmptyState } from "@/components/feedback/EmptyState";
import { appRoutes } from "@/constants/routes";

export function ComingSoonPage() {
  const location = useLocation();
  const route = appRoutes.find((item) => item.path === location.pathname);

  return (
    <div className="py-10">
      <EmptyState
        title={`${route?.label ?? "Painel"} em breve`}
        description="Esta area ja faz parte da navegacao final, mas a experiencia detalhada ainda sera entregue nas proximas iteracoes."
      />
    </div>
  );
}
