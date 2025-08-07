import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ViteStoreProvider from "./ViteStoreProvider";
import ThemeContextProvider from "@ring/ui/ThemeContextProvider";
import SnackbarProvider from "@ring/ui/SnackbarProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ViteStoreProvider>
      <ThemeContextProvider>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </ThemeContextProvider>
    </ViteStoreProvider>
  </React.StrictMode>
);
