// src/services/userService.ts

import { apiRequest } from "@/axiosConfig/apiRequest";
import {
  CreateUserRequest,
  CreateUserResponse,
  User,
} from "@/types/general_response_types";

export const userService = {
  getUsers: async () => {
    return apiRequest<User[]>({
      method: "GET",
      url: "/users",
    });
  },

  getUserById: async (userId: number) => {
    return apiRequest<User>({
      method: "GET",
      url: `/users/${userId}`,
    });
  },

  createUser: async (data: CreateUserRequest) => {
    return apiRequest<CreateUserResponse, CreateUserRequest>({
      method: "POST",
      url: "/users",
      data,
    });
  },

  deleteUser: async (userId: number) => {
    return apiRequest<{ message: string }>({
      method: "DELETE",
      url: `/users/${userId}`,
    });
  },
};