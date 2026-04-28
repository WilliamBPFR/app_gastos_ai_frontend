import { apiRequest } from "@/axiosConfig/apiRequest";
import { GeneralResponse } from "@/types/general_response_types";
import { 
    LoginRequest, 
    LoginResponse 
} from "@/types/auth_types";

export const authService = {
    login: async (email: string, password: string) => {
        return apiRequest<LoginResponse, LoginRequest>({
            method: "POST",
            url: "/app/auth/login",
            data: { email, password },
        });
    },

    saveAccessToken: (token: string) => {
        localStorage.setItem("access_token", token);
    },

    saveRefreshToken: (token: string) => {
        localStorage.setItem("refresh_token", token);
    }
}