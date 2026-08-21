import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth-service";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getCurrentUser(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET /api/auth/me failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch current user session" },
      { status: 500 }
    );
  }
}
