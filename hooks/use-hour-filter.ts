"use client";

import { useDateRangeContext } from "@/providers/date-range-provider";

export function useDateRange() {
  return useDateRangeContext();
}