import "./globals.css";

import { Kumbh_Sans } from "@next/font/google";
import { Mulish } from "@next/font/google";
import SessionWrapper from "./components/SessionWrapper";
import { Header } from "./components/Header";
import { Toaster } from "sonner";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks+"
}

const kumbh_sans_init = Kumbh_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-kumbh_sans"
})

const mulish = Mulish({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-mulish"
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SessionWrapper>
      <html lang="pt-BR">
        <body
          className={`${kumbh_sans_init.variable, mulish.variable} antialiased bg-zinc-950`}
        >
          <Header />
          {children}
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </SessionWrapper>
  );
}
