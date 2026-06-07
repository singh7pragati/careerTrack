"use client";

import { useEffect, useState } from "react";
import { Save, User } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useCareerContext } from "@/components/providers/career-data-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/types";

const emptyProfile: Profile = {
  name: "",
  email: "",
  college: "",
  degree: "",
  graduationYear: "",
};

export default function ProfilePage() {
  const { profile, isReady, updateProfile } = useCareerContext();
  const [form, setForm] = useState<Profile>(emptyProfile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  const handleChange = (field: keyof Profile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setError("");
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isReady) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <DashboardHeader
        title="Profile"
        description="Manage your personal information"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            {saved && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-md px-3 py-2">
                Profile saved successfully!
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@university.edu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                <Input
                  id="college"
                  value={form.college}
                  onChange={(e) => handleChange("college", e.target.value)}
                  placeholder="Your college name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  value={form.degree}
                  onChange={(e) => handleChange("degree", e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  value={form.graduationYear}
                  onChange={(e) =>
                    handleChange("graduationYear", e.target.value)
                  }
                  placeholder="e.g. 2026"
                />
              </div>
            </div>
            <div className="pt-2">
              <Button type="submit">
                <Save className="h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
