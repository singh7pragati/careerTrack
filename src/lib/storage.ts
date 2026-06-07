import type {
  Application,
  Certification,
  Goal,
  Profile,
  Skill,
} from "@/types";

const STORAGE_KEYS = {
  applications: "careertrack_applications",
  skills: "careertrack_skills",
  certifications: "careertrack_certifications",
  goals: "careertrack_goals",
  profile: "careertrack_profile",
  initialized: "careertrack_initialized",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
  }
}

export const storage = {
  getApplications: (): Application[] =>
    getItem<Application[]>(STORAGE_KEYS.applications, []),
  setApplications: (apps: Application[]) =>
    setItem(STORAGE_KEYS.applications, apps),

  getSkills: (): Skill[] => getItem<Skill[]>(STORAGE_KEYS.skills, []),
  setSkills: (skills: Skill[]) => setItem(STORAGE_KEYS.skills, skills),

  getCertifications: (): Certification[] =>
    getItem<Certification[]>(STORAGE_KEYS.certifications, []),
  setCertifications: (certs: Certification[]) =>
    setItem(STORAGE_KEYS.certifications, certs),

  getGoals: (): Goal[] => getItem<Goal[]>(STORAGE_KEYS.goals, []),
  setGoals: (goals: Goal[]) => setItem(STORAGE_KEYS.goals, goals),

  getProfile: (): Profile | null =>
    getItem<Profile | null>(STORAGE_KEYS.profile, null),
  setProfile: (profile: Profile) => setItem(STORAGE_KEYS.profile, profile),

  isInitialized: (): boolean =>
    getItem<boolean>(STORAGE_KEYS.initialized, false),
  setInitialized: () => setItem(STORAGE_KEYS.initialized, true),
};
