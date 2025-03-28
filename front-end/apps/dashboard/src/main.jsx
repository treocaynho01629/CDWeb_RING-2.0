import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./app/store";
import { ThemeContextProvider, SnackbarProvider } from "@ring/ui";
import { store } from "@ring/redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeContextProvider>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </ThemeContextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
