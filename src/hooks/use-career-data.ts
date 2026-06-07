"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  mockApplications,
  mockCertifications,
  mockGoals,
  mockProfile,
  mockSkills,
} from "@/lib/mock-data";
import { generateId } from "@/lib/utils";
import type {
  Application,
  ApplicationStatus,
  Certification,
  Goal,
  Profile,
  Skill,
  SkillLevel,
} from "@/types";

const INIT_KEY = "careertrack_initialized";

export function useCareerData() {
  const [applications, setApplications] = useLocalStorage<Application[]>(
    "careertrack_applications",
    []
  );
  const [skills, setSkills] = useLocalStorage<Skill[]>(
    "careertrack_skills",
    []
  );
  const [certifications, setCertifications] = useLocalStorage<Certification[]>(
    "careertrack_certifications",
    []
  );
  const [goals, setGoals] = useLocalStorage<Goal[]>("careertrack_goals", []);
  const [profile, setProfile] = useLocalStorage<Profile | null>(
    "careertrack_profile",
    null
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const initialized = localStorage.getItem(INIT_KEY);
      if (!initialized) {
        setApplications(mockApplications);
        setSkills(mockSkills);
        setCertifications(mockCertifications);
        setGoals(mockGoals);
        setProfile(mockProfile);
        localStorage.setItem(INIT_KEY, "true");
      }
    } catch (error) {
      console.error("Failed to initialize career data:", error);
    }
    setIsReady(true);
  }, [setApplications, setSkills, setCertifications, setGoals, setProfile]);

  const addApplication = useCallback(
    (data: Omit<Application, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const app: Application = {
        ...data,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setApplications((prev) => [app, ...prev]);
      return app;
    },
    [setApplications]
  );

  const updateApplication = useCallback(
    (id: string, data: Partial<Application>) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, ...data, updatedAt: new Date().toISOString() }
            : app
        )
      );
    },
    [setApplications]
  );

  const deleteApplication = useCallback(
    (id: string) => {
      setApplications((prev) => prev.filter((app) => app.id !== id));
    },
    [setApplications]
  );

  const addSkill = useCallback(
    (data: { name: string; level: SkillLevel; progress: number }) => {
      const skill: Skill = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setSkills((prev) => [skill, ...prev]);
      return skill;
    },
    [setSkills]
  );

  const updateSkill = useCallback(
    (id: string, data: Partial<Skill>) => {
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
    },
    [setSkills]
  );

  const deleteSkill = useCallback(
    (id: string) => {
      setSkills((prev) => prev.filter((s) => s.id !== id));
    },
    [setSkills]
  );

  const addCertification = useCallback(
    (data: Omit<Certification, "id" | "createdAt">) => {
      const cert: Certification = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setCertifications((prev) => [cert, ...prev]);
      return cert;
    },
    [setCertifications]
  );

  const updateCertification = useCallback(
    (id: string, data: Partial<Certification>) => {
      setCertifications((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
    },
    [setCertifications]
  );

  const deleteCertification = useCallback(
    (id: string) => {
      setCertifications((prev) => prev.filter((c) => c.id !== id));
    },
    [setCertifications]
  );

  const addGoal = useCallback(
    (data: Omit<Goal, "id" | "createdAt" | "completed" | "completedAt">) => {
      const goal: Goal = {
        ...data,
        id: generateId(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setGoals((prev) => [goal, ...prev]);
      return goal;
    },
    [setGoals]
  );

  const toggleGoal = useCallback(
    (id: string) => {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === id
            ? {
                ...g,
                completed: !g.completed,
                completedAt: !g.completed
                  ? new Date().toISOString()
                  : undefined,
              }
            : g
        )
      );
    },
    [setGoals]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    },
    [setGoals]
  );

  const updateProfile = useCallback(
    (data: Profile) => {
      setProfile(data);
    },
    [setProfile]
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
