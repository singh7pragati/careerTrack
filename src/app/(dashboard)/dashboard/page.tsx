"use client";

import {
  Briefcase,
  Calendar,
  ThumbsDown,
  Trophy,
} from "lucide-react";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { WelcomeSection } from "@/components/dashboard/welcome-section";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useAuth } from "@/components/providers/auth-provider";
import { useCareerContext } from "@/components/providers/career-data-provider";
import {
  buildRecentActivity,
  computeDashboardStats,
} from "@/lib/stats";

export default function DashboardPage() {
  const { user } = useAuth();
  const { applications, profile, isReady } = useCareerContext();

  if (!isReady) {
    return <LoadingSpinner />;
  }

  const stats = computeDashboardStats(applications);
  const activities = buildRecentActivity(applications);

  return (
    <div>
      <DashboardHeader
        title="Dashboard"
        description="Your career overview at a glance"
      />
      <WelcomeSection name={profile?.name || user?.name} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={Briefcase}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
        />
        <StatCard
          title="Interviews Scheduled"
          value={stats.interviewsScheduled}
          icon={Calendar}
          iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
        />
        <StatCard
          title="Offers Received"
          value={stats.offersReceived}
          icon={Trophy}
          iconClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
        />
        <StatCard
          title="Rejections"
          value={stats.rejections}
          icon={ThumbsDown}
          iconClassName="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
        />
      </div>
      <RecentActivity activities={activities} />
    </div>
  );
}
