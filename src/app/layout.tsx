import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "IGNOUMax",
  description: "Partner for your IGNOU journey. Get all your IGNOU resources in one place.",
};

import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${dmSans.className} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="w-[full] md:w-[70%] lg:w-[60%] mx-auto">
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}