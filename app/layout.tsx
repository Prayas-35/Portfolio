import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import Wrapper from "./wrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prayas' Portfolio",
  description: "Showcasing the work and journey of Prayas Pal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased bg-black`}
      >
        <Wrapper>
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
