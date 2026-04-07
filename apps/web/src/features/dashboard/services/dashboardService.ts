import { mockDb } from "@/services/mockDb";

export const dashboardService = {
  getSnapshot: () => mockDb.getDashboardSnapshot(),
};
