import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider, MaterialDesignContent } from 'notistack';
import { styled as muiStyled } from '@mui/material/styles';

const StyledMaterialDesignContent = muiStyled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-success': {
    borderRadius: '0',
    backgroundColor: '#63e399',
  },
  '&.notistack-MuiContent-error': {
    borderRadius: '0',
    backgroundColor: '#e66161',
  },
}));

ReactDOM.createRoot(document.getElementById('root')).render(
  <CookiesProvider>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={"loading"} persistor={persistor}>
          <AuthProvider>
            <SnackbarProvider
            autoHideDuration={1500}
            Components={{
              success: StyledMaterialDesignContent,
              error: StyledMaterialDesignContent,
            }}>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </SnackbarProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </CookiesProvider>
)
