"use client";

import { useState } from "react";
import { Award, Plus } from "lucide-react";
import { CertificationCard } from "@/components/certifications/certification-card";
import { CertificationForm } from "@/components/certifications/certification-form";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useCareerContext } from "@/components/providers/career-data-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Certification } from "@/types";

export default function CertificationsPage() {
  const {
    certifications,
    isReady,
    addCertification,
    updateCertification,
    deleteCertification,
  } = useCareerContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);

  const handleSubmit = async (data: {
    name: string;
    organization: string;
    dateEarned: string;
    certificateLink: string;
  }) => {
    if (editing) {
      await updateCertification(editing.id, data);
    } else {
      await addCertification(data);
    }
    setDialogOpen(false);
    setEditing(null);
  };

  const handleEdit = (cert: Certification) => {
    setEditing(cert);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      await deleteCertification(id);
    }
  };

  const openAddDialog = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  if (!isReady) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <DashboardHeader
        title="Certifications"
        description="Manage your professional certifications"
      />

      <div className="flex justify-end mb-6">
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certifications yet"
          description="Add your certifications to showcase your achievements."
          actionLabel="Add Certification"
          onAction={openAddDialog}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Certification" : "Add Certification"}
            </DialogTitle>
          </DialogHeader>
          <CertificationForm
            initial={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setDialogOpen(false);
              setEditing(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
