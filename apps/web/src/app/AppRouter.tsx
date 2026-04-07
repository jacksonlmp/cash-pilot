import { useMemo } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { DebtsPage } from "@/pages/DebtsPage";
import { GoalsPage } from "@/pages/GoalsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { TransactionsPage } from "@/pages/TransactionsPage";
import { WalletPage } from "@/pages/WalletPage";

export function AppRouter() {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/",
          element: <AppShell />,
          children: [
            { index: true, element: <Navigate replace to="/dashboard" /> },
            { path: "dashboard", element: <DashboardPage /> },
            { path: "transactions", element: <TransactionsPage /> },
            { path: "wallet", element: <WalletPage /> },
            { path: "debts", element: <DebtsPage /> },
            { path: "goals", element: <GoalsPage /> },
            { path: "settings", element: <SettingsPage /> },
            { path: "*", element: <NotFoundPage /> },
          ],
        },
      ]),
    [],
  );

  return <RouterProvider router={router} />;
}
