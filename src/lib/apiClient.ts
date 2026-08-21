import {
  mockApplications,
  mockCertifications,
  mockGoals,
  mockProfile,
  mockSkills,
} from "@/lib/mock-data";
import { storage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type {
  Application,
  ApplicationStatus,
  Certification,
  Goal,
  Profile,
  Skill,
} from "@/types";

export interface SanitizedUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateApplicationInput = Omit<
  Application,
  "id" | "createdAt" | "updatedAt"
>;

export type CreateSkillInput = Omit<Skill, "id" | "createdAt">;

export type CreateCertificationInput = Omit<Certification, "id" | "createdAt">;

export type CreateGoalInput = Omit<
  Goal,
  "id" | "createdAt" | "completed" | "completedAt"
>;

export type ApiMode = "local" | "remote";

export interface AuthAdapter {
  signup(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<SanitizedUser>;
  login(data: { email: string; password: string }): Promise<SanitizedUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<SanitizedUser | null>;
}

export interface ApplicationsAdapter {
  getApplications(): Promise<Application[]>;
  createApplication(data: CreateApplicationInput): Promise<Application>;
  updateApplicationStatus(
    id: string,
    status: ApplicationStatus
  ): Promise<Application>;
  updateApplication(
    id: string,
    data: Partial<Application>
  ): Promise<Application>;
  deleteApplication(id: string): Promise<void>;
  seedApplications(applications: Application[]): Promise<void>;
}

export interface SkillsAdapter {
  getSkills(): Promise<Skill[]>;
  createSkill(data: CreateSkillInput): Promise<Skill>;
  updateSkill(id: string, data: Partial<Skill>): Promise<Skill>;
  deleteSkill(id: string): Promise<void>;
  seedSkills(skills: Skill[]): Promise<void>;
}

export interface CertificationsAdapter {
  getCertifications(): Promise<Certification[]>;
  createCertification(
    data: CreateCertificationInput
  ): Promise<Certification>;
  updateCertification(
    id: string,
    data: Partial<Certification>
  ): Promise<Certification>;
  deleteCertification(id: string): Promise<void>;
  seedCertifications(certifications: Certification[]): Promise<void>;
}

export interface GoalsAdapter {
  getGoals(): Promise<Goal[]>;
  createGoal(data: CreateGoalInput): Promise<Goal>;
  updateGoal(id: string, data: Partial<Goal>): Promise<Goal>;
  toggleGoal(id: string): Promise<Goal>;
  deleteGoal(id: string): Promise<void>;
  seedGoals(goals: Goal[]): Promise<void>;
}

export interface ProfileAdapter {
  getProfile(): Promise<Profile | null>;
  updateProfile(profile: Profile): Promise<Profile>;
  seedProfile(profile: Profile): Promise<void>;
}

const localAuthAdapter: AuthAdapter = {
  async signup(data) {
    const user: SanitizedUser = {
      id: `usr_${generateId()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return user;
  },

  async login(data) {
    return {
      id: "usr_mock",
      name: "Local User",
      email: data.email.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async logout() {
    // Local no-op
  },

  async getCurrentUser() {
    return {
      id: "usr_mock",
      name: "Local User",
      email: "user@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};

const remoteAuthAdapter: AuthAdapter = {
  async signup(data) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = (await response.json().catch(() => null)) as {
      user?: SanitizedUser;
      error?: string;
    } | null;

    if (!response.ok || !body?.user) {
      throw new Error(body?.error || "Something went wrong. Please try again.");
    }
    return body.user;
  },

  async login(data) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = (await response.json().catch(() => null)) as {
      user?: SanitizedUser;
      error?: string;
    } | null;

    if (!response.ok || !body?.user) {
      throw new Error(body?.error || "Invalid email or password.");
    }
    return body.user;
  },

  async logout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to log out");
    }
  },

  async getCurrentUser() {
    try {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        return null;
      }
      const body = (await response.json().catch(() => null)) as {
        user?: SanitizedUser;
      } | null;
      return body?.user ?? null;
    } catch {
      return null;
    }
  },
};

const localApplicationsAdapter: ApplicationsAdapter = {
  async getApplications() {
    return storage.getApplications();
  },

  async createApplication(data) {
    const now = new Date().toISOString();
    const application: Application = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const applications = storage.getApplications();
    storage.setApplications([application, ...applications]);
    return application;
  },

  async updateApplicationStatus(id, status) {
    const applications = storage.getApplications();
    const index = applications.findIndex((app) => app.id === id);
    if (index === -1) {
      throw new Error(`Application not found: ${id}`);
    }

    const updated: Application = {
      ...applications[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    applications[index] = updated;
    storage.setApplications(applications);
    return updated;
  },

  async updateApplication(id, data) {
    const applications = storage.getApplications();
    const index = applications.findIndex((app) => app.id === id);
    if (index === -1) {
      throw new Error(`Application not found: ${id}`);
    }

    const updated: Application = {
      ...applications[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    applications[index] = updated;
    storage.setApplications(applications);
    return updated;
  },

  async deleteApplication(id) {
    const applications = storage.getApplications();
    storage.setApplications(applications.filter((app) => app.id !== id));
  },

  async seedApplications(applications) {
    if (storage.getApplications().length === 0) {
      storage.setApplications(applications);
    }
  },
};

const remoteApplicationsAdapter: ApplicationsAdapter = {
  async getApplications() {
    const response = await fetch("/api/applications");
    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }
    return response.json() as Promise<Application[]>;
  },

  async createApplication(data) {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create application");
    }
    return response.json() as Promise<Application>;
  },

  async updateApplicationStatus(id, status) {
    const response = await fetch(`/api/applications/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error("Failed to update application status");
    }
    return response.json() as Promise<Application>;
  },

  async updateApplication(id, data) {
    const response = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update application");
    }
    return response.json() as Promise<Application>;
  },

  async deleteApplication(id) {
    const response = await fetch(`/api/applications/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete application");
    }
  },

  async seedApplications(applications) {
    const existingResponse = await fetch("/api/applications");
    if (!existingResponse.ok) {
      throw new Error("Failed to check existing applications");
    }
    const existing = (await existingResponse.json()) as Application[];
    if (existing.length > 0) {
      return;
    }

    const response = await fetch("/api/applications/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applications }),
    });
    if (!response.ok) {
      throw new Error("Failed to seed applications");
    }
  },
};

const localSkillsAdapter: SkillsAdapter = {
  async getSkills() {
    return storage.getSkills();
  },

  async createSkill(data) {
    const skill: Skill = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const skills = storage.getSkills();
    storage.setSkills([skill, ...skills]);
    return skill;
  },

  async updateSkill(id, data) {
    const skills = storage.getSkills();
    const index = skills.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Skill not found: ${id}`);
    }

    const updated: Skill = {
      ...skills[index],
      ...data,
    };
    skills[index] = updated;
    storage.setSkills(skills);
    return updated;
  },

  async deleteSkill(id) {
    const skills = storage.getSkills();
    storage.setSkills(skills.filter((s) => s.id !== id));
  },

  async seedSkills(skills) {
    if (storage.getSkills().length === 0) {
      storage.setSkills(skills);
    }
  },
};

