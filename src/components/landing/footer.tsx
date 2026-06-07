import { Logo } from "@/components/layout/logo";

export function Footer() {
  return (
    <footer className="border-t py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} CareerTrack. Built for students & freshers.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#benefits" className="hover:text-foreground transition-colors">
              Benefits
            </a>
            <a href="#cta" className="hover:text-foreground transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
