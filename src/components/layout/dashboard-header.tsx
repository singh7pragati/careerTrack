"use client";

import { ThemeToggle } from "@/components/theme-toggle";

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 mb-6 lg:mb-8">
      <div className="animate-slide-up">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            {description}
          </p>
        )}
      </div>
      <div className="lg:hidden shrink-0">
        <ThemeToggle />
      </div>
    </header>
  );
}
