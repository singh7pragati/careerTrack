"use client";

import { useMemo, useState } from "react";
import { Briefcase, Plus, Search } from "lucide-react";
import { ApplicationCard } from "@/components/applications/application-card";
import { ApplicationForm } from "@/components/applications/application-form";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Application, ApplicationStatus } from "@/types";
import { APPLICATION_STATUSES } from "@/types";

export default function ApplicationsPage() {
  const {
    applications,
    isReady,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useCareerContext();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        search === "" ||
        app.companyName.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const handleSubmit = (data: {
    companyName: string;
    role: string;
    location: string;
    applicationDate: string;
    status: ApplicationStatus;
  }) => {
    if (editing) {
      updateApplication(editing.id, data);
    } else {
      addApplication(data);
    }
    setDialogOpen(false);
    setEditing(null);
  };

  const handleEdit = (app: Application) => {
    setEditing(app);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      deleteApplication(id);
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
        title="Applications"
        description="Track and manage your job applications"
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {APPLICATION_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={openAddDialog} className="shrink-0">
          <Plus className="h-4 w-4" />
          Add Application
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications found"
          description={
            applications.length === 0
              ? "Start tracking your job applications by adding your first one."
              : "No applications match your search or filter criteria."
          }
          actionLabel={applications.length === 0 ? "Add Application" : undefined}
          onAction={applications.length === 0 ? openAddDialog : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
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
              {editing ? "Edit Application" : "Add Application"}
            </DialogTitle>
          </DialogHeader>
          <ApplicationForm
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
