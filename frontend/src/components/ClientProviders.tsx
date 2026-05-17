"use client";

import { ToastProvider } from "@/components/Toast";
import CommandPalette from "@/components/CommandPalette";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <CommandPalette />
      {children}
    </ToastProvider>
  );
}
