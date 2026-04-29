import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/authService";

export function useContinualVerifyLogin() {
  return useQuery({
    queryKey: ["auth-check-continual"],
    queryFn: authService.verifyLogin,
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    retry: false, // Don't retry on failure, we will handle it in the component
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 0,
    refetchIntervalInBackground: true
  });
}

export function useVerifyLoginOnce() {
  return useQuery({
    queryKey: ["auth-check-once"],
    queryFn: authService.verifyLogin,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 0,
  });
}   