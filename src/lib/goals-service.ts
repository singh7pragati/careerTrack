import type { CreateGoalInput } from "@/lib/apiClient";
import connectDB from "@/lib/mongodb";
import Goal from "@/models/Goal";
import { generateId } from "@/lib/utils";
import type { Goal as GoalType, GoalType as GoalCategory } from "@/types";

const IMMUTABLE_FIELDS = new Set(["id", "userId", "createdAt"]);
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_SEED_BATCH = 100;

export function isGoalCategory(value: unknown): value is GoalCategory {
  return value === "short-term" || value === "long-term";
}

function isValidString(value: unknown, maxLength = MAX_TITLE_LENGTH): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

function isOptionalString(value: unknown, maxLength = MAX_DESCRIPTION_LENGTH): boolean {
  if (value === undefined || value === null) return true;
  return typeof value === "string" && value.trim().length <= maxLength;
}

function isValidDateString(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  const timestamp = Date.parse(value.trim());
  return !Number.isNaN(timestamp);
}

export function serializeGoal(doc: {
  id: string;
  title: string;
  description: string;
  type: GoalCategory;
  completed: boolean;
  createdAt: string;
  completedAt?: string | null;
}): GoalType {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description ?? "",
    type: doc.type,
    completed: Boolean(doc.completed),
    createdAt: doc.createdAt,
    completedAt: doc.completedAt || undefined,
  };
}

export function validateCreateGoalInput(
  body: unknown
): { data: CreateGoalInput } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const { title, description, type } = body as Record<string, unknown>;

  if (!isValidString(title)) {
    return {
      error: `title is required and must not exceed ${MAX_TITLE_LENGTH} characters`,
    };
  }
  if (!isOptionalString(description, MAX_DESCRIPTION_LENGTH)) {
    return {
      error: `description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
    };
  }
  if (!isGoalCategory(type)) {
    return { error: "type must be one of: short-term, long-term" };
  }

  return {
    data: {
      title: (title as string).trim(),
      description: typeof description === "string" ? description.trim() : "",
      type,
    },
  };
}

export function validateUpdateGoalInput(
  body: unknown
): { data: Partial<GoalType> } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const input = body as Record<string, unknown>;
  const updates: Partial<GoalType> = {};

  if ("title" in input) {
    if (!isValidString(input.title)) {
      return {
        error: `title must be a non-empty string and not exceed ${MAX_TITLE_LENGTH} characters`,
      };
    }
    updates.title = (input.title as string).trim();
  }

  if ("description" in input) {
    if (!isOptionalString(input.description, MAX_DESCRIPTION_LENGTH)) {
      return {
        error: `description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
      };
    }
    updates.description =
      typeof input.description === "string" ? input.description.trim() : "";
  }

  if ("type" in input) {
    if (!isGoalCategory(input.type)) {
      return { error: "type must be one of: short-term, long-term" };
    }
    updates.type = input.type;
  }

  if ("completed" in input) {
    if (typeof input.completed !== "boolean") {
      return { error: "completed must be a boolean" };
    }
    updates.completed = input.completed;
    if (input.completed) {
      updates.completedAt = new Date().toISOString();
    } else {
      updates.completedAt = undefined;
    }
  }

  if (Object.keys(updates).length === 0) {
    return { error: "At least one updatable field is required" };
  }

  return { data: updates };
}

function validateGoalRecord(
  value: unknown
): { data: GoalType } | { error: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { error: "Each goal must be a JSON object" };
  }

  const record = value as Record<string, unknown>;

  if (typeof record.id !== "string" || !record.id.trim()) {
    return { error: "id is required and must be a non-empty string" };
  }
  if (!isValidString(record.title)) {
    return { error: "title is required and must be a valid string" };
  }
  if (!isOptionalString(record.description, MAX_DESCRIPTION_LENGTH)) {
    return { error: "description must not exceed max length" };
  }
  if (!isGoalCategory(record.type)) {
    return { error: "type must be one of: short-term, long-term" };
  }
  if (typeof record.completed !== "boolean") {
    return { error: "completed must be a boolean" };
  }
  if (!isValidDateString(record.createdAt)) {
    return { error: "createdAt is required and must be a valid date string" };
  }
  if (record.completedAt && !isValidDateString(record.completedAt)) {
    return { error: "completedAt must be a valid date string" };
  }

  return {
    data: {
      id: (record.id as string).trim(),
      title: (record.title as string).trim(),
      description:
        typeof record.description === "string" ? record.description.trim() : "",
      type: record.type,
      completed: record.completed,
      createdAt: (record.createdAt as string).trim(),
      completedAt:
        typeof record.completedAt === "string"
          ? record.completedAt.trim()
          : undefined,
    },
  };
}

