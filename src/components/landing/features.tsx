import {
  Award,
  Briefcase,
  Calendar,
  Goal,
  Search,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Briefcase,
    title: "Application Tracker",
    description:
      "Track every job and internship application with status updates from Applied to Offer Received.",
  },
  {
    icon: Calendar,
    title: "Deadline Management",
    description:
      "Never miss an OA or interview. Keep application dates and round schedules organized.",
  },
  {
    icon: Sparkles,
    title: "Skills Progress",
    description:
      "Monitor your technical skills with levels and visual progress bars to stay interview-ready.",
  },
  {
    icon: Award,
    title: "Certifications",
    description:
      "Store all your certifications with issuing organizations and certificate links in one place.",
  },
  {
    icon: Goal,
    title: "Career Goals",
    description:
      "Set short-term and long-term career goals and track your progress toward achieving them.",
  },
  {
    icon: Search,
    title: "Smart Filtering",
    description:
      "Filter applications by status and search by company or role to find what you need instantly.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete toolkit designed specifically for students and freshers
            navigating the competitive job market.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className="border-0 shadow-sm animate-slide-up hover:shadow-md transition-shadow"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
