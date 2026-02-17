import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, jsonb, decimal, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('business_user'), // 'admin', 'application_admin', 'business_user', or 'agent'
  entityId: text("entity_id").notNull().default('hsbc'), // Entity the user belongs to
  companyName: text("company_name"), // Company name for agents
  email: text("email"), // Email address
  phone: text("phone"), // Phone number
  department: text("department"), // Department
  status: text("status").notNull().default('active'), // 'active', 'inactive', 'invited'
  notes: text("notes"), // Notes about the agent
  metadata: jsonb("metadata"), // Additional metadata as JSON
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  filePath: text("file_path"), // Path to the actual PDF file on disk
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
  requestId: text("request_id"), // Request ID for tracing
});

export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: text("ticket_id").notNull().unique(), // Unique ticket ID like TKT-2024-001234
  entityId: text("entity_id").notNull().default('hsbc'), // Entity this ticket belongs to
  invoiceNo: text("invoice_no").notNull(), // Invoice number this ticket is raised against
  invoiceId: text("invoice_id"), // Reference to invoice record (can be from qr_data, pdf_data, or egam_repository)
  invoiceSource: text("invoice_source"), // 'qr', 'pdf', 'egam', or 'email'
  raisedBy: text("raised_by").notNull(), // Username of the user/agent who raised the ticket
  raisedByRole: text("raised_by_role").notNull(), // Role of the user who raised the ticket ('agent', 'user', 'admin')
  comments: text("comments").notNull(), // Comments added at ticket creation
  status: text("status").notNull().default('open'), // 'open', 'in_progress', 'resolved', 'closed'
  priority: text("priority").notNull().default('medium'), // 'low', 'medium', 'high', 'urgent'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: text("resolved_by"), // Username of admin who resolved the ticket
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
  requestId: text("request_id"), // Request ID for tracing
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
  companyName: true,
  email: true,
  phone: true,
  department: true,
  status: true,
  notes: true,
  metadata: true,
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

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type PDFProcessingHistory = typeof pdfProcessingHistory.$inferSelect;
export type InsertPDFProcessingHistory = z.infer<typeof insertPDFProcessingHistorySchema>;
export type BulkQRProcessing = typeof bulkQRProcessing.$inferSelect;
export type InsertBulkQRProcessing = z.infer<typeof insertBulkQRProcessingSchema>;
export type BulkQRBatches = typeof bulkQRBatches.$inferSelect;
export type InsertBulkQRBatches = z.infer<typeof insertBulkQRBatchesSchema>;

// ============================================================================
// COST MODEL SCHEMA
// ============================================================================

