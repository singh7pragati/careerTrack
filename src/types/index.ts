export type ApplicationStatus =
  | "Applied"
  | "OA Scheduled"
  | "OA Completed"
  | "Interview Scheduled"
  | "Interview Completed"
  | "Offer Received"
  | "Rejected";

export interface Application {
  id: string;
  companyName: string;
  role: string;
  location: string;
  applicationDate: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  progress: number;
  createdAt: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  dateEarned: string;
  certificateLink: string;
  createdAt: string;
}

export type GoalType = "short-term" | "long-term";

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Profile {
  name: string;
  email: string;
  college: string;
  degree: string;
  graduationYear: string;
}

export interface ActivityItem {
  id: string;
  type: "application" | "skill" | "certification" | "goal";
  message: string;
  timestamp: string;
}

export interface DashboardStats {
  totalApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  rejections: number;
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Applied",
  "OA Scheduled",
  "OA Completed",
  "Interview Scheduled",
  "Interview Completed",
  "Offer Received",
  "Rejected",
];

export const SKILL_LEVELS: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];
