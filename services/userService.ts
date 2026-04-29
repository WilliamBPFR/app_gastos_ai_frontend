// src/services/userService.ts

import { apiRequest } from "@/axiosConfig/apiRequest";
import {
  CreateUserRequest,
  CreateUserResponse,
  User,
} from "@/types/general_response_types";

import { MeUserResponse } from "@/types/users_types";

export const userService = {
  getCurrentUserInfo: async (): Promise<MeUserResponse> => {
    return apiRequest<MeUserResponse>({
      method: "GET",
      url: "/user/me",
    });
  }
};