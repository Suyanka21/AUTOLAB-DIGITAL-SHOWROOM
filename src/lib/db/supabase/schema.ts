/**
 * AutoLab Digital Showroom
 * Supabase PostgreSQL Schema (Drizzle ORM)
 *
 * Implements the lean data model:
 * - Configurations & Reference Codes
 * - Enquiries & Voluntary Customer Contact
 * - Operational Analytics Events
 * - Lightweight Administrative Access
 */

import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

// 1. Configurations Table
export const configurations = pgTable("configurations", {
  id: uuid("id").primaryKey().defaultRandom(),
  referenceCode: text("reference_code").notNull().unique(), // e.g. "AL-SC-2026-A8F2"
  vehicleId: text("vehicle_id").notNull(), // "mercedes-s-class-v223"
  selections: jsonb("selections").notNull(), // Full material/color/accent thread selection map
  summary: jsonb("summary").notNull(), // Precomputed human-readable summary
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Enquiries & Sales Consultation Leads Table
export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  configurationId: uuid("configuration_id")
    .references(() => configurations.id, { onDelete: "set null" }),
  referenceCode: text("reference_code").notNull(),
  customerName: text("customer_name").notNull(),
  phoneOrWhatsApp: text("phone_or_whatsapp").notNull(),
  email: text("email"),
  preferredChannel: text("preferred_channel").default("whatsapp").notNull(), // 'whatsapp', 'showroom_visit', 'phone', 'email'
  customerNotes: text("customer_notes"),
  existingVehicleCondition: text("existing_vehicle_condition"), // 'excellent', 'good', 'worn', 'damaged'
  status: text("status").default("new").notNull(), // 'new', 'contacted', 'showroom_scheduled', 'quotation_pending', 'closed'
  assignedAdvisor: text("assigned_advisor"),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Operational Analytics Events
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventName: text("event_name").notNull(), // 'showroom_entered', 'material_swapped', 'camera_preset_changed', 'enquiry_submitted'
  vehicleId: text("vehicle_id"),
  referenceCode: text("reference_code"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Lightweight Admin Users
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").default("advisor").notNull(), // 'admin', 'advisor'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ConfigurationSelect = typeof configurations.$inferSelect;
export type ConfigurationInsert = typeof configurations.$inferInsert;
export type EnquirySelect = typeof enquiries.$inferSelect;
export type EnquiryInsert = typeof enquiries.$inferInsert;
export type AnalyticsEventSelect = typeof analyticsEvents.$inferSelect;
export type AnalyticsEventInsert = typeof analyticsEvents.$inferInsert;
export type AdminUserSelect = typeof adminUsers.$inferSelect;
export type AdminUserInsert = typeof adminUsers.$inferInsert;
