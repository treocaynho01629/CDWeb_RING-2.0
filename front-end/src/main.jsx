import './index.css'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from 'notistack';
import { store, persistor } from './app/store';
import { ThemeContextProvider } from './ThemeContextProvider';
import CustomSnackbar from './components/custom/CustomSnackbar';

ReactDOM.createRoot(document.getElementById('root')).render(
  <CookiesProvider>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeContextProvider>
            <SnackbarProvider
              maxSnack={3}
              autoHideDuration={1500}
              Components={{
                default: CustomSnackbar,
                success: CustomSnackbar,
                error: CustomSnackbar,
                warning : CustomSnackbar,
                info: CustomSnackbar,
              }}
            >
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </SnackbarProvider>
          </ThemeContextProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </CookiesProvider>
)
