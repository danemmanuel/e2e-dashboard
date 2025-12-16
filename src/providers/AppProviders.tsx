import { CssBaseline, ThemeProvider } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { createAppTheme } from '../theme.ts';
import { DashboardFiltersProvider } from './DashboardFilters.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

interface ThemeModeContextValue {
  mode: PaletteMode;
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(
  undefined
);

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within AppProviders');
  }

  return context;
}

export function AppProviders({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<PaletteMode>('dark');
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const toggleMode = useCallback(
    () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeModeContext.Provider value={{ mode, toggleMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DashboardFiltersProvider>{children}</DashboardFiltersProvider>
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </QueryClientProvider>
  );
}
