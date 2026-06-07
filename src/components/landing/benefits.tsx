import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Stay organized during placement season",
  "Track multiple applications without spreadsheets",
  "Visualize your skill development over time",
  "Set and achieve meaningful career milestones",
  "Impress recruiters with a polished career portfolio",
  "Works offline with local storage — your data stays private",
];

export function Benefits() {
  return (
    <section id="benefits" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why Students Love CareerTrack
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Placement season is stressful enough. CareerTrack gives you a
              clear, organized view of your entire career pipeline so you can
              focus on what matters — preparing and performing.
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
                  <span className="text-xs text-muted-foreground">Live preview</span>
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
