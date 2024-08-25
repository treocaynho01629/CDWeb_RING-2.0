import './index.css'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { CookiesProvider } from "react-cookie";
import { store, persistor } from './app/store';
import { ThemeContextProvider } from './ThemeContextProvider';
import CustomSnackbarProvider from './components/layout/CustomSnackbarProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <CookiesProvider>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeContextProvider>
            <CustomSnackbarProvider>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </CustomSnackbarProvider>
          </ThemeContextProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </CookiesProvider>
)
