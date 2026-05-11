import { apiRequest } from "@/axiosConfig/apiRequest";
import { DashboardData } from "@/types/dashboard_types";

export const dashboardService = {
    getDashboardData: async () => {
        return apiRequest<DashboardData, void>({
            method: "GET",
            url: "/dashboard/data",
            
        });
    }
}