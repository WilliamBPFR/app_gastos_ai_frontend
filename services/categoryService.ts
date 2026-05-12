import { apiRequest } from "@/axiosConfig/apiRequest";
import {
    CategoryGetAllResponse,
}
from "@/types/category_types";

import {
    GeneralResponse,
} from "@/types/general_response_types";

interface GetCategoryRequest {
    page_number?: number;
    page_size?: number;
    category_name?: string;
}
export const categoryService = {
    getCategories: async (params: GetCategoryRequest) => {
        return apiRequest<CategoryGetAllResponse, void>({
            method: "GET",
            url: "/categories/get-all",
            params,
        });
    },
    createCategory: async (category_name: string, category_description: string, color?: string, active?: boolean) => {
        return apiRequest<GeneralResponse, { category_name: string; category_description: string; color?: string; active?: boolean }>({
            method: "POST",
            url: "/categories/create",
            data: { category_name, category_description, color, active },
        });
    },
    deactivateCategory: async (category_id: number) => {
        return apiRequest<GeneralResponse, { category_id: number }>({
            method: "PUT",
            url: "/categories/deactivate/" + category_id
        });
    },
    activateCategory: async (category_id: number) => {
        return apiRequest<GeneralResponse, { category_id: number }>({
            method: "PUT",
            url: "/categories/activate/" + category_id
        });
    }
}