export function validateSeedGoalsInput(
  body: unknown
): { data: GoalType[] } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const { goals } = body as Record<string, unknown>;

  if (!Array.isArray(goals)) {
    return { error: "goals must be an array" };
  }

  if (goals.length === 0) {
    return { error: "goals must contain at least one item" };
  }

  if (goals.length > MAX_SEED_BATCH) {
    return { error: `goals batch size cannot exceed ${MAX_SEED_BATCH}` };
  }

  const validated: GoalType[] = [];
  const seenIds = new Set<string>();

  for (const [index, item] of goals.entries()) {
    const result = validateGoalRecord(item);
    if ("error" in result) {
      return { error: `goals[${index}]: ${result.error}` };
    }

    if (seenIds.has(result.data.id)) {
      return { error: `Duplicate goal id in seed payload: ${result.data.id}` };
    }

    seenIds.add(result.data.id);
    validated.push(result.data);
  }

  return { data: validated };
}

export async function getGoals(userId: string): Promise<GoalType[]> {
  await connectDB();
  const documents = await Goal.find({ userId }).sort({ createdAt: -1 }).lean();
  return documents.map((doc) => serializeGoal(doc));
}

export async function createGoal(
  userId: string,
  input: CreateGoalInput
): Promise<GoalType> {
  await connectDB();
  const document = await Goal.create({
    ...input,
    id: generateId(),
    userId,
    completed: false,
    createdAt: new Date().toISOString(),
  });

  return serializeGoal(document.toObject());
}

export async function updateGoal(
  userId: string,
  id: string,
  updates: Partial<GoalType>
): Promise<GoalType | null> {
  await connectDB();

  const sanitizedUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => !IMMUTABLE_FIELDS.has(key))
  );

  let updateQuery: Record<string, unknown>;
  if (sanitizedUpdates.completed === false) {
    const rest = { ...sanitizedUpdates };
    delete rest.completedAt;
    updateQuery = {
      $set: rest,
      $unset: { completedAt: 1 },
    };
  } else {
    updateQuery = { $set: sanitizedUpdates };
  }

  const document = await Goal.findOneAndUpdate(
    { id, userId },
    updateQuery,
    { returnDocument: "after", runValidators: true }
  ).lean();

  if (!document) {
    return null;
  }

  return serializeGoal(document);
}

export async function toggleGoal(
  userId: string,
  id: string
): Promise<GoalType | null> {
  await connectDB();

  const existing = await Goal.findOne({ id, userId }).lean();
  if (!existing) {
    return null;
  }

  const nowCompleted = !existing.completed;
  const updateQuery = nowCompleted
    ? { $set: { completed: true, completedAt: new Date().toISOString() } }
    : { $set: { completed: false }, $unset: { completedAt: 1 } };

  const document = await Goal.findOneAndUpdate(
    { id, userId },
    updateQuery,
    { returnDocument: "after", runValidators: true }
  ).lean();

  if (!document) {
    return null;
  }

  return serializeGoal(document);
}

export async function deleteGoal(
  userId: string,
  id: string
): Promise<boolean> {
  await connectDB();
  const result = await Goal.deleteOne({ id, userId });
  return result.deletedCount === 1;
}

export async function seedGoals(
  userId: string,
  goals: GoalType[]
): Promise<{ seeded: boolean; count: number }> {
  await connectDB();

  const existingCount = await Goal.countDocuments({ userId });
  if (existingCount > 0) {
    return { seeded: false, count: 0 };
  }

  const documentsWithUser = goals.map((goal) => ({
    ...goal,
    userId,
  }));

  await Goal.insertMany(documentsWithUser, { ordered: true });
  return { seeded: true, count: goals.length };
}
