import { createTheme } from "@mui/material";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import darkScrollbar from "@mui/material/darkScrollbar";

export const myPalette = {
  primary: {
    main: "#63e399",
    contrastText: "#ffffff",
  },
  info: {
    main: "#63aee3",
  },
  error: {
    main: "#ef5350",
  },
  warning: {
    main: "#ffa726",
  },
  success: {
    main: "#6de363",
  },
  secondary: {
    main: "#424242",
    contrastText: "#ffffffb3",
  },
  background: {
    default: "#f9f9fb",
  },
};

export const theme = createTheme({
  colorSchemeSelector: "media",
  cssVariables: {
    colorSchemeSelector: "class",
  },
  colorSchemes: {
    light: {
      palette: myPalette,
    },
    dark: {
      palette: {
        ...myPalette,
        primary: {
          main: "#63e399",
          contrastText: "#3a3a3a",
        },
        secondary: {
          main: "#818181",
          contrastText: "#0c0c0c",
        },
        text: {
          primary: "#f1f1f1",
        },
        background: {
          default: "#080d08",
          paper: "#080d08",
        },
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        html: {
          ...darkScrollbar(
            theme.palette.mode === "light"
              ? {
                  track: theme.palette.background.paper,
                  thumb: theme.palette.action.disabled,
                  active: theme.palette.text.primary,
                }
              : undefined
          ),
          scrollbarWidth: "thin",
        },
      }),
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          display: "flex",
          alignItems: "center",
          textTransform: "none",

          "&.MuiButton-contained": {
            "&:hover": {
              backgroundColor: theme.palette.grey[300],
            },

            "&:disabled": {
              backgroundColor: theme.palette.grey[500],
              color: theme.palette.text.disabled,
            },
          },
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down("sm")]: {
            display: "flex",
            alignItems: "center",
            padding: 10,
            height: theme.mixins.toolbar.minHeight,
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          "--TextField-brandBorderColor": theme.palette.divider,
          "--TextField-brandBorderHoverColor": theme.palette.action.hover,
          "--TextField-brandBorderFocusedColor": theme.palette.primary.main,
          "& label.Mui-focused": {
            color: theme.palette.primary.dark,
          },
          "& .MuiFormHelperText-root": {
            whiteSpace: "nowrap",
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "var(--TextField-brandBorderColor)",
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "var(--TextField-brandBorderHoverColor)",
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "var(--TextField-brandBorderFocusedColor)",
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
              WebkitBoxShadow: "0 0 0 100px #0000000 inset",
              WebkitTextFillColor: theme.palette.info.main,
            },
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
});
