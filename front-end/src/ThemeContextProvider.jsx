import { ThemeProvider as MUIThemeProvider, StyledEngineProvider, CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider as ScThemeProvider } from "styled-components";
import { createContext, useMemo, useState } from "react";
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

export const ColorModeContext = createContext({ toggleColorMode: () => { } });

export function ThemeContextProvider({ children }) {
    const [mode, setMode] = useState("light");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: "#63e399",
                        contrastText: "#ffffff",
                    },
                    info: {
                        main: "#636de3",
                    },
                    error: {
                        main: "#e66161"
                    },
                    success: {
                        main: "#63e399",
                        contrastText: "#ffffff",
                    },
                    secondary: {
                        main: "#424242",
                        contrastText: "#ffffffb3",
                    },
                    background: {
                        elevate: '#fff',
                        contrast: '#f5f5f5'
                    },
                    ...(mode === 'dark'
                        && {
                        text: {
                            primary: '#f1f1f1',
                        },
                        background: {
                            elevate: '#1e1e1e',
                            contrast: '#121212'
                        },
                    }),
                },
                shape: {
                    borderRadius: 0,
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                textTransform: 'none',

                                '&.MuiButton-contained': {
                                    '&:hover': {
                                        backgroundColor: theme.palette.grey[300],
                                        color: theme.palette.text.primary
                                    },

                                    '&:disabled': {
                                        backgroundColor: theme.palette.grey[500],
                                        color: theme.palette.text.disabled
                                    }
                                },
                            }),
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                '--TextField-brandBorderColor': theme.palette.divider,
                                '--TextField-brandBorderHoverColor': theme.palette.action.hover,
                                '--TextField-brandBorderFocusedColor': theme.palette.action.focus,
                                '& label.Mui-focused': {
                                    color: theme.palette.text.primary,
                                },
                                '& input:valid:focus + fieldset': {
                                    borderColor: theme.palette.primary.main,
                                    borderLeftWidth: 4,
                                    padding: '4px !important',
                                },
                                '& input:invalid:focus + fieldset': {
                                    borderColor: theme.palette.error.main,
                                    borderWidth: 1,
                                    borderLeftWidth: 4,
                                    padding: '4px !important',
                                },
                                '& .MuiFormHelperText-root': {
                                    width: 250,
                                },
                            }),
                        },
                    },
                    MuiDialogTitle: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                [theme.breakpoints.down('sm')]: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: 10,
                                    height: theme.mixins.toolbar.minHeight,
                                }
                            }),
                        },
                    },
                    MuiOutlinedInput: {
                        styleOverrides: {
                            notchedOutline: {
                                borderColor: 'var(--TextField-brandBorderColor)',
                            },
                            root: {
                                [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                                    borderColor: 'var(--TextField-brandBorderHoverColor)',
                                },
                                [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                                    borderColor: 'var(--TextField-brandBorderFocusedColor)',
                                },
                            },
                        },
                    },
                    MuiInputBase: {
                        styleOverrides: {
                            input: {
                                "&:-webkit-autofill": {
                                    transitionDelay: "9999s",
                                    transitionProperty: "background-color, color",
                                },
                            },
                        },
                    },
                    MuiTableContainer: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                "&::-webkit-scrollbar": {
                                    width: 7,
                                    height: 7,
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: 'inherit',
                                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0)',
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: theme.palette.action.focus,
                                    borderRadius: '20px',
                                },
                                '&::-webkit-scrollbar-corner': {
                                    background: 'inherit',
                                },
                            }),
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                "&::-webkit-scrollbar": {
                                    width: 5,
                                    height: 5,
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: 'inherit',
                                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0)',
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: theme.palette.action.hover,
                                    borderRadius: '20px',
                                },
                                '&::-webkit-scrollbar-corner': {
                                    background: 'inherit',
                                },
                            }),
                        },
                    },
                },
                breakpoints: {
                    values: {
                        xs: 0,
                        sm: 600,
                        sm_md: 768,
                        md: 900,
                        md_lg: 992,
                        lg: 1200,
                        xl: 1536,
                    },
                },
            }),
        [mode]
    );

    return (
        <StyledEngineProvider injectFirst>
            <ColorModeContext.Provider value={colorMode}>
                <MUIThemeProvider theme={theme}>
                    <CssBaseline enableColorScheme />
                    <ScThemeProvider theme={theme}>
                        {children}
                    </ScThemeProvider>
                </MUIThemeProvider>
            </ColorModeContext.Provider>
        </StyledEngineProvider>
    );
}