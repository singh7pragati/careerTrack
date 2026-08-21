"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { apiClient, type SanitizedUser } from "@/lib/apiClient";

interface AuthContextType {
  user: SanitizedUser | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<SanitizedUser>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<SanitizedUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SanitizedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      const loggedInUser = await apiClient.login(data);
      setUser(loggedInUser);
      return loggedInUser;
    },
    []
  );

  const signup = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      const signedUpUser = await apiClient.signup(data);
      setUser(signedUpUser);
      return signedUpUser;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
