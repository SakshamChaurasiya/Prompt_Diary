import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Prompt Diary — Learn Prompt Engineering & AI Systems",
  description:
    "Master prompt engineering, AI system design, and LLM workflows. Practice prompt writing, explore AI architectures, and experiment in our interactive playground.",
  keywords: [
    "prompt engineering",
    "AI",
    "LLM",
    "machine learning",
    "prompt design",
    "RAG",
    "AI agents",
  ],
  authors: [{ name: "Prompt Diary Team" }],
  openGraph: {
    title: "Prompt Diary — Learn Prompt Engineering & AI Systems",
    description:
      "Master prompt engineering, AI system design, and LLM workflows.",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "Prompt Diary Logo",
      },
    ],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 45,
            opacity: 0.055,
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(0,229,255,0.08) 0px, rgba(0,229,255,0.08) 1px, transparent 2px, transparent 4px)",
          }}
        />

        {/* Background orbs */}
        <div
          className="orb"
          style={{
            width: "500px",
            height: "500px",
            background: "#7c3aed",
            top: "-100px",
            left: "-100px",
          }}
          aria-hidden="true"
        />

        <div
          className="orb"
          style={{
            width: "400px",
            height: "400px",
            background: "#3b82f6",
            top: "40%",
            right: "-100px",
            animationDelay: "2s",
          }}
          aria-hidden="true"
        />

        <div
          className="orb"
          style={{
            width: "350px",
            height: "350px",
            background: "#06b6d4",
            bottom: "10%",
            left: "20%",
            animationDelay: "4s",
          }}
          aria-hidden="true"
        />

        <AuthProvider>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
