"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { SkillCard } from "@/components/skills/skill-card";
import { SkillForm } from "@/components/skills/skill-form";
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
import type { Skill, SkillLevel } from "@/types";

export default function SkillsPage() {
  const { skills, isReady, addSkill, updateSkill, deleteSkill } =
    useCareerContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);

  const handleSubmit = async (data: {
    name: string;
    level: SkillLevel;
    progress: number;
  }) => {
    if (editing) {
      await updateSkill(editing.id, data);
    } else {
      await addSkill(data);
    }
    setDialogOpen(false);
    setEditing(null);
  };

  const handleEdit = (skill: Skill) => {
    setEditing(skill);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      await deleteSkill(id);
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
        title="Skills"
        description="Track your technical skills and progress"
      />

      <div className="flex justify-end mb-6">
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No skills tracked yet"
          description="Add your technical skills and monitor your learning progress."
          actionLabel="Add Skill"
          onAction={openAddDialog}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
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
            <DialogTitle>{editing ? "Edit Skill" : "Add Skill"}</DialogTitle>
          </DialogHeader>
          <SkillForm
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
