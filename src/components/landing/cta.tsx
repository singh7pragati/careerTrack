import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section id="cta" className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Project Demonstration
            </h2>
            <p className="text-primary-foreground/80 mb-8 leading-relaxed">
              Explore the CareerTrack dashboard to view application tracking,
              skill monitoring, certification management, and goal planning
              modules implemented in this project.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="shadow-lg"
            >
              <Link href="/dashboard">
                View Dashboard
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
