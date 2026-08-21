import mongoose, { Model, Schema } from "mongoose";
import { SKILL_LEVELS, type SkillLevel } from "@/types";

export interface SkillDocument {
  id: string;
  userId: string;
  name: string;
  level: SkillLevel;
  progress: number;
  createdAt: string;
}

const skillSchema = new Schema<SkillDocument>({
  id: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  level: {
    type: String,
    required: true,
    enum: SKILL_LEVELS,
    default: "Beginner",
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  createdAt: { type: String, required: true },
});

skillSchema.index({ id: 1, userId: 1 }, { unique: true });
skillSchema.index({ userId: 1, createdAt: -1 });

const Skill: Model<SkillDocument> =
  mongoose.models.Skill ?? mongoose.model<SkillDocument>("Skill", skillSchema);

export default Skill;
