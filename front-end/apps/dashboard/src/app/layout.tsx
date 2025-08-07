import "./globals.css";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeContextProvider } from "@ring/ui";
import { theme } from "../lib/theme";
import localFont from "next/font/local";
import NextStoreProvider from "./NextStoreProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "RING! - Dashboard",
  description: "Manage your book store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextStoreProvider>
          <AppRouterCacheProvider>
            <ThemeContextProvider theme={theme}>
              {children}
            </ThemeContextProvider>
          </AppRouterCacheProvider>
        </NextStoreProvider>
      </body>
    </html>
  );
}
