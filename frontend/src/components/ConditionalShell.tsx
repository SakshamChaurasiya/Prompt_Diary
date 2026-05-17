"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AUTH_ROUTES = ["/login", "/signup", "/auth/callback"];

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "?"));

  if (isAuthPage) {
    // Auth pages get a clean full-viewport wrapper with no nav/footer
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 relative z-10 page-transition-enter">{children}</main>
      <Footer />
    </>
  );
}
