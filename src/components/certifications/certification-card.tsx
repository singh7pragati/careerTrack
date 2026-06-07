"use client";

import { Award, Calendar, ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Certification } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface CertificationCardProps {
  certification: Certification;
  onEdit: (cert: Certification) => void;
  onDelete: (id: string) => void;
}

export function CertificationCard({
  certification,
  onEdit,
  onDelete,
}: CertificationCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-primary shrink-0" />
              <h3 className="font-semibold truncate">{certification.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{certification.organization}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(certification.dateEarned)}
              </span>
              {certification.certificateLink && (
                <a
                  href={certification.certificateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Certificate
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(certification)}
              aria-label="Edit certification"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(certification.id)}
              aria-label="Delete certification"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
