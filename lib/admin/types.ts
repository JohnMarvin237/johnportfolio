// lib/admin/types.ts
// Shared types for the admin dashboard. Derive from Zod schemas where possible.

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AdminStats {
  projects: number;
  experiences: number;
  education: number;
  certifications: number;
  volunteer: number;
  messages: number;
  unreadMessages: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

// Re-export inferred input types from schemas for convenience
export type { ProjectInput } from '@/lib/schemas/project.schema';
export type { ExperienceInput } from '@/lib/schemas/experience.schema';
export type { EducationInput } from '@/lib/schemas/education.schema';
export type { CertificationInput } from '@/lib/schemas/certification.schema';
export type { VolunteerInput } from '@/lib/schemas/volunteer.schema';
export type { MessageUpdateInput } from '@/lib/schemas/message.schema';
export type { LoginInput } from '@/lib/schemas/login.schema';
