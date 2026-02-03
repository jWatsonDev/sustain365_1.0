"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#7DBA42",
      dark: "#5E9E2E",
      light: "#9DCB6B",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#5E9E2E",
      dark: "#4A7E24",
      light: "#7DBA42",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    error: {
      main: "#D32F2F",
    },
    warning: {
      main: "#FFA726",
    },
    success: {
      main: "#7DBA42",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
        },
        containedPrimary: {
          boxShadow: "0 2px 4px rgba(125, 186, 66, 0.3)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(125, 186, 66, 0.4)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#7DBA42",
          "&.Mui-checked": {
            color: "#7DBA42",
          },
        },
      },
    },
  },
});
