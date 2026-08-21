import type { CreateCertificationInput } from "@/lib/apiClient";
import connectDB from "@/lib/mongodb";
import Certification from "@/models/Certification";
import { generateId } from "@/lib/utils";
import type { Certification as CertificationType } from "@/types";

const IMMUTABLE_FIELDS = new Set(["id", "userId", "createdAt"]);
const MAX_STRING_LENGTH = 200;
const MAX_URL_LENGTH = 1000;
const MAX_SEED_BATCH = 100;

function isValidString(value: unknown, maxLength = MAX_STRING_LENGTH): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

function isOptionalString(value: unknown, maxLength = MAX_URL_LENGTH): boolean {
  if (value === undefined || value === null) return true;
  return typeof value === "string" && value.trim().length <= maxLength;
}

function isValidDateString(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  const timestamp = Date.parse(value.trim());
  return !Number.isNaN(timestamp);
}

export function serializeCertification(doc: {
  id: string;
  name: string;
  organization: string;
  dateEarned: string;
  certificateLink?: string;
  createdAt: string;
}): CertificationType {
  return {
    id: doc.id,
    name: doc.name,
    organization: doc.organization,
    dateEarned: doc.dateEarned,
    certificateLink: doc.certificateLink ?? "",
    createdAt: doc.createdAt,
  };
}

export function validateCreateCertificationInput(
  body: unknown
): { data: CreateCertificationInput } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const { name, organization, dateEarned, certificateLink } =
    body as Record<string, unknown>;

  if (!isValidString(name)) {
    return {
      error: `name is required and must not exceed ${MAX_STRING_LENGTH} characters`,
    };
  }
  if (!isValidString(organization)) {
    return {
      error: `organization is required and must not exceed ${MAX_STRING_LENGTH} characters`,
    };
  }
  if (!isValidDateString(dateEarned)) {
    return {
      error: "dateEarned is required and must be a valid date string",
    };
  }
  if (!isOptionalString(certificateLink, MAX_URL_LENGTH)) {
    return {
      error: `certificateLink must not exceed ${MAX_URL_LENGTH} characters`,
    };
  }

  return {
    data: {
      name: (name as string).trim(),
      organization: (organization as string).trim(),
      dateEarned: (dateEarned as string).trim(),
      certificateLink:
        typeof certificateLink === "string" ? certificateLink.trim() : "",
    },
  };
}

export function validateUpdateCertificationInput(
  body: unknown
): { data: Partial<CertificationType> } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const input = body as Record<string, unknown>;
  const updates: Partial<CertificationType> = {};

  if ("name" in input) {
    if (!isValidString(input.name)) {
      return {
        error: `name must be a non-empty string and not exceed ${MAX_STRING_LENGTH} characters`,
      };
    }
    updates.name = (input.name as string).trim();
  }

  if ("organization" in input) {
    if (!isValidString(input.organization)) {
      return {
        error: `organization must be a non-empty string and not exceed ${MAX_STRING_LENGTH} characters`,
      };
    }
    updates.organization = (input.organization as string).trim();
  }

  if ("dateEarned" in input) {
    if (!isValidDateString(input.dateEarned)) {
      return { error: "dateEarned must be a valid date string" };
    }
    updates.dateEarned = (input.dateEarned as string).trim();
  }

  if ("certificateLink" in input) {
    if (!isOptionalString(input.certificateLink, MAX_URL_LENGTH)) {
      return {
        error: `certificateLink must not exceed ${MAX_URL_LENGTH} characters`,
      };
    }
    updates.certificateLink =
      typeof input.certificateLink === "string"
        ? input.certificateLink.trim()
        : "";
  }

  if (Object.keys(updates).length === 0) {
    return { error: "At least one updatable field is required" };
  }

  return { data: updates };
}

function validateCertificationRecord(
  value: unknown
): { data: CertificationType } | { error: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { error: "Each certification must be a JSON object" };
  }

  const record = value as Record<string, unknown>;

  if (typeof record.id !== "string" || !record.id.trim()) {
    return { error: "id is required and must be a non-empty string" };
  }
  if (!isValidString(record.name)) {
    return { error: "name is required and must be a valid string" };
  }
  if (!isValidString(record.organization)) {
    return { error: "organization is required and must be a valid string" };
  }
  if (!isValidDateString(record.dateEarned)) {
    return { error: "dateEarned is required and must be a valid date string" };
  }
  if (!isOptionalString(record.certificateLink, MAX_URL_LENGTH)) {
    return { error: "certificateLink must not exceed max length" };
  }
  if (!isValidDateString(record.createdAt)) {
    return { error: "createdAt is required and must be a valid date string" };
  }

  return {
    data: {
      id: (record.id as string).trim(),
      name: (record.name as string).trim(),
      organization: (record.organization as string).trim(),
      dateEarned: (record.dateEarned as string).trim(),
      certificateLink:
        typeof record.certificateLink === "string"
          ? record.certificateLink.trim()
          : "",
      createdAt: (record.createdAt as string).trim(),
    },
  };
}

export function validateSeedCertificationsInput(
  body: unknown
): { data: CertificationType[] } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const { certifications } = body as Record<string, unknown>;

  if (!Array.isArray(certifications)) {
    return { error: "certifications must be an array" };
  }

  if (certifications.length === 0) {
    return { error: "certifications must contain at least one item" };
  }

  if (certifications.length > MAX_SEED_BATCH) {
    return {
      error: `certifications batch size cannot exceed ${MAX_SEED_BATCH}`,
    };
  }

  const validated: CertificationType[] = [];
  const seenIds = new Set<string>();

  for (const [index, item] of certifications.entries()) {
    const result = validateCertificationRecord(item);
    if ("error" in result) {
      return { error: `certifications[${index}]: ${result.error}` };
    }

    if (seenIds.has(result.data.id)) {
      return {
        error: `Duplicate certification id in seed payload: ${result.data.id}`,
      };
    }

    seenIds.add(result.data.id);
    validated.push(result.data);
  }

  return { data: validated };
}

export async function getCertifications(
  userId: string
): Promise<CertificationType[]> {
  await connectDB();
  const documents = await Certification.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
  return documents.map((doc) => serializeCertification(doc));
}

export async function createCertification(
  userId: string,
  input: CreateCertificationInput
): Promise<CertificationType> {
  await connectDB();
  const document = await Certification.create({
    ...input,
    id: generateId(),
    userId,
    createdAt: new Date().toISOString(),
  });

  return serializeCertification(document.toObject());
}

export async function updateCertification(
  userId: string,
  id: string,
  updates: Partial<CertificationType>
): Promise<CertificationType | null> {
  await connectDB();

  const sanitizedUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => !IMMUTABLE_FIELDS.has(key))
  );

  const document = await Certification.findOneAndUpdate(
    { id, userId },
    sanitizedUpdates,
    { returnDocument: "after", runValidators: true }
  ).lean();

  if (!document) {
    return null;
  }

  return serializeCertification(document);
}

export async function deleteCertification(
  userId: string,
  id: string
): Promise<boolean> {
  await connectDB();
  const result = await Certification.deleteOne({ id, userId });
  return result.deletedCount === 1;
}

export async function seedCertifications(
  userId: string,
  certifications: CertificationType[]
): Promise<{ seeded: boolean; count: number }> {
  await connectDB();

  const existingCount = await Certification.countDocuments({ userId });
  if (existingCount > 0) {
    return { seeded: false, count: 0 };
  }

  const documentsWithUser = certifications.map((c) => ({
    ...c,
    userId,
  }));

  await Certification.insertMany(documentsWithUser, { ordered: true });
  return { seeded: true, count: certifications.length };
}
