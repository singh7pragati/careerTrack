import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  seedGoals,
  validateSeedGoalsInput,
} from "@/lib/goals-service";

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

    const validation = validateSeedGoalsInput(body);
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await seedGoals(session.userId, validation.data);

    if (!result.seeded) {
      return NextResponse.json({
        seeded: false,
        count: 0,
        message: "Goals already exist; seed skipped",
      });
    }

    return NextResponse.json(
      {
        seeded: true,
        count: result.count,
        message: "Goals seeded successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/goals/seed failed:", error);
    return NextResponse.json(
      { error: "Failed to seed goals" },
      { status: 500 }
    );
  }
}
