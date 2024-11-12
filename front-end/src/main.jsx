import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { CookiesProvider } from "react-cookie";
import { store, persistor } from './app/store';
import { ThemeContextProvider } from './ThemeContextProvider';
import CustomSnackbarProvider from './components/layout/CustomSnackbarProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeContextProvider>
            <CustomSnackbarProvider>
              <App />
            </CustomSnackbarProvider>
          </ThemeContextProvider>
        </PersistGate>
      </Provider>
    </CookiesProvider>
  </React.StrictMode>
)
