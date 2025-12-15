import { createContext, useContext, useState } from 'react';
import type { PropsWithChildren } from 'react';

export type TimeRangeOption = '7d' | '14d' | '30d';

interface DashboardFiltersContextValue {
  timeRange: TimeRangeOption;
  setTimeRange: (value: TimeRangeOption) => void;
}

const DashboardFiltersContext =
  createContext<DashboardFiltersContextValue | null>(null);

export function DashboardFiltersProvider({ children }: PropsWithChildren) {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('7d');

  return (
    <DashboardFiltersContext.Provider value={{ timeRange, setTimeRange }}>
      {children}
    </DashboardFiltersContext.Provider>
  );
}

export function useDashboardFilters() {
  const context = useContext(DashboardFiltersContext);

  if (!context) {
    throw new Error(
      'useDashboardFilters must be used within DashboardFiltersProvider'
    );
  }

  return context;
}
