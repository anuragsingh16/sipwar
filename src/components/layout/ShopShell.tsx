"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import ChatbotLoader from "@/components/ui/ChatbotLoader";

/**
 * ShopShell — renders the site Header, Breadcrumbs, Footer, and Chatbot
 * on all routes EXCEPT /admin* and /admin-login.
 * This keeps the admin portal completely clean of shop chrome.
 */
export default function ShopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <Breadcrumbs />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ChatbotLoader />
    </>
  );
}
