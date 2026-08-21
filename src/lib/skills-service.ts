import type { CreateSkillInput } from "@/lib/apiClient";
import connectDB from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { generateId } from "@/lib/utils";
import {
  SKILL_LEVELS,
  type Skill as SkillType,
  type SkillLevel,
} from "@/types";

const IMMUTABLE_FIELDS = new Set(["id", "userId", "createdAt"]);
const MAX_STRING_LENGTH = 100;
const MAX_SEED_BATCH = 100;

export function isSkillLevel(value: unknown): value is SkillLevel {
  return typeof value === "string" && SKILL_LEVELS.includes(value as SkillLevel);
}

function isValidString(value: unknown, maxLength = MAX_STRING_LENGTH): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

function isValidProgress(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && value >= 0 && value <= 100;
}

function isValidDateString(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  const timestamp = Date.parse(value.trim());
  return !Number.isNaN(timestamp);
}

export function serializeSkill(doc: {
  id: string;
  name: string;
  level: SkillLevel;
  progress: number;
  createdAt: string;
}): SkillType {
  return {
    id: doc.id,
    name: doc.name,
    level: doc.level,
    progress: doc.progress,
    createdAt: doc.createdAt,
  };
}

export function validateCreateSkillInput(
  body: unknown
): { data: CreateSkillInput } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const { name, level, progress } = body as Record<string, unknown>;

  if (!isValidString(name)) {
    return {
      error: `name is required and must not exceed ${MAX_STRING_LENGTH} characters`,
    };
  }
  if (!isSkillLevel(level)) {
    return {
      error: `level must be one of: ${SKILL_LEVELS.join(", ")}`,
    };
  }
  if (!isValidProgress(progress)) {
    return {
      error: "progress is required and must be a number between 0 and 100",
    };
  }

  return {
    data: {
      name: (name as string).trim(),
      level,
      progress,
    },
  };
}

export function validateUpdateSkillInput(
  body: unknown
): { data: Partial<SkillType> } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const input = body as Record<string, unknown>;
  const updates: Partial<SkillType> = {};

  if ("name" in input) {
    if (!isValidString(input.name)) {
      return {
        error: `name must be a non-empty string and not exceed ${MAX_STRING_LENGTH} characters`,
      };
    }
    updates.name = (input.name as string).trim();
  }

  if ("level" in input) {
    if (!isSkillLevel(input.level)) {
      return {
        error: `level must be one of: ${SKILL_LEVELS.join(", ")}`,
      };
    }
    updates.level = input.level;
  }

  if ("progress" in input) {
    if (!isValidProgress(input.progress)) {
      return {
        error: "progress must be a number between 0 and 100",
      };
    }
    updates.progress = input.progress;
  }

  if (Object.keys(updates).length === 0) {
    return { error: "At least one updatable field is required" };
  }

  return { data: updates };
}

function validateSkillRecord(
  value: unknown
): { data: SkillType } | { error: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { error: "Each skill must be a JSON object" };
  }

  const record = value as Record<string, unknown>;

  if (typeof record.id !== "string" || !record.id.trim()) {
    return { error: "id is required and must be a non-empty string" };
  }
  if (!isValidString(record.name)) {
    return { error: "name is required and must be a valid string" };
  }
  if (!isSkillLevel(record.level)) {
    return { error: "level must be a valid skill level" };
  }
  if (!isValidProgress(record.progress)) {
    return { error: "progress must be a number between 0 and 100" };
  }
  if (!isValidDateString(record.createdAt)) {
    return { error: "createdAt is required and must be a valid date string" };
  }

  return {
    data: {
      id: (record.id as string).trim(),
      name: (record.name as string).trim(),
      level: record.level,
      progress: record.progress,
      createdAt: (record.createdAt as string).trim(),
    },
  };
}

export function validateSeedSkillsInput(
  body: unknown
): { data: SkillType[] } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const { skills } = body as Record<string, unknown>;

  if (!Array.isArray(skills)) {
    return { error: "skills must be an array" };
  }

  if (skills.length === 0) {
    return { error: "skills must contain at least one item" };
  }

  if (skills.length > MAX_SEED_BATCH) {
    return { error: `skills batch size cannot exceed ${MAX_SEED_BATCH}` };
  }

  const validated: SkillType[] = [];
  const seenIds = new Set<string>();

  for (const [index, item] of skills.entries()) {
    const result = validateSkillRecord(item);
    if ("error" in result) {
      return { error: `skills[${index}]: ${result.error}` };
    }

    if (seenIds.has(result.data.id)) {
      return { error: `Duplicate skill id in seed payload: ${result.data.id}` };
    }

    seenIds.add(result.data.id);
    validated.push(result.data);
  }

  return { data: validated };
}

export async function getSkills(userId: string): Promise<SkillType[]> {
  await connectDB();
  const documents = await Skill.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
  return documents.map((doc) => serializeSkill(doc));
}

export async function createSkill(
  userId: string,
  input: CreateSkillInput
): Promise<SkillType> {
  await connectDB();
  const document = await Skill.create({
    ...input,
    id: generateId(),
    userId,
    createdAt: new Date().toISOString(),
  });

  return serializeSkill(document.toObject());
}

export async function updateSkill(
  userId: string,
  id: string,
  updates: Partial<SkillType>
): Promise<SkillType | null> {
  await connectDB();

  const sanitizedUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => !IMMUTABLE_FIELDS.has(key))
  );

  const document = await Skill.findOneAndUpdate(
    { id, userId },
    sanitizedUpdates,
    { returnDocument: "after", runValidators: true }
  ).lean();

  if (!document) {
    return null;
  }

  return serializeSkill(document);
}

export async function deleteSkill(
  userId: string,
  id: string
): Promise<boolean> {
  await connectDB();
  const result = await Skill.deleteOne({ id, userId });
  return result.deletedCount === 1;
}

export async function seedSkills(
  userId: string,
  skills: SkillType[]
): Promise<{ seeded: boolean; count: number }> {
  await connectDB();

  const existingCount = await Skill.countDocuments({ userId });
  if (existingCount > 0) {
    return { seeded: false, count: 0 };
  }

  const documentsWithUser = skills.map((skill) => ({
    ...skill,
    userId,
  }));

  await Skill.insertMany(documentsWithUser, { ordered: true });
  return { seeded: true, count: skills.length };
}
