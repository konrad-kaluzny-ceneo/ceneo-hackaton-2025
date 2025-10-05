import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import User from "./user";
import Navbar from "@/components/shared/Navbar";
import Header from "@/components/shared/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Here. - Travel slow. Feel more.",
  description: "Odkryj spersonalizowane propozycje podróży dopasowane do Twoich potrzeb i preferencji.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <User />
        <Header />
        <main className="mb-24">
          {children}
        </main>
        <Navbar />
        <Toaster />
      </body>
    </html>
  );
}
