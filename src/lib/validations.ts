import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
    github: z
      .string()
      .url("Please enter a valid GitHub URL")
      .regex(/github\.com/, "Must be a GitHub URL")
      .optional()
      .or(z.literal("")),
    linkedin: z
      .string()
      .min(1, "LinkedIn profile URL is required")
      .url("Please enter a valid LinkedIn URL")
      .regex(/linkedin\.com/, "Must be a valid LinkedIn URL"),
    year: z.string().min(1, "Please select your year of study"),
    course: z.string().min(1, "Please enter your course"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, "You must accept the Terms & Conditions to register"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name must be less than 50 characters"),
  memberCount: z
    .number()
    .min(2, "Team must have at least 2 members")
    .max(4, "Team can have at most 4 members"),
  memberNames: z
    .array(z.string().min(2, "Member name must be at least 2 characters"))
    .min(1, "At least one additional member is required"),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;

export const joinTeamSchema = z.object({
  inviteCode: z
    .string()
    .min(1, "Invite code is required")
    .regex(/^IDT-[A-Z0-9]{5}$/, "Invalid invite code format (e.g., IDT-7F29X)"),
});

export type JoinTeamInput = z.infer<typeof joinTeamSchema>;

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be less than 100 characters"),
  problem: z
    .string()
    .max(500, "Problem statement must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(2000, "Project description must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
  pptUrl: z.string().optional().or(z.literal("")),
  pptName: z.string().optional().or(z.literal("")),
});

export type ProjectInput = z.infer<typeof projectSchema>;


