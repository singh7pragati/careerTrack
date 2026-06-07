"use client";

import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import type { Goal } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onToggle, onDelete }: GoalCardProps) {
  return (
    <Card
      className={cn(
        "group hover:shadow-md transition-all duration-200",
        goal.completed && "opacity-70"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onToggle(goal.id)}
            className="mt-0.5 shrink-0 text-primary hover:scale-110 transition-transform"
            aria-label={goal.completed ? "Mark incomplete" : "Mark complete"}
          >
            {goal.completed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={cn(
                  "font-semibold",
                  goal.completed && "line-through text-muted-foreground"
                )}
              >
                {goal.title}
              </h3>
              <Badge variant="outline" className="text-xs">
                {goal.type === "short-term" ? "Short-term" : "Long-term"}
              </Badge>
            </div>
            {goal.description && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {goal.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive transition-opacity shrink-0"
            onClick={() => onDelete(goal.id)}
            aria-label="Delete goal"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
