"use client";

import { theme as baseTheme } from "@ring/ui";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const theme = createTheme(baseTheme, {
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});
