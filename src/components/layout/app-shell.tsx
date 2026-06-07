"use client";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
