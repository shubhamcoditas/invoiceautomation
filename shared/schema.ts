import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('business_user'), // 'admin' or 'business_user'
});

export const qrData = pgTable("qr_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  irn: text("irn").notNull(),
  gstin: text("gstin").notNull(),
  invoiceNo: text("invoice_no").notNull(),
  date: text("date").notNull(),
  totalAmount: text("total_amount").notNull(),
  buyerGstin: text("buyer_gstin").notNull(),
  sellerGstin: text("seller_gstin").notNull(),
  invoiceType: text("invoice_type").notNull(),
  extractedAt: timestamp("extracted_at").defaultNow(),
});

export const pdfData = pgTable("pdf_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  invoiceNo: text("invoice_no").notNull(),
  date: text("date").notNull(),
  irn: text("irn").notNull(),
  gstin: text("gstin").notNull(),
  amount: text("amount").notNull(),
  status: text("status").notNull().default('processed'),
  extractedAt: timestamp("extracted_at").defaultNow(),
});

export const egamRepository = pgTable("egam_repository", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  irn: text("irn").notNull().unique(),
  invoiceNo: text("invoice_no").notNull(),
  date: text("date").notNull(),
  vendorGstin: text("vendor_gstin").notNull(),
  amount: text("amount").notNull(),
  status: text("status").notNull().default('processed'),
  fetchedAt: timestamp("fetched_at").defaultNow(),
});

export const systemLogs = pgTable("system_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").defaultNow(),
  level: text("level").notNull(), // 'INFO', 'WARNING', 'ERROR', 'SUCCESS'
  module: text("module").notNull(),
  message: text("message").notNull(),
  details: text("details"),
});

export const apiLogs = pgTable("api_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").defaultNow(),
  apiName: text("api_name").notNull(),
  parameters: json("parameters"),
  response: json("response"),
  status: text("status").notNull(), // 'success', 'error'
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertQRDataSchema = createInsertSchema(qrData).omit({
  id: true,
  extractedAt: true,
});

export const insertPDFDataSchema = createInsertSchema(pdfData).omit({
  id: true,
  extractedAt: true,
});

export const insertEGAMDataSchema = createInsertSchema(egamRepository).omit({
  id: true,
  fetchedAt: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  timestamp: true,
});

export const insertAPILogSchema = createInsertSchema(apiLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type QRData = typeof qrData.$inferSelect;
export type InsertQRData = z.infer<typeof insertQRDataSchema>;
export type PDFData = typeof pdfData.$inferSelect;
export type InsertPDFData = z.infer<typeof insertPDFDataSchema>;
export type EGAMData = typeof egamRepository.$inferSelect;
export type InsertEGAMData = z.infer<typeof insertEGAMDataSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type APILog = typeof apiLogs.$inferSelect;
export type InsertAPILog = z.infer<typeof insertAPILogSchema>;
