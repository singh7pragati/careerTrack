import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGreeting } from "@/lib/stats";

interface WelcomeSectionProps {
  name?: string;
}

export function WelcomeSection({ name }: WelcomeSectionProps) {
  const displayName = name?.split(" ")[0] ?? "there";

  return (
    <div className="rounded-xl border bg-gradient-to-r from-primary/5 via-card to-accent/5 p-6 mb-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {getGreeting()}, {displayName}! 👋
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Here&apos;s an overview of your career progress today.
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/applications">
            <Plus className="h-4 w-4" />
            Add Application
          </Link>
        </Button>
      </div>
    </div>
  );
}
