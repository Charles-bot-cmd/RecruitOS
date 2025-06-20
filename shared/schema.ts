import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  position: text("position").notNull(),
  phase: integer("phase").notNull().default(1), // 1 or 2
  status: text("status").notNull().default("New"),
  source: text("source").notNull().default("LinkedIn"),
  appliedDate: timestamp("applied_date").notNull().defaultNow(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  resumeUrl: text("resume_url"),
  linkedinUrl: text("linkedin_url"),
  skills: text("skills"),
  experience: integer("experience"),
  notes: text("notes"),
});

export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => candidates.id),
  type: text("type").notNull().default("Phone"), // Phone, Video, In-Person, Technical
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").notNull().default(60), // minutes
  interviewer: text("interviewer").notNull(),
  status: text("status").notNull().default("Scheduled"), // Scheduled, Completed, Cancelled
  notes: text("notes"),
  rating: integer("rating"), // 1-5
});

export const dashboardStats = pgTable("dashboard_stats", {
  id: serial("id").primaryKey(),
  totalCandidates: integer("total_candidates").notNull().default(0),
  phase1Count: integer("phase1_count").notNull().default(0),
  phase2Count: integer("phase2_count").notNull().default(0),
  hiredCount: integer("hired_count").notNull().default(0),
  interviewsToday: integer("interviews_today").notNull().default(0),
  syncStatus: text("sync_status").notNull().default("synced"), // synced, syncing, error
  lastSync: timestamp("last_sync").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  appliedDate: true,
  lastUpdated: true,
});

export const insertInterviewSchema = createInsertSchema(interviews).omit({
  id: true,
});

export const insertDashboardStatsSchema = createInsertSchema(dashboardStats).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;

export type Interview = typeof interviews.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;

export type DashboardStats = typeof dashboardStats.$inferSelect;
export type InsertDashboardStats = z.infer<typeof insertDashboardStatsSchema>;

export type CandidateStatus = 
  // Phase 1
  | 'New' | 'Screened' | 'Phone Interview' | 'Rejected'
  // Phase 2  
  | 'Technical Interview' | 'Final Interview' | 'Offer Extended' | 'Hired';

export type CandidateSource = 'LinkedIn' | 'Indeed' | 'Referral' | 'Website';
export type InterviewType = 'Phone' | 'Video' | 'In-Person' | 'Technical';
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled';
