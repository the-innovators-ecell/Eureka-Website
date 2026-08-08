import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Require an authenticated user. Returns the session or a 401 response.
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id && !session?.user?.email) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  if (session.user.isBlacklisted) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Your account has been suspended" },
        { status: 403 }
      ),
    };
  }

  return { session, error: null };
}

/**
 * Require an authenticated admin. Returns the session or a 401/403 response.
 */
export async function requireAdmin() {
  const result = await requireAuth();

  if (result.error) {
    return result;
  }

  const userEmail = result.session!.user.email?.toLowerCase();
  const isEmailAdmin =
    userEmail === "swapnilaryajua@gmail.com" ||
    userEmail === "namanpriyasharmajua@gmail.com";

  if (!isEmailAdmin && result.session!.user.role !== "ADMIN") {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return result;
}
