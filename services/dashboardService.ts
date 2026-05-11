import { apiRequest } from "@/axiosConfig/apiRequest";
import { DashboardData, DashboardDataRequest } from "@/types/dashboard_types";

export const dashboardService = {
    getDashboardData: async (params: DashboardDataRequest) => {
        return apiRequest<DashboardData, DashboardDataRequest>({
            method: "GET",
            url: "/dashboard/data",
            params
        });
    }
}