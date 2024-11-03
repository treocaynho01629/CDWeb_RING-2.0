import { ThemeProvider as MUIThemeProvider, StyledEngineProvider, CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider as ScThemeProvider } from "styled-components";
import { createContext, useMemo, useState } from "react";
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import darkScrollbar from '@mui/material/darkScrollbar';

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
                        main: "#63aee3",
                    },
                    error: {
                        main: "#ef5350"
                    },
                    warning: {
                        main: "#ffa726"
                    },
                    success: {
                        main: "#6de363",
                        contrastText: "#ffffff",
                    },
                    secondary: {
                        main: "#424242",
                        contrastText: "#ffffffb3",
                    },
                    background: {
                        elevate: '#fff',
                    },
                    ...(mode === 'dark'
                        && {
                        text: {
                            primary: '#f1f1f1',
                        },
                        background: {
                            default: '#080d08',
                            paper: '#080d08',
                            elevate: '#1e1e1e',
                        },
                    }),
                },
                shape: {
                    borderRadius: 0,
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: (theme) => ({
                            html: {
                                ...darkScrollbar(
                                    mode === "light"
                                        ? {
                                            track: theme.palette.background.default,
                                            thumb: theme.palette.action.disabled,
                                            active: theme.palette.text.primary,
                                        }
                                        : undefined
                                ),
                                scrollbarWidth: "thin"
                            }
                        }),
                    },
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
                            root: ({ theme }) => ({
                                input: {
                                    "input[type=number]::-webkit-outer-spin-button": {
                                        WebkitAppearance: "none",
                                    },
                                    "input[type=number]::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                    },
                                    "input[type=number]": {
                                        MozAppearance: "textfield",
                                    },
                                    "input[type=number]:hover, input[type=number]:focus": {
                                        MozAppearance: "number-input",
                                    },
                                    "&:-webkit-autofill": {
                                        transitionDelay: "9999s",
                                        transitionProperty: "all",
                                        WebkitBoxShadow: '0 0 0 100px #0000000 inset',
                                        WebkitTextFillColor: theme.palette.info.main
                                    },
                                },
                            })
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