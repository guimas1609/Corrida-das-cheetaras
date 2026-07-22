import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import HolographicBackground from "./components/HolographicBackground";
import CursorGlow from "./components/CursorGlow";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Corrida das Cheetaras de Bacabal",
  description: "A maior corrida do Maranhão — Corrida das Cheetaras, Bacabal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <HolographicBackground />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
