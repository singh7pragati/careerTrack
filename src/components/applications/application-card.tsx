"use client";

import { Building2, Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import type { Application } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusColor } from "@/lib/stats";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  application: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-primary shrink-0" />
              <h3 className="font-semibold truncate">{application.companyName}</h3>
            </div>
            <p className="text-sm text-muted-foreground truncate">{application.role}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
              {application.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {application.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(application.applicationDate)}
              </span>
            </div>
            <span
              className={cn(
                "inline-block mt-3 rounded-full px-2.5 py-0.5 text-xs font-medium",
                getStatusColor(application.status)
              )}
            >
              {application.status}
            </span>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(application)}
              aria-label="Edit application"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(application.id)}
              aria-label="Delete application"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
