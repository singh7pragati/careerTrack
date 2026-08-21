import type { CreateApplicationInput } from "@/lib/apiClient";
import connectDB from "@/lib/mongodb";
import Application from "@/models/Application";
import { generateId } from "@/lib/utils";
import {
  APPLICATION_STATUSES,
  type Application as ApplicationType,
  type ApplicationStatus,
} from "@/types";

const IMMUTABLE_FIELDS = new Set(["id", "userId", "createdAt", "updatedAt"]);
const MAX_STRING_LENGTH = 200;
const MAX_SEED_BATCH = 100;

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return (
    typeof value === "string" &&
    APPLICATION_STATUSES.includes(value as ApplicationStatus)
  );
}

function isValidString(value: unknown, maxLength = MAX_STRING_LENGTH): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

function isOptionalString(value: unknown, maxLength = MAX_STRING_LENGTH): boolean {
  if (value === undefined || value === null) return true;
  return typeof value === "string" && value.trim().length <= maxLength;
}

function isValidDateString(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  const timestamp = Date.parse(value.trim());
  return !Number.isNaN(timestamp);
}

export function serializeApplication(doc: {
  id: string;
  companyName: string;
  role: string;
  status: ApplicationStatus;
  applicationDate: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}): ApplicationType {
  return {
    id: doc.id,
    companyName: doc.companyName,
    role: doc.role,
    status: doc.status,
    applicationDate: doc.applicationDate,
    location: doc.location ?? "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function validateCreateInput(
  body: unknown
): { data: CreateApplicationInput } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const { companyName, role, status, applicationDate, location } =
    body as Record<string, unknown>;

  if (!isValidString(companyName)) {
    return {
      error: `companyName is required and must not exceed ${MAX_STRING_LENGTH} characters`,
    };
  }
  if (!isValidString(role)) {
    return {
      error: `role is required and must not exceed ${MAX_STRING_LENGTH} characters`,
    };
  }
  if (!isApplicationStatus(status)) {
    return {
      error: `status must be one of: ${APPLICATION_STATUSES.join(", ")}`,
    };
  }
  if (!isValidDateString(applicationDate)) {
    return {
      error: "applicationDate is required and must be a valid date string",
    };
  }
  if (!isOptionalString(location, MAX_STRING_LENGTH)) {
    return {
      error: `location must not exceed ${MAX_STRING_LENGTH} characters`,
    };
  }

  return {
    data: {
      companyName: (companyName as string).trim(),
      role: (role as string).trim(),
      status,
      applicationDate: (applicationDate as string).trim(),
      location: typeof location === "string" ? location.trim() : "",
    },
  };
}

export function validateUpdateInput(
  body: unknown
): { data: Partial<ApplicationType> } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const input = body as Record<string, unknown>;
  const updates: Partial<ApplicationType> = {};

  if ("companyName" in input) {
    if (!isValidString(input.companyName)) {
      return {
        error: `companyName must be a non-empty string and not exceed ${MAX_STRING_LENGTH} characters`,
      };
    }
    updates.companyName = (input.companyName as string).trim();
  }

  if ("role" in input) {
    if (!isValidString(input.role)) {
      return {
        error: `role must be a non-empty string and not exceed ${MAX_STRING_LENGTH} characters`,
      };
    }
    updates.role = (input.role as string).trim();
  }

  if ("status" in input) {
    if (!isApplicationStatus(input.status)) {
      return {
        error: `status must be one of: ${APPLICATION_STATUSES.join(", ")}`,
      };
    }
    updates.status = input.status;
  }

  if ("applicationDate" in input) {
    if (!isValidDateString(input.applicationDate)) {
      return { error: "applicationDate must be a valid date string" };
    }
    updates.applicationDate = (input.applicationDate as string).trim();
  }

  if ("location" in input) {
    if (!isOptionalString(input.location, MAX_STRING_LENGTH)) {
      return {
        error: `location must not exceed ${MAX_STRING_LENGTH} characters`,
      };
    }
    updates.location =
      typeof input.location === "string" ? input.location.trim() : "";
  }

  if (Object.keys(updates).length === 0) {
    return { error: "At least one updatable field is required" };
  }

  return { data: updates };
}

