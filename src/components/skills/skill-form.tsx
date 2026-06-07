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
import type { Skill, SkillLevel } from "@/types";
import { SKILL_LEVELS } from "@/types";

interface SkillFormProps {
  initial?: Skill;
  onSubmit: (data: { name: string; level: SkillLevel; progress: number }) => void;
  onCancel: () => void;
}

export function SkillForm({ initial, onSubmit, onCancel }: SkillFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [level, setLevel] = useState<SkillLevel>(initial?.level ?? "Beginner");
  const [progress, setProgress] = useState(initial?.progress ?? 0);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Skill name is required.");
      return;
    }
    setError("");
    onSubmit({ name: name.trim(), level, progress });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="skillName">Skill Name *</Label>
        <Input
          id="skillName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. React"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Level</Label>
          <Select value={level} onValueChange={(v) => setLevel(v as SkillLevel)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SKILL_LEVELS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="progress">Progress ({progress}%)</Label>
          <Input
            id="progress"
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initial ? "Update" : "Add"} Skill</Button>
      </div>
    </form>
  );
}
