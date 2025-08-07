import {
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme as baseTheme } from "../lib/theme";

export default function ThemeContextProvider({ theme, children }) {
  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider
        theme={theme ?? baseTheme}
        disableTransitionOnChange
        defaultMode="light"
      >
        <CssBaseline enableColorScheme />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