function validateApplicationRecord(
  value: unknown
): { data: ApplicationType } | { error: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { error: "Each application must be a JSON object" };
  }

  const record = value as Record<string, unknown>;

  if (typeof record.id !== "string" || !record.id.trim()) {
    return { error: "id is required and must be a non-empty string" };
  }
  if (!isValidString(record.companyName)) {
    return { error: "companyName is required and must be a valid string" };
  }
  if (!isValidString(record.role)) {
    return { error: "role is required and must be a valid string" };
  }
  if (!isApplicationStatus(record.status)) {
    return { error: "status must be a valid application status" };
  }
  if (!isValidDateString(record.applicationDate)) {
    return {
      error: "applicationDate is required and must be a valid date string",
    };
  }
  if (!isOptionalString(record.location, MAX_STRING_LENGTH)) {
    return { error: "location must not exceed max length" };
  }
  if (!isValidDateString(record.createdAt)) {
    return { error: "createdAt is required and must be a valid date string" };
  }
  if (!isValidDateString(record.updatedAt)) {
    return { error: "updatedAt is required and must be a valid date string" };
  }

  return {
    data: {
      id: (record.id as string).trim(),
      companyName: (record.companyName as string).trim(),
      role: (record.role as string).trim(),
      status: record.status,
      applicationDate: (record.applicationDate as string).trim(),
      location:
        typeof record.location === "string" ? record.location.trim() : "",
      createdAt: (record.createdAt as string).trim(),
      updatedAt: (record.updatedAt as string).trim(),
    },
  };
}

export function validateSeedInput(
  body: unknown
): { data: ApplicationType[] } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const { applications } = body as Record<string, unknown>;

  if (!Array.isArray(applications)) {
    return { error: "applications must be an array" };
  }

  if (applications.length === 0) {
    return { error: "applications must contain at least one item" };
  }

  if (applications.length > MAX_SEED_BATCH) {
    return { error: `applications batch size cannot exceed ${MAX_SEED_BATCH}` };
  }

  const validated: ApplicationType[] = [];
  const seenIds = new Set<string>();

  for (const [index, item] of applications.entries()) {
    const result = validateApplicationRecord(item);
    if ("error" in result) {
      return { error: `applications[${index}]: ${result.error}` };
    }

    if (seenIds.has(result.data.id)) {
      return {
        error: `Duplicate application id in seed payload: ${result.data.id}`,
      };
    }

    seenIds.add(result.data.id);
    validated.push(result.data);
  }

  return { data: validated };
}

export async function getApplications(
  userId: string
): Promise<ApplicationType[]> {
  await connectDB();
  const documents = await Application.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
  return documents.map((doc) => serializeApplication(doc));
}

export async function createApplication(
  userId: string,
  input: CreateApplicationInput
): Promise<ApplicationType> {
  await connectDB();
  const now = new Date().toISOString();
  const document = await Application.create({
    ...input,
    id: generateId(),
    userId,
    createdAt: now,
    updatedAt: now,
  });

  return serializeApplication(document.toObject());
}

export async function updateApplication(
  userId: string,
  id: string,
  updates: Partial<ApplicationType>
): Promise<ApplicationType | null> {
  await connectDB();

  const sanitizedUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => !IMMUTABLE_FIELDS.has(key))
  );

  const document = await Application.findOneAndUpdate(
    { id, userId },
    {
      ...sanitizedUpdates,
      updatedAt: new Date().toISOString(),
    },
    { returnDocument: "after", runValidators: true }
  ).lean();

  if (!document) {
    return null;
  }

  return serializeApplication(document);
}

export async function updateApplicationStatus(
  userId: string,
  id: string,
  status: ApplicationStatus
): Promise<ApplicationType | null> {
  await connectDB();

  const document = await Application.findOneAndUpdate(
    { id, userId },
    {
      status,
      updatedAt: new Date().toISOString(),
    },
    { returnDocument: "after", runValidators: true }
  ).lean();

  if (!document) {
    return null;
  }

  return serializeApplication(document);
}

export async function deleteApplication(
  userId: string,
  id: string
): Promise<boolean> {
  await connectDB();
  const result = await Application.deleteOne({ id, userId });
  return result.deletedCount === 1;
}

export async function seedApplications(
  userId: string,
  applications: ApplicationType[]
): Promise<{ seeded: boolean; count: number }> {
  await connectDB();

  const existingCount = await Application.countDocuments({ userId });
  if (existingCount > 0) {
    return { seeded: false, count: 0 };
  }

  const documentsWithUser = applications.map((app) => ({
    ...app,
    userId,
  }));

  await Application.insertMany(documentsWithUser, { ordered: true });
  return { seeded: true, count: applications.length };
}
