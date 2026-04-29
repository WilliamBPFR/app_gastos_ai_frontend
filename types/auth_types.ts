export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  login_success: boolean;
}

export interface VerifyLoginResponse {
  authenticated: boolean;
}