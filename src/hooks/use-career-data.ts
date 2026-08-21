"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { apiClient } from "@/lib/apiClient";
import {
  mockApplications,
  mockCertifications,
  mockGoals,
  mockSkills,
} from "@/lib/mock-data";
import type {
  Application,
  ApplicationStatus,
  Certification,
  Goal,
  Profile,
  Skill,
  SkillLevel,
} from "@/types";

export function useCareerData() {
  const { user, isLoading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (authLoading) {
      setIsReady(false);
      return;
    }

    if (!user) {
      setApplications([]);
      setSkills([]);
      setCertifications([]);
      setGoals([]);
      setProfile(null);
      setIsReady(true);
      return;
    }

    async function loadUserData() {
      try {
        setIsReady(false);

        // Optionally seed initial starter template data if user has no data yet
        const seedKey = `careertrack_seeded_${user!.id}`;
        if (typeof window !== "undefined" && !localStorage.getItem(seedKey)) {
          await Promise.allSettled([
            apiClient.seedApplications(mockApplications),
            apiClient.seedSkills(mockSkills),
            apiClient.seedCertifications(mockCertifications),
            apiClient.seedGoals(mockGoals),
          ]);
          localStorage.setItem(seedKey, "true");
        }

        const [
          apps,
          currentSkills,
          currentCerts,
          currentGoals,
          currentProfile,
        ] = await Promise.all([
          apiClient.getApplications(),
          apiClient.getSkills(),
          apiClient.getCertifications(),
          apiClient.getGoals(),
          apiClient.getProfile(),
        ]);

        if (!cancelled) {
          setApplications(apps);
          setSkills(currentSkills);
          setCertifications(currentCerts);
          setGoals(currentGoals);
          setProfile(currentProfile);
        }
      } catch (error) {
        console.error("Failed to load user career data:", error);
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    void loadUserData();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const addApplication = useCallback(
    async (data: Omit<Application, "id" | "createdAt" | "updatedAt">) => {
      const app = await apiClient.createApplication(data);
      setApplications((prev) => [app, ...prev]);
      return app;
    },
    []
  );

  const updateApplication = useCallback(
    async (id: string, data: Partial<Application>) => {
      const updated = await apiClient.updateApplication(id, data);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updated : app))
      );
    },
    []
  );

  const deleteApplication = useCallback(async (id: string) => {
    await apiClient.deleteApplication(id);
    setApplications((prev) => prev.filter((app) => app.id !== id));
  }, []);

  const addSkill = useCallback(
    async (data: { name: string; level: SkillLevel; progress: number }) => {
      const skill = await apiClient.createSkill(data);
      setSkills((prev) => [skill, ...prev]);
      return skill;
    },
    []
  );

  const updateSkill = useCallback(
    async (id: string, data: Partial<Skill>) => {
      const updated = await apiClient.updateSkill(id, data);
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    },
    []
  );

  const deleteSkill = useCallback(
    async (id: string) => {
      await apiClient.deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    },
    []
  );

  const addCertification = useCallback(
    async (data: Omit<Certification, "id" | "createdAt">) => {
      const cert = await apiClient.createCertification(data);
      setCertifications((prev) => [cert, ...prev]);
      return cert;
    },
    []
  );

  const updateCertification = useCallback(
    async (id: string, data: Partial<Certification>) => {
      const updated = await apiClient.updateCertification(id, data);
      setCertifications((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
    },
    []
  );

  const deleteCertification = useCallback(
    async (id: string) => {
      await apiClient.deleteCertification(id);
      setCertifications((prev) => prev.filter((c) => c.id !== id));
    },
    []
  );

  const addGoal = useCallback(
    async (
      data: Omit<Goal, "id" | "createdAt" | "completed" | "completedAt">
    ) => {
      const goal = await apiClient.createGoal(data);
      setGoals((prev) => [goal, ...prev]);
      return goal;
    },
    []
  );

  const updateGoal = useCallback(
    async (id: string, data: Partial<Goal>) => {
      const updated = await apiClient.updateGoal(id, data);
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    },
    []
  );

  const toggleGoal = useCallback(
    async (id: string) => {
      const updated = await apiClient.toggleGoal(id);
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    },
    []
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      await apiClient.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    },
    []
  );

  const updateProfile = useCallback(
    async (data: Profile) => {
      const updated = await apiClient.updateProfile(data);
      setProfile(updated);
      return updated;
    },
    []
  );

  return {
    applications,
    skills,
    certifications,
    goals,
    profile,
    isReady,
    addApplication,
    updateApplication,
    deleteApplication,
    addSkill,
    updateSkill,
    deleteSkill,
    addCertification,
    updateCertification,
    deleteCertification,
    addGoal,
    updateGoal,
    toggleGoal,
    deleteGoal,
    updateProfile,
  };
}

export type {
  Application,
  ApplicationStatus,
  Certification,
  Goal,
  Profile,
  Skill,
};
