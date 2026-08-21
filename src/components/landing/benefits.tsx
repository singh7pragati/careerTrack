import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Centralized management of job and internship applications",
  "Structured tracking of application status across interview rounds",
  "Skill proficiency monitoring with progress visualization",
  "Certification records with issuing organization details",
  "Short-term and long-term career goal planning",
  "Client-side data persistence using browser local storage",
];

export function Benefits() {
  return (
    <section id="benefits" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Key Features of CareerTrack
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              CareerTrack addresses the need for a unified career management
              system by providing students with structured tools to organize
              applications, monitor skills, and plan career objectives from a
              single interface.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="rounded-2xl border bg-card p-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Dashboard Overview</span>
                  <span className="text-xs text-muted-foreground">Sample data</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Applications", value: "12" },
                    { label: "Interviews", value: "3" },
                    { label: "Offers", value: "1" },
                    { label: "Skills", value: "8" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg bg-muted/50 p-4 text-center"
                    >
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground mb-2">Recent Activity</p>
                  <div className="space-y-2">
                    {[
                      "Google — Interview Scheduled",
                      "Amazon — Offer Received",
                      "React skill — 80% progress",
                    ].map((item) => (
                      <div
                        key={item}
                        className="text-xs bg-background rounded px-3 py-2 border"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
