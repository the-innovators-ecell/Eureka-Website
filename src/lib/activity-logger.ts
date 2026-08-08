import prisma from "@/lib/prisma";

// ─── Action Constants ────────────────────────────────────

export const Actions = {
  USER_REGISTERED: "USER_REGISTERED",
  USER_LOGGED_IN: "USER_LOGGED_IN",
  USER_PROFILE_UPDATED: "USER_PROFILE_UPDATED",
  USER_PASSWORD_CHANGED: "USER_PASSWORD_CHANGED",
  TEAM_CREATED: "TEAM_CREATED",
  TEAM_JOINED: "TEAM_JOINED",
  TEAM_LEFT: "TEAM_LEFT",
  TEAM_DELETED: "TEAM_DELETED",
  TEAM_ACCEPTED: "TEAM_ACCEPTED",
  TEAM_REJECTED: "TEAM_REJECTED",
  PROJECT_SUBMITTED: "PROJECT_SUBMITTED",
  PROJECT_UPDATED: "PROJECT_UPDATED",
  USER_BLACKLISTED: "USER_BLACKLISTED",
  USER_UNBLACKLISTED: "USER_UNBLACKLISTED",
  ADMIN_PROMOTED: "ADMIN_PROMOTED",
  ADMIN_DEMOTED: "ADMIN_DEMOTED",
  DATA_EXPORTED: "DATA_EXPORTED",
  DATABASE_BACKUP: "DATABASE_BACKUP",
} as const;

export type ActionType = (typeof Actions)[keyof typeof Actions];

// ─── Logger Function ─────────────────────────────────────

/**
 * Log an activity to the database.
 * Call this from any API route after a state-changing action.
 *
 * @param userId  - The user who performed the action (null for system actions)
 * @param action  - One of the Actions constants
 * @param details - Optional free-text details
 * @param request - Optional Request object to extract IP and User-Agent
 */
export async function logActivity(
  userId: string | null,
  action: ActionType | string,
  details?: string,
  request?: Request
): Promise<void> {
  try {
    let ip: string | null = null;
    let userAgent: string | null = null;

    if (request) {
      // Extract IP from standard headers
      ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        null;

      userAgent = request.headers.get("user-agent") || null;

      // Truncate user agent if too long
      if (userAgent && userAgent.length > 500) {
        userAgent = userAgent.substring(0, 497) + "...";
      }
    }

    await prisma.activityLog.create({
      data: {
        userId,
        action,
        details: details || null,
        ip,
        userAgent,
      },
    });
  } catch (error) {
    // Never let logging failures crash the main operation
    console.error("Activity logging failed:", error);
  }
}
