import { Briefcase } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
        <Briefcase className="h-5 w-5" />
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight">
          Career<span className="text-primary">Track</span>
        </span>
      )}
    </Link>
  );
}
