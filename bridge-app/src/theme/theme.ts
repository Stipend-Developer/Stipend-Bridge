import grey from "@material-ui/core/colors/grey";
import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      `"Segoe UI"`,
      "Roboto",
      `"Helvetica Neue"`,
      "Arial",
      "sans-serif",
      `"Apple Color Emoji"`,
      `"Segoe UI Emoji"`,
      `"Segoe UI Symbol"`,
    ].join(","),
  },
  palette: {
    type: "light",
    primary: {
      light: "#000",
      main: "#000",
      dark: "#000",
      contrastText: "#fff",
    },
    secondary: grey,
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none",
        "&.MuiButton-outlined": {
          "&.Mui-disabled": {
            border: "1px solid transparent",
          },
        },
        borderRadius: 0,
        "& span": {
          fontSize: 12,
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        fontSize: 14,
        "& .MuiInputAdornment-marginDense span": {
          fontSize: 12,
        },
        "& fieldset": {
          borderRadius: 0,
        },
      },
      notchedOutline: {
        borderWidth: "1px !important",
      },
      inputMarginDense: {
        fontSize: 12,
        paddingTop: 11.5,
        paddingBottom: 11.5,
      },
    },
    MuiTextField: {},
    // @ts-ignore: `MuiToggleButtonGroup` is not exist in type `Overrides` (TODO)
    MuiToggleButtonGroup: {
      root: {
        backgroundColor: "transparent",
        "& span": {
          fontSize: 14,
        },
        "& button": {
          minHeight: 54,
        },
        borderRadius: 0,
      },
      grouped: {
        "&:not(:first-child)": {},
      },
    },
    MuiToggleButton: {
      root: {
        backgroundColor: "transparent !important",
        "& img": {
          opacity: 0.75,
        },
        "&.Mui-selected": {
          backgroundColor: "rgba(255, 255, 255, 0.1) !important",
          color: "#000",
          fontWeight: "500",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1) !important",
          },
          "& img": {
            opacity: 1,
          },
        },
        borderRadius: 0,
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1) !important",
        },
        "& .MuiToggleButton-label": {
          fontSize: 12,
        },
      },
    },
  },
});
