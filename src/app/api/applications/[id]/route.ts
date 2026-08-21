import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  deleteApplication,
  updateApplication,
  validateUpdateInput,
} from "@/lib/applications-service";

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
      return NextResponse.json(
        { error: "Application id is required" },
        { status: 400 }
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

    const validation = validateUpdateInput(body);
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const application = await updateApplication(
      session.userId,
      id,
      validation.data
    );
    if (!application) {
      return NextResponse.json(
        { error: `Application not found: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("PATCH /api/applications/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
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
      return NextResponse.json(
        { error: "Application id is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteApplication(session.userId, id);
    if (!deleted) {
      return NextResponse.json(
        { error: `Application not found: ${id}` },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/applications/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
