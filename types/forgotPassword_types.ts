export interface VerifyCodeRequest {
  user_email: string;
  reset_code: string;
}

export interface PasswordResetConfirmationRequest {
  user_email: string;
  new_password: string;
}