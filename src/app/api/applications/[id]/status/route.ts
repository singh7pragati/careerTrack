import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  isApplicationStatus,
  updateApplicationStatus,
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

    const { status } = (body ?? {}) as { status?: unknown };

    if (!isApplicationStatus(status)) {
      return NextResponse.json(
        { error: "Valid application status is required" },
        { status: 400 }
      );
    }

    const application = await updateApplicationStatus(
      session.userId,
      id,
      status
    );
    if (!application) {
      return NextResponse.json(
        { error: `Application not found: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("PATCH /api/applications/[id]/status failed:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}
