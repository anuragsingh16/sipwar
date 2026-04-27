import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Space_Mono } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/components/providers/AuthProvider";
import ShopShell from "@/components/layout/ShopShell";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space_mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sipwar Coffee — Premium Indian Filter Coffee",
  description: "Experience Sipwar's award-winning Filter Coffee Arabica AA, ethically sourced from the farms of South India. Free shipping over ₹500.",
  keywords: "Indian filter coffee, specialty coffee, arabica, Sipwar, coffee brand India",
  openGraph: {
    title: "Sipwar Coffee — Chuski Ki Ladai",
    description: "Premium Indian Filter Coffee. Ethically Sourced. Wellness-Driven.",
    siteName: "Sipwar Coffee",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable} ${spaceMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-coffee-900">
        <AuthProvider>
          {/*
            ShopShell is a client component that checks the current pathname.
            On /admin* routes it renders children directly (no Header/Footer).
            On all other routes it wraps children in Header + Breadcrumbs + Footer + Chatbot.
          */}
          <ShopShell>{children}</ShopShell>
        </AuthProvider>
      </body>
    </html>
  );
}
