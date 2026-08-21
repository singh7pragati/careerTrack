import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="container mx-auto px-4 py-8 flex items-center justify-center flex-1">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CareerTrack. All rights reserved.
      </footer>
    </div>
  );
}
