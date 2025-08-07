import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
// import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { ThemeContextProvider, SnackbarProvider } from "@ring/ui";
import { store } from "@ring/redux";
// import { persistor } from "./store";

export const metadata = {
  title: "RING! - Dashboard",
  description: "Dashboard for RING!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          {/* <Provider store={store}> */}
          {/* <PersistGate loading={null} persistor={persistor}> */}
          <ThemeContextProvider>
            {/* <SnackbarProvider> */}
            {children}
            {/* </SnackbarProvider> */}
          </ThemeContextProvider>
          {/* </PersistGate> */}
          {/* </Provider> */}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
