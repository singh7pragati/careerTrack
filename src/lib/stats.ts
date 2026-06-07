import type { ActivityItem, Application, DashboardStats } from "@/types";
import { formatDate } from "@/lib/utils";

export function computeDashboardStats(
  applications: Application[]
): DashboardStats {
  return {
    totalApplications: applications.length,
    interviewsScheduled: applications.filter(
      (a) => a.status === "Interview Scheduled"
    ).length,
    offersReceived: applications.filter((a) => a.status === "Offer Received")
      .length,
    rejections: applications.filter((a) => a.status === "Rejected").length,
  };
}

export function buildRecentActivity(
  applications: Application[]
): ActivityItem[] {
  return applications
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 6)
    .map((app) => ({
      id: `activity-${app.id}`,
      type: "application" as const,
      message: `${app.companyName} — ${app.role} updated to "${app.status}"`,
      timestamp: app.updatedAt,
    }));
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    "OA Scheduled":
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    "OA Completed":
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    "Interview Scheduled":
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    "Interview Completed":
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    "Offer Received":
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    Rejected:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  return colors[status] ?? "bg-muted text-muted-foreground";
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export { formatDate };
