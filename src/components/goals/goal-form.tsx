"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GoalType } from "@/types";

interface GoalFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    type: GoalType;
  }) => void;
  onCancel: () => void;
}

export function GoalForm({ onSubmit, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<GoalType>("short-term");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Goal title is required.");
      return;
    }
    setError("");
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="goalTitle">Goal Title *</Label>
        <Input
          id="goalTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Complete 50 LeetCode problems"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="goalDescription">Description</Label>
        <Textarea
          id="goalDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your goal..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Goal Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as GoalType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short-term">Short-term</SelectItem>
            <SelectItem value="long-term">Long-term</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Goal</Button>
      </div>
    </form>
  );
}
