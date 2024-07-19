import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider, MaterialDesignContent, closeSnackbar } from 'notistack';
import { styled as muiStyled } from '@mui/material/styles';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { store, persistor } from './app/store';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: "#424242",
      contrastText: "#ffffffb3",
    },
    secondary: {
      main: "#63e399",
      contrastText: "#ffffff",
    },
    error: {
      main: "#e66161"
    },
    success: {
      main: "#63e399",
      contrastText: "#ffffff",
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          textTransform: 'none',
        },
      },
    }
  },
});

const StyledMaterialDesignContent = muiStyled(MaterialDesignContent)(({ theme }) => ({
  '&.notistack-MuiContent-success': {
    borderRadius: '0',
    backgroundColor: theme.palette.secondary.main,
  },
  '&.notistack-MuiContent-error': {
    borderRadius: '0',
    backgroundColor: theme.palette.error.main,
  },
}));

ReactDOM.createRoot(document.getElementById('root')).render(
  <CookiesProvider>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <SnackbarProvider
                autoHideDuration={1500}
                action={(snackbarId) => (
                  <IconButton
                    aria-label="dismiss snack"
                    onClick={() => closeSnackbar(snackbarId)}
                  >
                    <Close />
                  </IconButton>
                )}
                Components={{
                  success: StyledMaterialDesignContent,
                  error: StyledMaterialDesignContent,
                }}>
                <Routes>
                  <Route path="/*" element={<App />} />
                </Routes>
              </SnackbarProvider>
            </AuthProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </CookiesProvider>
)
