"use client";
import dynamic from "next/dynamic";

// Lazy-load the Chatbot only on the client, after hydration.
// ssr: false MUST be used from a Client Component in Next.js 16.
const Chatbot = dynamic(() => import("@/components/ui/Chatbot"), {
  ssr: false,
  loading: () => null,
});

export default function ChatbotLoader() {
  return <Chatbot />;
}
