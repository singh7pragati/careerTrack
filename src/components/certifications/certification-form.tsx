"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Certification } from "@/types";

interface CertificationFormProps {
  initial?: Certification;
  onSubmit: (data: {
    name: string;
    organization: string;
    dateEarned: string;
    certificateLink: string;
  }) => void;
  onCancel: () => void;
}

export function CertificationForm({
  initial,
  onSubmit,
  onCancel,
}: CertificationFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [organization, setOrganization] = useState(initial?.organization ?? "");
  const [dateEarned, setDateEarned] = useState(
    initial?.dateEarned ?? new Date().toISOString().split("T")[0]
  );
  const [certificateLink, setCertificateLink] = useState(
    initial?.certificateLink ?? ""
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !organization.trim()) {
      setError("Certification name and organization are required.");
      return;
    }
    setError("");
    onSubmit({
      name: name.trim(),
      organization: organization.trim(),
      dateEarned,
      certificateLink: certificateLink.trim(),
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
          <Label htmlFor="certName">Certification Name *</Label>
          <Input
            id="certName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. AWS Cloud Practitioner"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organization">Issuing Organization *</Label>
          <Input
            id="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="e.g. Amazon Web Services"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateEarned">Date Earned</Label>
          <Input
            id="dateEarned"
            type="date"
            value={dateEarned}
            onChange={(e) => setDateEarned(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="certificateLink">Certificate Link</Label>
          <Input
            id="certificateLink"
            type="url"
            value={certificateLink}
            onChange={(e) => setCertificateLink(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initial ? "Update" : "Add"} Certification</Button>
      </div>
    </form>
  );
}
