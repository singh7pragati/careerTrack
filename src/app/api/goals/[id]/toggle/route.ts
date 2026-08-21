import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { toggleGoal } from "@/lib/goals-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id.trim()) {
      return NextResponse.json({ error: "Goal id is required" }, { status: 400 });
    }

    const goal = await toggleGoal(session.userId, id);
    if (!goal) {
      return NextResponse.json(
        { error: `Goal not found: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error("PATCH /api/goals/[id]/toggle failed:", error);
    return NextResponse.json(
      { error: "Failed to toggle goal" },
      { status: 500 }
    );
  }
}
