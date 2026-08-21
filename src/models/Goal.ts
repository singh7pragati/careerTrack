import mongoose, { Model, Schema } from "mongoose";
import type { GoalType } from "@/types";

export interface GoalDocument {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: GoalType;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

const goalSchema = new Schema<GoalDocument>({
  id: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  type: {
    type: String,
    required: true,
    enum: ["short-term", "long-term"],
  },
  completed: { type: Boolean, required: true, default: false },
  createdAt: { type: String, required: true },
  completedAt: { type: String, default: undefined },
});

goalSchema.index({ id: 1, userId: 1 }, { unique: true });
goalSchema.index({ userId: 1, createdAt: -1 });

const Goal: Model<GoalDocument> =
  mongoose.models.Goal ?? mongoose.model<GoalDocument>("Goal", goalSchema);

export default Goal;
