import { useOutletContext } from "react-router-dom";
import type { AppShellOutletContext } from "@/components/layout/AppShell";
import { DashboardScene } from "@/features/dashboard/components/DashboardScene";

export function DashboardPage() {
  const { openQuickActionModal } = useOutletContext<AppShellOutletContext>();

  return <DashboardScene onQuickAction={openQuickActionModal} />;
}
