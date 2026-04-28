import { apiRequest } from "@/axiosConfig/apiRequest";
import { 
    LoginRequest, 
    LoginResponse 
} from "@/types/auth_types";

export const authService = {
    login: async (email: string, password: string) => {
        return apiRequest<LoginResponse, LoginRequest>({
            method: "POST",
            url: "/auth/login",
            data: { email, password },
        });
    },

    saveAccessToken: (token: string) => {
        localStorage.setItem("access_token", token);
    },

    clearAccessToken: () => {
        localStorage.removeItem("access_token");
    }


}