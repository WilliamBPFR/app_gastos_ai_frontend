// src/types/user.ts

export interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  account_activated: boolean;
}

export interface CreateUserRequest {
  user_name: string;
  user_email: string;
  password: string;
}

export interface CreateUserResponse {
  message: string;
  user: User;
}

export interface GeneralResponse{
  message: string;
}