import { apiRequest } from "@/axiosConfig/apiRequest";
import { GeneralResponse } from "@/types/general_response_types";
import { 
    VerifyCodeRequest, 
    PasswordResetConfirmationRequest
} from "@/types/forgotPassword_types";

export const forgotPasswordService = {
    requestPasswordReset: async (email: string) => {
        return apiRequest<GeneralResponse>({
            method: "POST",
            url: "/forgot-password/create-petition",
            params: { email },
        });
    },

    requestVerifyCode: async (user_email: string, reset_code: string) => {
        return apiRequest<GeneralResponse, VerifyCodeRequest>({
            method: "POST",
            url: "/forgot-password/verify-reset-code",
            data: { user_email, reset_code },
        });
    },

    requestPasswordResetConfirmation: async (user_email: string, new_password: string) => {
        return apiRequest<GeneralResponse, PasswordResetConfirmationRequest>({
            method: "POST",
            url: "/forgot-password/confirm-password-reset",
            data: { user_email, new_password },
        });
    },

    requestResendCode: async (email: string) => {
        return apiRequest<GeneralResponse>({
            method: "POST",
            url: "/forgot-password/resend-reset-code",
            params: { email },
        });
    }
};