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
      "Record and update job and internship applications through defined status stages from Applied to Offer Received.",
  },
  {
    icon: Calendar,
    title: "Deadline Management",
    description:
      "Maintain application dates and interview round schedules in a structured format for timely follow-up.",
  },
  {
    icon: Sparkles,
    title: "Skills Progress",
    description:
      "Document technical skills with proficiency levels and visual progress indicators for self-assessment.",
  },
  {
    icon: Award,
    title: "Certifications",
    description:
      "Maintain certification records including issuing organization, date earned, and verification links.",
  },
  {
    icon: Goal,
    title: "Career Goals",
    description:
      "Define short-term and long-term career objectives and track completion status over time.",
  },
  {
    icon: Search,
    title: "Smart Filtering",
    description:
      "Filter applications by status and search by company or role for efficient data retrieval.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            System Modules
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Core functional modules developed as part of the CareerTrack career
            management system for students and fresh graduates.
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
