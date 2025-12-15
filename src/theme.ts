import { createTheme } from '@mui/material/styles';
import type { PaletteMode, ThemeOptions } from '@mui/material';

const typography: ThemeOptions['typography'] = {
  fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
  h4: {
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  h6: {
    fontWeight: 600,
  },
  button: {
    fontWeight: 600,
  },
};

const shape: ThemeOptions['shape'] = {
  borderRadius: 12,
};

const components: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
      },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
};

const palettes: Record<PaletteMode, ThemeOptions['palette']> = {
  light: {
    mode: 'light',
    primary: {
      main: '#003965',
      light: '#285988',
      dark: '#001f38',
    },
    secondary: {
      main: '#0d9488',
    },
    background: {
      default: '#f4f6fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: 'rgba(15, 23, 42, 0.08)',
  },
  dark: {
    mode: 'dark',
    primary: {
      main: '#4b8ec3',
      light: '#7db5e0',
      dark: '#265779',
    },
    secondary: {
      main: '#22d3ee',
    },
    background: {
      default: '#0b1120',
      paper: '#111827',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
    divider: 'rgba(148, 163, 184, 0.24)',
  },
};

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    palette: palettes[mode],
    typography,
    shape,
    components,
  });
}
