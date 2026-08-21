"use client";

import { useState } from "react";
import { Goal as GoalIcon, Plus } from "lucide-react";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalForm } from "@/components/goals/goal-form";
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
import type { GoalType } from "@/types";

export default function GoalsPage() {
  const { goals, isReady, addGoal, toggleGoal, deleteGoal } =
    useCareerContext();

  const [dialogOpen, setDialogOpen] = useState(false);

  const shortTermGoals = goals.filter((g) => g.type === "short-term");
  const longTermGoals = goals.filter((g) => g.type === "long-term");

  const handleSubmit = async (data: {
    title: string;
    description: string;
    type: GoalType;
  }) => {
    await addGoal(data);
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      await deleteGoal(id);
    }
  };

  if (!isReady) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <DashboardHeader
        title="Goals"
        description="Set and track your career milestones"
      />

      <div className="flex justify-end mb-6">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon={GoalIcon}
          title="No goals set yet"
          description="Define your short-term and long-term career goals to stay focused."
          actionLabel="Add Goal"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Short-term Goals
              <span className="text-sm font-normal text-muted-foreground">
                ({shortTermGoals.filter((g) => !g.completed).length} active)
              </span>
            </h2>
            {shortTermGoals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No short-term goals yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shortTermGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onToggle={toggleGoal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-foreground" />
              Long-term Goals
              <span className="text-sm font-normal text-muted-foreground">
                ({longTermGoals.filter((g) => !g.completed).length} active)
              </span>
            </h2>
            {longTermGoals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No long-term goals yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {longTermGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onToggle={toggleGoal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Goal</DialogTitle>
          </DialogHeader>
          <GoalForm
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
