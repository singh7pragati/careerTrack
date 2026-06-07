"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Application, ApplicationStatus } from "@/types";
import { APPLICATION_STATUSES } from "@/types";

interface ApplicationFormProps {
  initial?: Application;
  onSubmit: (data: {
    companyName: string;
    role: string;
    location: string;
    applicationDate: string;
    status: ApplicationStatus;
  }) => void;
  onCancel: () => void;
}

export function ApplicationForm({ initial, onSubmit, onCancel }: ApplicationFormProps) {
  const [companyName, setCompanyName] = useState(initial?.companyName ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [applicationDate, setApplicationDate] = useState(
    initial?.applicationDate ?? new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<ApplicationStatus>(
    initial?.status ?? "Applied"
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim()) {
      setError("Company name and role are required.");
      return;
    }
    setError("");
    onSubmit({
      companyName: companyName.trim(),
      role: role.trim(),
      location: location.trim(),
      applicationDate,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. SDE Intern"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Remote"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="applicationDate">Application Date</Label>
          <Input
            id="applicationDate"
            type="date"
            value={applicationDate}
            onChange={(e) => setApplicationDate(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as ApplicationStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {APPLICATION_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initial ? "Update" : "Add"} Application</Button>
      </div>
    </form>
  );
}
