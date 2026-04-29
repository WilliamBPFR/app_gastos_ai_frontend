"use client";

import { useContinualVerifyLogin } from "@/hooks/use-check-login";

export function ContinualVerifyLoginWatcher() {
  useContinualVerifyLogin();
  return null;
}