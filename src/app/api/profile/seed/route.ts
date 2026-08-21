import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  seedProfile,
  validateProfileInput,
} from "@/lib/profile-service";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const { profile } = (body && typeof body === "object" && "profile" in body
      ? body
      : { profile: body }) as { profile: unknown };

    const validation = validateProfileInput(profile);
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await seedProfile(session.userId, validation.data);

    if (!result.seeded) {
      return NextResponse.json({
        seeded: false,
        message: "Profile already exists; seed skipped",
      });
    }

    return NextResponse.json(
      {
        seeded: true,
        message: "Profile seeded successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/profile/seed failed:", error);
    return NextResponse.json(
      { error: "Failed to seed profile" },
      { status: 500 }
    );
  }
}
