export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}