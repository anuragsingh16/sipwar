import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Space_Mono } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import ChatbotLoader from "@/components/ui/ChatbotLoader";

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
          <Header />
          <Breadcrumbs />
          <main className="flex-grow">{children}</main>
          <Footer />
          {/* Chatbot lazy-loaded via client wrapper — doesn't block initial page render */}
          <ChatbotLoader />
        </AuthProvider>
      </body>
    </html>
  );
}
