import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  deleteSkill,
  updateSkill,
  validateUpdateSkillInput,
} from "@/lib/skills-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id.trim()) {
      return NextResponse.json({ error: "Skill id is required" }, { status: 400 });
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

    const validation = validateUpdateSkillInput(body);
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const skill = await updateSkill(session.userId, id, validation.data);
    if (!skill) {
      return NextResponse.json(
        { error: `Skill not found: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error("PATCH /api/skills/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id.trim()) {
      return NextResponse.json({ error: "Skill id is required" }, { status: 400 });
    }

    const deleted = await deleteSkill(session.userId, id);
    if (!deleted) {
      return NextResponse.json(
        { error: `Skill not found: ${id}` },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/skills/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