const remoteSkillsAdapter: SkillsAdapter = {
  async getSkills() {
    const response = await fetch("/api/skills");
    if (!response.ok) {
      throw new Error("Failed to fetch skills");
    }
    return response.json() as Promise<Skill[]>;
  },

  async createSkill(data) {
    const response = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create skill");
    }
    return response.json() as Promise<Skill>;
  },

  async updateSkill(id, data) {
    const response = await fetch(`/api/skills/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update skill");
    }
    return response.json() as Promise<Skill>;
  },

  async deleteSkill(id) {
    const response = await fetch(`/api/skills/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete skill");
    }
  },

  async seedSkills(skills) {
    const existingResponse = await fetch("/api/skills");
    if (!existingResponse.ok) {
      throw new Error("Failed to check existing skills");
    }
    const existing = (await existingResponse.json()) as Skill[];
    if (existing.length > 0) {
      return;
    }

    const response = await fetch("/api/skills/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills }),
    });
    if (!response.ok) {
      throw new Error("Failed to seed skills");
    }
  },
};

const localCertificationsAdapter: CertificationsAdapter = {
  async getCertifications() {
    return storage.getCertifications();
  },

  async createCertification(data) {
    const certification: Certification = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const certifications = storage.getCertifications();
    storage.setCertifications([certification, ...certifications]);
    return certification;
  },

  async updateCertification(id, data) {
    const certifications = storage.getCertifications();
    const index = certifications.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Certification not found: ${id}`);
    }

    const updated: Certification = {
      ...certifications[index],
      ...data,
    };
    certifications[index] = updated;
    storage.setCertifications(certifications);
    return updated;
  },

  async deleteCertification(id) {
    const certifications = storage.getCertifications();
    storage.setCertifications(certifications.filter((c) => c.id !== id));
  },

  async seedCertifications(certifications) {
    if (storage.getCertifications().length === 0) {
      storage.setCertifications(certifications);
    }
  },
};

const remoteCertificationsAdapter: CertificationsAdapter = {
  async getCertifications() {
    const response = await fetch("/api/certifications");
    if (!response.ok) {
      throw new Error("Failed to fetch certifications");
    }
    return response.json() as Promise<Certification[]>;
  },

  async createCertification(data) {
    const response = await fetch("/api/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create certification");
    }
    return response.json() as Promise<Certification>;
  },

  async updateCertification(id, data) {
    const response = await fetch(`/api/certifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update certification");
    }
    return response.json() as Promise<Certification>;
  },

  async deleteCertification(id) {
    const response = await fetch(`/api/certifications/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete certification");
    }
  },

  async seedCertifications(certifications) {
    const existingResponse = await fetch("/api/certifications");
    if (!existingResponse.ok) {
      throw new Error("Failed to check existing certifications");
    }
    const existing = (await existingResponse.json()) as Certification[];
    if (existing.length > 0) {
      return;
    }

    const response = await fetch("/api/certifications/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ certifications }),
    });
    if (!response.ok) {
      throw new Error("Failed to seed certifications");
    }
  },
};

const localGoalsAdapter: GoalsAdapter = {
  async getGoals() {
    return storage.getGoals();
  },

  async createGoal(data) {
    const goal: Goal = {
      ...data,
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const goals = storage.getGoals();
    storage.setGoals([goal, ...goals]);
    return goal;
  },

  async updateGoal(id, data) {
    const goals = storage.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new Error(`Goal not found: ${id}`);
    }

    const updated: Goal = {
      ...goals[index],
      ...data,
    };
    goals[index] = updated;
    storage.setGoals(goals);
    return updated;
  },

  async toggleGoal(id) {
    const goals = storage.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new Error(`Goal not found: ${id}`);
    }

    const current = goals[index];
    const completed = !current.completed;
    const updated: Goal = {
      ...current,
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    };
    goals[index] = updated;
    storage.setGoals(goals);
    return updated;
  },

  async deleteGoal(id) {
    const goals = storage.getGoals();
    storage.setGoals(goals.filter((g) => g.id !== id));
  },

  async seedGoals(goals) {
    if (storage.getGoals().length === 0) {
      storage.setGoals(goals);
    }
  },
};

const remoteGoalsAdapter: GoalsAdapter = {
  async getGoals() {
    const response = await fetch("/api/goals");
    if (!response.ok) {
      throw new Error("Failed to fetch goals");
    }
    return response.json() as Promise<Goal[]>;
  },

  async createGoal(data) {
    const response = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create goal");
    }
    return response.json() as Promise<Goal>;
  },

  async updateGoal(id, data) {
    const response = await fetch(`/api/goals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update goal");
    }
    return response.json() as Promise<Goal>;
  },

  async toggleGoal(id) {
    const response = await fetch(`/api/goals/${id}/toggle`, {
      method: "PATCH",
    });
    if (!response.ok) {
      throw new Error("Failed to toggle goal");
    }
    return response.json() as Promise<Goal>;
  },

  async deleteGoal(id) {
    const response = await fetch(`/api/goals/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete goal");
    }
  },

  async seedGoals(goals) {
    const existingResponse = await fetch("/api/goals");
    if (!existingResponse.ok) {
      throw new Error("Failed to check existing goals");
    }
    const existing = (await existingResponse.json()) as Goal[];
    if (existing.length > 0) {
      return;
    }

    const response = await fetch("/api/goals/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goals }),
    });
    if (!response.ok) {
      throw new Error("Failed to seed goals");
    }
  },
};

const localProfileAdapter: ProfileAdapter = {
  async getProfile() {
    return storage.getProfile();
  },

  async updateProfile(profile) {
    storage.setProfile(profile);
    return profile;
  },

  async seedProfile(profile) {
    if (!storage.getProfile()) {
      storage.setProfile(profile);
    }
  },
};

const remoteProfileAdapter: ProfileAdapter = {
  async getProfile() {
    const response = await fetch("/api/profile");
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
    return response.json() as Promise<Profile | null>;
  },

  async updateProfile(profile) {
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error("Failed to update profile");
    }
    return response.json() as Promise<Profile>;
  },

  async seedProfile(profile) {
    const existingResponse = await fetch("/api/profile");
    if (!existingResponse.ok) {
      throw new Error("Failed to check existing profile");
    }
    const existing = (await existingResponse.json()) as Profile | null;
    if (existing) {
      return;
    }

    const response = await fetch("/api/profile/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    if (!response.ok) {
      throw new Error("Failed to seed profile");
    }
  },
};

function resolveApiMode(): ApiMode {
  const mode = process.env.NEXT_PUBLIC_API_MODE;
  return mode === "remote" ? "remote" : "local";
}

class ApiClient {
  private authAdapter: AuthAdapter;
  private applicationsAdapter: ApplicationsAdapter;
  private skillsAdapter: SkillsAdapter;
  private certificationsAdapter: CertificationsAdapter;
  private goalsAdapter: GoalsAdapter;
  private profileAdapter: ProfileAdapter;

  constructor(mode: ApiMode = resolveApiMode()) {
    this.authAdapter =
      mode === "remote" ? remoteAuthAdapter : localAuthAdapter;
    this.applicationsAdapter =
      mode === "remote" ? remoteApplicationsAdapter : localApplicationsAdapter;
    this.skillsAdapter =
      mode === "remote" ? remoteSkillsAdapter : localSkillsAdapter;
    this.certificationsAdapter =
      mode === "remote"
        ? remoteCertificationsAdapter
        : localCertificationsAdapter;
    this.goalsAdapter =
      mode === "remote" ? remoteGoalsAdapter : localGoalsAdapter;
    this.profileAdapter =
      mode === "remote" ? remoteProfileAdapter : localProfileAdapter;
  }

  getMode(): ApiMode {
    return resolveApiMode();
  }

  setAuthAdapter(adapter: AuthAdapter): void {
    this.authAdapter = adapter;
  }

  setApplicationsAdapter(adapter: ApplicationsAdapter): void {
    this.applicationsAdapter = adapter;
  }

  setAdapter(adapter: ApplicationsAdapter): void {
    this.applicationsAdapter = adapter;
  }

  setSkillsAdapter(adapter: SkillsAdapter): void {
    this.skillsAdapter = adapter;
  }

  setCertificationsAdapter(adapter: CertificationsAdapter): void {
    this.certificationsAdapter = adapter;
  }

  setGoalsAdapter(adapter: GoalsAdapter): void {
    this.goalsAdapter = adapter;
  }

  setProfileAdapter(adapter: ProfileAdapter): void {
    this.profileAdapter = adapter;
  }

  // Auth
  signup(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<SanitizedUser> {
    return this.authAdapter.signup(data);
  }

  login(data: { email: string; password: string }): Promise<SanitizedUser> {
    return this.authAdapter.login(data);
  }

  logout(): Promise<void> {
    return this.authAdapter.logout();
  }

  getCurrentUser(): Promise<SanitizedUser | null> {
    return this.authAdapter.getCurrentUser();
  }

  // Applications
  getApplications(): Promise<Application[]> {
    return this.applicationsAdapter.getApplications();
  }

  createApplication(data: CreateApplicationInput): Promise<Application> {
    return this.applicationsAdapter.createApplication(data);
  }

  updateApplicationStatus(
    id: string,
    status: ApplicationStatus
  ): Promise<Application> {
    return this.applicationsAdapter.updateApplicationStatus(id, status);
  }

  updateApplication(
    id: string,
    data: Partial<Application>
  ): Promise<Application> {
    return this.applicationsAdapter.updateApplication(id, data);
  }

  deleteApplication(id: string): Promise<void> {
    return this.applicationsAdapter.deleteApplication(id);
  }

  async seedApplications(
    applications: Application[] = mockApplications
  ): Promise<void> {
    await this.applicationsAdapter.seedApplications(applications);
  }

  // Skills
  getSkills(): Promise<Skill[]> {
    return this.skillsAdapter.getSkills();
  }

  createSkill(data: CreateSkillInput): Promise<Skill> {
    return this.skillsAdapter.createSkill(data);
  }

  updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    return this.skillsAdapter.updateSkill(id, data);
  }

  deleteSkill(id: string): Promise<void> {
    return this.skillsAdapter.deleteSkill(id);
  }

  async seedSkills(skills: Skill[] = mockSkills): Promise<void> {
    await this.skillsAdapter.seedSkills(skills);
  }

  // Certifications
  getCertifications(): Promise<Certification[]> {
    return this.certificationsAdapter.getCertifications();
  }

  createCertification(
    data: CreateCertificationInput
  ): Promise<Certification> {
    return this.certificationsAdapter.createCertification(data);
  }

  updateCertification(
    id: string,
    data: Partial<Certification>
  ): Promise<Certification> {
    return this.certificationsAdapter.updateCertification(id, data);
  }

  deleteCertification(id: string): Promise<void> {
    return this.certificationsAdapter.deleteCertification(id);
  }

  async seedCertifications(
    certifications: Certification[] = mockCertifications
  ): Promise<void> {
    await this.certificationsAdapter.seedCertifications(certifications);
  }

  // Goals
  getGoals(): Promise<Goal[]> {
    return this.goalsAdapter.getGoals();
  }

  createGoal(data: CreateGoalInput): Promise<Goal> {
    return this.goalsAdapter.createGoal(data);
  }

  updateGoal(id: string, data: Partial<Goal>): Promise<Goal> {
    return this.goalsAdapter.updateGoal(id, data);
  }

  toggleGoal(id: string): Promise<Goal> {
    return this.goalsAdapter.toggleGoal(id);
  }

  deleteGoal(id: string): Promise<void> {
    return this.goalsAdapter.deleteGoal(id);
  }

  async seedGoals(goals: Goal[] = mockGoals): Promise<void> {
    await this.goalsAdapter.seedGoals(goals);
  }

  // Profile
  getProfile(): Promise<Profile | null> {
    return this.profileAdapter.getProfile();
  }

  updateProfile(profile: Profile): Promise<Profile> {
    return this.profileAdapter.updateProfile(profile);
  }

  async seedProfile(profile: Profile = mockProfile): Promise<void> {
    await this.profileAdapter.seedProfile(profile);
  }
}

export const apiClient = new ApiClient();

export const signup = (data: {
  name: string;
  email: string;
  password: string;
}) => apiClient.signup(data);
export const login = (data: { email: string; password: string }) =>
  apiClient.login(data);
export const logout = () => apiClient.logout();
export const getCurrentUser = () => apiClient.getCurrentUser();

export const getApplications = () => apiClient.getApplications();
export const createApplication = (data: CreateApplicationInput) =>
  apiClient.createApplication(data);
export const updateApplicationStatus = (
  id: string,
  status: ApplicationStatus
) => apiClient.updateApplicationStatus(id, status);

export const getSkills = () => apiClient.getSkills();
export const createSkill = (data: CreateSkillInput) => apiClient.createSkill(data);
export const updateSkill = (id: string, data: Partial<Skill>) =>
  apiClient.updateSkill(id, data);
export const deleteSkill = (id: string) => apiClient.deleteSkill(id);

export const getCertifications = () => apiClient.getCertifications();
export const createCertification = (data: CreateCertificationInput) =>
  apiClient.createCertification(data);
export const updateCertification = (
  id: string,
  data: Partial<Certification>
) => apiClient.updateCertification(id, data);
export const deleteCertification = (id: string) =>
  apiClient.deleteCertification(id);

export const getGoals = () => apiClient.getGoals();
export const createGoal = (data: CreateGoalInput) => apiClient.createGoal(data);
export const updateGoal = (id: string, data: Partial<Goal>) =>
  apiClient.updateGoal(id, data);
export const toggleGoal = (id: string) => apiClient.toggleGoal(id);
export const deleteGoal = (id: string) => apiClient.deleteGoal(id);

export const getProfile = () => apiClient.getProfile();
export const updateProfile = (profile: Profile) =>
  apiClient.updateProfile(profile);

export {
  localAuthAdapter,
  remoteAuthAdapter,
  localApplicationsAdapter as localAdapter,
  remoteApplicationsAdapter as remoteAdapter,
  localApplicationsAdapter,
  remoteApplicationsAdapter,
  localSkillsAdapter,
  remoteSkillsAdapter,
  localCertificationsAdapter,
  remoteCertificationsAdapter,
  localGoalsAdapter,
  remoteGoalsAdapter,
  localProfileAdapter,
  remoteProfileAdapter,
};