// Verticals Master
export const verticals = pgTable("verticals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  verticalId: text("vertical_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default('active'), // 'active', 'inactive', 'archived'
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Asset Classes
export const assetClass = pgTable("asset_class", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  classId: text("class_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default('active'),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Asset Types
export const assetType = pgTable("asset_type", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  assetClassId: varchar("asset_class_id").notNull().references(() => assetClass.id),
  typeId: text("type_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default('active'),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assets
export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  assetTypeId: varchar("asset_type_id").notNull().references(() => assetType.id),
  assetCode: text("asset_code").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  costOfAcquisition: decimal("cost_of_acquisition", { precision: 15, scale: 2 }).notNull(),
  dateOfAcquisition: timestamp("date_of_acquisition").notNull(),
  assetLife: integer("asset_life").notNull(), // in years
  serviceMappingType: text("service_mapping_type").notNull(), // 'direct' or 'indirect'
  directServiceId: varchar("direct_service_id"), // for direct mapping
  status: text("status").notNull().default('active'), // 'active', 'inactive', 'archived', 'disposed'
  notes: text("notes"),
  depreciationSchedule: jsonb("depreciation_schedule"), // JSON array of year-wise depreciation
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Asset Service Allocations (for indirect assets)
export const assetServiceAllocations = pgTable("asset_service_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  assetId: varchar("asset_id").notNull().references(() => assets.id),
  serviceId: varchar("service_id").notNull(), // references services table
  allocationPercentage: decimal("allocation_percentage", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Service Groups
export const serviceGroups = pgTable("service_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  verticalId: varchar("vertical_id").notNull().references(() => verticals.id),
  groupId: text("group_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default('active'),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  serviceGroupId: varchar("service_group_id").notNull().references(() => serviceGroups.id),
  serviceId: text("service_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  uom: decimal("uom", { precision: 10, scale: 2 }), // Unit of Measurement (numeric value)
  status: text("status").notNull().default('active'),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cost Groups
export const costGroups = pgTable("cost_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  verticalId: varchar("vertical_id").notNull().references(() => verticals.id),
  costGroupId: text("cost_group_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default('active'),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Budget Lines
export const budgetLines = pgTable("budget_lines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  costGroupId: varchar("cost_group_id").notNull().references(() => costGroups.id),
  budgetLineId: text("budget_line_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default('active'),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Budgets (for Budget Lines and Service Groups)
export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  budgetLineId: varchar("budget_line_id"), // nullable - can be for budget line or service group
  serviceGroupId: varchar("service_group_id"), // nullable - can be for budget line or service group
  financialYear: text("financial_year").notNull(), // Format: YYYY-YY (e.g., 2024-25)
  budgetAmount: decimal("budget_amount", { precision: 15, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cost Elements
export const costElements = pgTable("cost_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  budgetLineId: varchar("budget_line_id").notNull().references(() => budgetLines.id),
  costElementId: text("cost_element_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  costType: text("cost_type").notNull(), // 'direct', 'indirect', 'common'
  directServiceId: varchar("direct_service_id"), // for direct costs - references services
  type: text("type").notNull(), // 'budgeted' or 'actual'
  financialYear: text("financial_year"), // for budgeted costs
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  status: text("status").notNull().default('active'),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cost Rules (for Indirect and Common cost allocations)
export const costRules = pgTable("cost_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('hsbc'),
  costElementId: varchar("cost_element_id").notNull().references(() => costElements.id),
  serviceId: varchar("service_id").notNull(), // references services table
  allocationPercentage: decimal("allocation_percentage", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert Schemas for Cost Model
export const insertVerticalSchema = createInsertSchema(verticals).pick({
  entityId: true,
  name: true,
  description: true,
  status: true,
});

export const insertAssetClassSchema = createInsertSchema(assetClass).pick({
  entityId: true,
  name: true,
  description: true,
  status: true,
});

export const insertAssetTypeSchema = createInsertSchema(assetType).pick({
  entityId: true,
  assetClassId: true,
  name: true,
  description: true,
  status: true,
});

export const insertAssetSchema = createInsertSchema(assets).pick({
  entityId: true,
  assetTypeId: true,
  name: true,
  description: true,
  costOfAcquisition: true,
  dateOfAcquisition: true,
  assetLife: true,
  serviceMappingType: true,
  directServiceId: true,
  status: true,
  notes: true,
  depreciationSchedule: true,
});

export const insertAssetServiceAllocationSchema = createInsertSchema(assetServiceAllocations).pick({
  entityId: true,
  assetId: true,
  serviceId: true,
  allocationPercentage: true,
});

export const insertServiceGroupSchema = createInsertSchema(serviceGroups).pick({
  entityId: true,
  verticalId: true,
  name: true,
  description: true,
  status: true,
});

export const insertServiceSchema = createInsertSchema(services).pick({
  entityId: true,
  serviceGroupId: true,
  name: true,
  description: true,
  uom: true,
  status: true,
});

export const insertCostGroupSchema = createInsertSchema(costGroups).pick({
  entityId: true,
  verticalId: true,
  name: true,
  description: true,
  status: true,
});

export const insertBudgetLineSchema = createInsertSchema(budgetLines).pick({
  entityId: true,
  costGroupId: true,
  name: true,
  description: true,
  status: true,
});

export const insertBudgetSchema = createInsertSchema(budgets).pick({
  entityId: true,
  budgetLineId: true,
  serviceGroupId: true,
  financialYear: true,
  budgetAmount: true,
  notes: true,
});

export const insertCostElementSchema = createInsertSchema(costElements).pick({
  entityId: true,
  budgetLineId: true,
  name: true,
  description: true,
  costType: true,
  directServiceId: true,
  type: true,
  financialYear: true,
  amount: true,
  status: true,
});

export const insertCostRuleSchema = createInsertSchema(costRules).pick({
  entityId: true,
  costElementId: true,
  serviceId: true,
  allocationPercentage: true,
});

// Type exports for Cost Model
export type Vertical = typeof verticals.$inferSelect;
export type InsertVertical = z.infer<typeof insertVerticalSchema>;
export type AssetClass = typeof assetClass.$inferSelect;
export type InsertAssetClass = z.infer<typeof insertAssetClassSchema>;
export type AssetType = typeof assetType.$inferSelect;
export type InsertAssetType = z.infer<typeof insertAssetTypeSchema>;
export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type AssetServiceAllocation = typeof assetServiceAllocations.$inferSelect;
export type InsertAssetServiceAllocation = z.infer<typeof insertAssetServiceAllocationSchema>;
export type ServiceGroup = typeof serviceGroups.$inferSelect;
export type InsertServiceGroup = z.infer<typeof insertServiceGroupSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type CostGroup = typeof costGroups.$inferSelect;
export type InsertCostGroup = z.infer<typeof insertCostGroupSchema>;
export type BudgetLine = typeof budgetLines.$inferSelect;
export type InsertBudgetLine = z.infer<typeof insertBudgetLineSchema>;
export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type CostElement = typeof costElements.$inferSelect;
export type InsertCostElement = z.infer<typeof insertCostElementSchema>;
export type CostRule = typeof costRules.$inferSelect;
export type InsertCostRule = z.infer<typeof insertCostRuleSchema>;

// ============================================================================
// EMIRATES AIRLINE ACTIVITY LOGS SCHEMA
// ============================================================================

// EA Activity Logs - for tracking logins, downloads, and syncs
export const eaActivityLogs = pgTable("ea_activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: text("entity_id").notNull().default('emirates'),
  activityType: text("activity_type").notNull(), // 'login', 'bulk_download', 'cloud_sync'
  category: text("category").notNull(), // 'authentication', 'download', 'sync'
  userId: text("user_id"), // Reference to user who performed the action
  userName: text("user_name").notNull(), // Display name of the user/agent
  userRole: text("user_role"), // 'admin', 'agent', 'user'
  description: text("description").notNull(), // Human-readable description
  metadata: jsonb("metadata"), // Additional data (record count, file names, etc.)
  ipAddress: text("ip_address"), // IP address for login activities
  userAgent: text("user_agent"), // Browser/device info for login activities
  status: text("status").notNull().default('success'), // 'success', 'failed', 'in_progress'
  recordsCount: integer("records_count"), // For sync activities
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertEAActivityLogSchema = createInsertSchema(eaActivityLogs).omit({
  id: true,
  timestamp: true,
});

export type EAActivityLog = typeof eaActivityLogs.$inferSelect;
export type InsertEAActivityLog = z.infer<typeof insertEAActivityLogSchema>;