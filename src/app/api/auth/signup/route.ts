import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { registerUser, validateSignupInput } from "@/lib/auth-service";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const rateLimit = checkRateLimit(`signup_${ip}`, 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const validation = validateSignupInput(body);
    if (validation.error || !validation.data) {
      return NextResponse.json(
        { error: validation.error ?? "Invalid input." },
        { status: 400 }
      );
    }

    const result = await registerUser(validation.data);
    if (result.error || !result.user) {
      return NextResponse.json(
        { error: result.error ?? "Registration failed." },
        { status: result.status ?? 400 }
      );
    }

    const token = await createSessionToken({
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
    });

    await setSessionCookie(token);

    return NextResponse.json({ user: result.user }, { status: 201 });
  } catch (error) {
    console.error("POST /api/auth/signup failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
