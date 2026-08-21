import { hashPassword, verifyPassword } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { generateId } from "@/lib/utils";
import Profile from "@/models/Profile";
import User, { type UserDocument } from "@/models/User";

export interface SanitizedUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_LETTER_REGEX = /[a-zA-Z]/;
const PASSWORD_NUMBER_REGEX = /[0-9]/;

export function sanitizeUser(user: UserDocument): SanitizedUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function validateSignupInput(body: unknown): {
  data?: { name: string; email: string; password: string };
  error?: string;
} {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const { name, email, password } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return { error: "Name is required." };
  }

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required." };
  }

  if (!EMAIL_REGEX.test(email.trim()) || email.trim().length > 200) {
    return { error: "Please enter a valid email address." };
  }

  if (typeof password !== "string" || !password) {
    return { error: "Password is required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (!PASSWORD_LETTER_REGEX.test(password)) {
    return { error: "Password must contain at least one letter." };
  }

  if (!PASSWORD_NUMBER_REGEX.test(password)) {
    return { error: "Password must contain at least one number." };
  }

  return {
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    },
  };
}

export function validateLoginInput(body: unknown): {
  data?: { email: string; password: string };
  error?: string;
} {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const { email, password } = body as Record<string, unknown>;

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required." };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return { error: "Please enter a valid email address." };
  }

  if (typeof password !== "string" || !password) {
    return { error: "Password is required." };
  }

  return {
    data: {
      email: email.trim().toLowerCase(),
      password,
    },
  };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user?: SanitizedUser; error?: string; status?: number }> {
  await connectDB();

  const existingUser = await User.findOne({ email: input.email }).lean();
  if (existingUser) {
    return { error: "An account with this email already exists.", status: 409 };
  }

  const passwordHash = await hashPassword(input.password);
  const now = new Date().toISOString();
  const userId = `usr_${generateId()}`;

  const user = await User.create({
    id: userId,
    name: input.name,
    email: input.email,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  // Automatically initialize personal Profile document for the new user
  await Profile.findOneAndUpdate(
    { userId },
    {
      userId,
      name: input.name,
      email: input.email,
      college: "",
      degree: "",
      graduationYear: "",
      updatedAt: now,
    },
    { upsert: true, returnDocument: "after" }
  );

  return { user: sanitizeUser(user.toObject()) };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user?: SanitizedUser; error?: string; status?: number }> {
  await connectDB();

  const user = await User.findOne({ email: input.email }).lean();
  if (!user) {
    return { error: "Invalid email or password.", status: 401 };
  }

  const isValidPassword = await verifyPassword(input.password, user.passwordHash);
  if (!isValidPassword) {
    return { error: "Invalid email or password.", status: 401 };
  }

  return { user: sanitizeUser(user) };
}

export async function getCurrentUser(
  userId: string
): Promise<SanitizedUser | null> {
  await connectDB();
  const user = await User.findOne({ id: userId }).lean();
  if (!user) {
    return null;
  }
  return sanitizeUser(user);
}
