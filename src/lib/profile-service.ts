import connectDB from "@/lib/mongodb";
import ProfileModel from "@/models/Profile";
import type { Profile as ProfileType } from "@/types";

const MAX_STRING_LENGTH = 200;
const MAX_YEAR_LENGTH = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_STRING_LENGTH && EMAIL_REGEX.test(trimmed);
}

export function serializeProfile(doc: {
  name: string;
  email: string;
  college?: string;
  degree?: string;
  graduationYear?: string;
}): ProfileType {
  return {
    name: doc.name,
    email: doc.email,
    college: doc.college ?? "",
    degree: doc.degree ?? "",
    graduationYear: doc.graduationYear ?? "",
  };
}

export function validateProfileInput(
  body: unknown
): { data: ProfileType } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const { name, email, college, degree, graduationYear } =
    body as Record<string, unknown>;

  if (!isValidString(name)) {
    return {
      error: `name is required and must not exceed ${MAX_STRING_LENGTH} characters`,
    };
  }
  if (!isValidEmail(email)) {
    return {
      error: "email is required and must be a valid email address",
    };
  }
  if (!isOptionalString(college)) {
    return {
      error: `college must not exceed ${MAX_STRING_LENGTH} characters`,
    };
  }
  if (!isOptionalString(degree)) {
    return {
      error: `degree must not exceed ${MAX_STRING_LENGTH} characters`,
    };
  }
  if (!isOptionalString(graduationYear, MAX_YEAR_LENGTH)) {
    return {
      error: `graduationYear must not exceed ${MAX_YEAR_LENGTH} characters`,
    };
  }

  return {
    data: {
      name: (name as string).trim(),
      email: (email as string).trim().toLowerCase(),
      college: typeof college === "string" ? college.trim() : "",
      degree: typeof degree === "string" ? degree.trim() : "",
      graduationYear:
        typeof graduationYear === "string" ? graduationYear.trim() : "",
    },
  };
}

export async function getProfile(userId: string): Promise<ProfileType | null> {
  await connectDB();
  const document = await ProfileModel.findOne({ userId }).lean();
  if (!document) {
    return null;
  }
  return serializeProfile(document);
}

export async function saveProfile(
  userId: string,
  profile: ProfileType
): Promise<ProfileType> {
  await connectDB();
  const now = new Date().toISOString();

  const document = await ProfileModel.findOneAndUpdate(
    { userId },
    {
      ...profile,
      userId,
      updatedAt: now,
    },
    { upsert: true, returnDocument: "after", runValidators: true }
  ).lean();

  return serializeProfile(document);
}

export async function seedProfile(
  userId: string,
  profile: ProfileType
): Promise<{ seeded: boolean }> {
  await connectDB();
  const existing = await ProfileModel.findOne({ userId }).lean();
  if (existing) {
    return { seeded: false };
  }

  await saveProfile(userId, profile);
  return { seeded: true };
}
