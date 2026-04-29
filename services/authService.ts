import { apiRequest } from "@/axiosConfig/apiRequest";
import { 
    LoginRequest, 
    LoginResponse,
    VerifyLoginResponse 
} from "@/types/auth_types";

export const authService = {
    login: async (email: string, password: string, rememberMe: boolean) => {
        return apiRequest<LoginResponse, LoginRequest>({
            method: "POST",
            url: "/auth/login",
            data: { email, password, rememberMe },
        });
    },

    verifyLogin: async () => {
        return apiRequest<VerifyLoginResponse, void>({
            method: "GET",
            url: "/auth/verify",
        });
    },

    logout: async () => {
        return apiRequest<void, void>({
            method: "POST",
            url: "/auth/logout",
        });
    }
}