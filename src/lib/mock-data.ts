import type {
  Application,
  Certification,
  Goal,
  Profile,
  Skill,
} from "@/types";

export const mockProfile: Profile = {
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  college: "State University of Technology",
  degree: "B.Tech Computer Science",
  graduationYear: "2026",
};

export const mockApplications: Application[] = [
  {
    id: "app-1",
    companyName: "Google",
    role: "Software Engineering Intern",
    location: "Mountain View, CA",
    applicationDate: "2026-01-15",
    status: "Interview Scheduled",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-02-20T14:30:00Z",
  },
  {
    id: "app-2",
    companyName: "Microsoft",
    role: "SDE Intern",
    location: "Redmond, WA",
    applicationDate: "2026-01-20",
    status: "OA Completed",
    createdAt: "2026-01-20T09:00:00Z",
    updatedAt: "2026-02-18T11:00:00Z",
  },
  {
    id: "app-3",
    companyName: "Amazon",
    role: "SDE-1",
    location: "Seattle, WA",
    applicationDate: "2026-02-01",
    status: "Offer Received",
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-03-01T16:00:00Z",
  },
  {
    id: "app-4",
    companyName: "Meta",
    role: "Software Engineer Intern",
    location: "Menlo Park, CA",
    applicationDate: "2026-02-05",
    status: "Rejected",
    createdAt: "2026-02-05T12:00:00Z",
    updatedAt: "2026-02-28T10:00:00Z",
  },
  {
    id: "app-5",
    companyName: "Stripe",
    role: "Backend Intern",
    location: "Remote",
    applicationDate: "2026-02-10",
    status: "Applied",
    createdAt: "2026-02-10T15:00:00Z",
    updatedAt: "2026-02-10T15:00:00Z",
  },
];

export const mockSkills: Skill[] = [
  {
    id: "skill-1",
    name: "React / Next.js",
    level: "Advanced",
    progress: 80,
    createdAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "skill-2",
    name: "TypeScript",
    level: "Intermediate",
    progress: 65,
    createdAt: "2025-09-15T00:00:00Z",
  },
  {
    id: "skill-3",
    name: "Data Structures & Algorithms",
    level: "Intermediate",
    progress: 70,
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "skill-4",
    name: "System Design",
    level: "Beginner",
    progress: 35,
    createdAt: "2025-11-01T00:00:00Z",
  },
];

export const mockCertifications: Certification[] = [
  {
    id: "cert-1",
    name: "AWS Cloud Practitioner",
    organization: "Amazon Web Services",
    dateEarned: "2025-08-15",
    certificateLink: "https://aws.amazon.com/certification/",
    createdAt: "2025-08-15T00:00:00Z",
  },
  {
    id: "cert-2",
    name: "Meta Front-End Developer",
    organization: "Meta",
    dateEarned: "2025-11-20",
    certificateLink: "https://www.coursera.org/",
    createdAt: "2025-11-20T00:00:00Z",
  },
];

export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Complete 50 LeetCode problems",
    description: "Focus on arrays, trees, and dynamic programming",
    type: "short-term",
    completed: false,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "goal-2",
    title: "Land a summer internship",
    description: "Target FAANG or top-tier startups",
    type: "short-term",
    completed: false,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "goal-3",
    title: "Become a senior software engineer",
    description: "Build expertise in distributed systems and leadership",
    type: "long-term",
    completed: false,
    createdAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "goal-4",
    title: "Build a portfolio of 5 projects",
    description: "Include full-stack and open-source contributions",
    type: "long-term",
    completed: true,
    completedAt: "2025-12-01T00:00:00Z",
    createdAt: "2025-06-01T00:00:00Z",
  },
];
