"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

type DateRangeContextValue = {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  clearDateRange: () => void;
  hasDateRange: boolean;
};

const DateRangeContext = React.createContext<DateRangeContextValue | undefined>(undefined);

type DateRangeProviderProps = {
  readonly children: React.ReactNode;
  readonly initialDateRange?: DateRange;
};

export function DateRangeProvider({ children, initialDateRange }: DateRangeProviderProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(initialDateRange);

  const clearDateRange = React.useCallback(() => {
    setDateRange(undefined);
  }, []);

  const value = React.useMemo<DateRangeContextValue>(
    () => ({
      dateRange,
      setDateRange,
      clearDateRange,
      hasDateRange: Boolean(dateRange),
    }),
    [clearDateRange, dateRange]
  );

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
}

export function useDateRangeContext() {
  const context = React.useContext(DateRangeContext);

  if (!context) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }

  return context;
}