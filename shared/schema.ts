import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, jsonb, decimal, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('business_user'), // 'admin', 'application_admin', or 'business_user'
  entityId: text("entity_id").notNull().default('hsbc'), // Entity the user belongs to
});

export const qrData = pgTable("qr_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'), // Entity this data belongs to
  irn: text("irn").notNull(),
  gstin: text("gstin").notNull(),
  invoiceNo: text("invoice_no").notNull(),
  date: text("date").notNull(),
  totalAmount: text("total_amount").notNull(),
  buyerGstin: text("buyer_gstin").notNull(),
  sellerGstin: text("seller_gstin").notNull(),
  invoiceType: text("invoice_type").notNull(),
  qrString: text("qr_string").notNull(),
  processedBy: text("processed_by").notNull(),
  status: text("status").notNull().default("success"), // 'success' or 'failed'
  extractedAt: timestamp("extracted_at").defaultNow(),
});

export const pdfData = pgTable("pdf_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'), // Entity this data belongs to
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
  entityId: text("entity_id").notNull().default('hsbc'), // Entity this data belongs to
  irn: text("irn").notNull().unique(),
  invoiceNo: text("invoice_no").notNull(),
  date: text("date").notNull(),
  vendorGstin: text("vendor_gstin").notNull(),
  amount: text("amount").notNull(),
  status: text("status").notNull().default('processed'),
  fetchedAt: timestamp("fetched_at").defaultNow(),
});

export const egamAuditLogs = pgTable("egam_audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'), // Entity this log belongs to
  pullType: text("pull_type").notNull(), // 'manual' or 'scheduled'
  status: text("status").notNull(), // 'success', 'error', 'in_progress'
  recordsCount: decimal("records_count", { precision: 10, scale: 0 }),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
  nextScheduledAt: timestamp("next_scheduled_at"),
});

export const pdfProcessingHistory = pgTable("pdf_processing_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'), // Entity this data belongs to
  fileName: text("file_name").notNull(),
  documentType: text("document_type").notNull(),
  processedBy: text("processed_by").notNull(),
  ewbStatus: text("ewb_status").notNull(), // 'success', 'failed', 'not_attempted'
  processedAt: timestamp("processed_at").notNull(),
  invoiceNo: text("invoice_no"),
  amount: text("amount"),
  vendorName: text("vendor_name"),
  buyerName: text("buyer_name"),
});

export const systemLogs = pgTable("system_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'), // Entity this log belongs to
  timestamp: timestamp("timestamp").defaultNow(),
  level: text("level").notNull(), // 'INFO', 'WARNING', 'ERROR', 'SUCCESS'
  module: text("module").notNull(),
  message: text("message").notNull(),
  details: text("details"),
});

export const apiLogs = pgTable("api_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'), // Entity this log belongs to
  timestamp: timestamp("timestamp").defaultNow(),
  apiName: text("api_name").notNull(),
  apiType: text("api_type").notNull(),
  parameters: json("parameters"),
  response: json("response"),
  status: text("status").notNull(), // 'success', 'error'
  responseTime: integer("response_time"), // response time in milliseconds
});

export const bulkQRProcessing = pgTable("bulk_qr_processing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'), // Entity this data belongs to
  batchId: varchar("batch_id").notNull(),
  qrString: text("qr_string").notNull(),
  status: text("status").notNull().default("queued"), // queued, in_progress, success, failed
  processedAt: timestamp("processed_at"),
  extractedData: json("extracted_data"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bulkQRBatches = pgTable("bulk_qr_batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'), // Entity this data belongs to
  fileName: text("file_name").notNull(),
  totalRecords: integer("total_records").notNull(),
  processedRecords: integer("processed_records").notNull().default(0),
  successRecords: integer("success_records").notNull().default(0),
  failedRecords: integer("failed_records").notNull().default(0),
  status: text("status").notNull().default("processing"), // processing, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  entityId: true,
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

export const insertEGAMAuditLogSchema = createInsertSchema(egamAuditLogs).omit({
  id: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  timestamp: true,
});

export const insertAPILogSchema = createInsertSchema(apiLogs).omit({
  id: true,
  timestamp: true,
});

export const insertPDFProcessingHistorySchema = createInsertSchema(pdfProcessingHistory).omit({
  id: true,
});

export const insertBulkQRProcessingSchema = createInsertSchema(bulkQRProcessing).omit({
  id: true,
  createdAt: true,
});

export const insertBulkQRBatchesSchema = createInsertSchema(bulkQRBatches).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type QRData = typeof qrData.$inferSelect;
export type InsertQRData = z.infer<typeof insertQRDataSchema>;
export type PDFData = typeof pdfData.$inferSelect;
export type InsertPDFData = z.infer<typeof insertPDFDataSchema>;
export type EGAMData = typeof egamRepository.$inferSelect;
export type InsertEGAMData = z.infer<typeof insertEGAMDataSchema>;
export type EGAMAuditLog = typeof egamAuditLogs.$inferSelect;
export type InsertEGAMAuditLog = z.infer<typeof insertEGAMAuditLogSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type APILog = typeof apiLogs.$inferSelect;
export type InsertAPILog = z.infer<typeof insertAPILogSchema>;
export type PDFProcessingHistory = typeof pdfProcessingHistory.$inferSelect;
export type InsertPDFProcessingHistory = z.infer<typeof insertPDFProcessingHistorySchema>;
export type BulkQRProcessing = typeof bulkQRProcessing.$inferSelect;
export type InsertBulkQRProcessing = z.infer<typeof insertBulkQRProcessingSchema>;
export type BulkQRBatches = typeof bulkQRBatches.$inferSelect;
export type InsertBulkQRBatches = z.infer<typeof insertBulkQRBatchesSchema>;
