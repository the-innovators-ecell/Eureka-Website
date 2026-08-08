import { Role, TeamStatus, SponsorTier, EventStatus } from "@prisma/client";

export type { Role, TeamStatus, SponsorTier, EventStatus };

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  github?: string | null;
  linkedin?: string | null;
  year?: string | null;
  course?: string | null;
  role: Role;
  isBlacklisted: boolean;
  createdAt: Date;
}

export interface TeamWithMembers {
  id: string;
  name: string;
  inviteCode: string;
  status: TeamStatus;
  leaderId: string;
  acceptedAt: Date | null;
  createdAt: Date;
  leader: UserProfile;
  members: TeamMemberWithUser[];
  project: ProjectInfo | null;
}

export interface TeamMemberWithUser {
  id: string;
  teamId: string;
  userId: string;
  name: string;
  joinedAt: Date;
  user: UserProfile;
}

export interface ProjectInfo {
  id: string;
  teamId: string;
  name: string;
  problem: string;
  description: string;
  submittedById: string;
  isLocked: boolean;
  submittedAt: Date;
  submittedBy: {
    id: string;
    name: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalTeams: number;
  projectsSubmitted: number;
  acceptedTeams: number;
  rejectedTeams: number;
  pendingTeams: number;
  recentRegistrations: { date: string; count: number }[];
  recentTeams: { date: string; count: number }[];
  recentProjects: { date: string; count: number }[];
}

export interface SponsorInfo {
  id: string;
  name: string;
  logoUrl: string;
  website?: string | null;
  tier: SponsorTier;
  order: number;
}

export interface EventInfo {
  id: string;
  name: string;
  description: string;
  date: Date;
  venue: string;
  registrationDeadline: Date;
  status: EventStatus;
  prizes: PrizeInfo[];
}

export interface PrizeInfo {
  id: string;
  title: string;
  amount: string;
  description: string;
  rank: number;
  icon: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
