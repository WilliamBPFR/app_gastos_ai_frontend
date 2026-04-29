import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: userService.getCurrentUserInfo,
  });
}