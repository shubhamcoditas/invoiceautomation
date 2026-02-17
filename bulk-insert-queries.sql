-- Bulk INSERT Queries for Invoice Automation Database
-- Run these queries to populate the database with large amounts of test data

-- =============================================
-- 1. USERS TABLE - Insert 10 users
-- =============================================
INSERT INTO users (id, username, password, role, entity_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin', 'password', 'admin', 'hsbc', '2024-01-01 00:00:00'),
('550e8400-e29b-41d4-a716-446655440002', 'john.doe', 'password123', 'business_user', 'hsbc', '2024-01-02 09:15:00'),
('550e8400-e29b-41d4-a716-446655440003', 'jane.smith', 'password123', 'manager', 'hsbc', '2024-01-03 10:30:00'),
('550e8400-e29b-41d4-a716-446655440004', 'mike.wilson', 'password123', 'auditor', 'hsbc', '2024-01-04 11:45:00'),
('550e8400-e29b-41d4-a716-446655440005', 'sarah.jones', 'password123', 'business_user', 'hsbc', '2024-01-05 14:20:00'),
('550e8400-e29b-41d4-a716-446655440006', 'david.brown', 'password123', 'manager', 'hsbc', '2024-01-06 15:35:00'),
('550e8400-e29b-41d4-a716-446655440007', 'lisa.garcia', 'password123', 'business_user', 'hsbc', '2024-01-07 16:50:00'),
('550e8400-e29b-41d4-a716-446655440008', 'robert.miller', 'password123', 'auditor', 'hsbc', '2024-01-08 08:10:00'),
('550e8400-e29b-41d4-a716-446655440009', 'emily.davis', 'password123', 'business_user', 'hsbc', '2024-01-09 09:25:00'),
('550e8400-e29b-41d4-a716-446655440010', 'chris.anderson', 'password123', 'manager', 'hsbc', '2024-01-10 10:40:00');

-- =============================================
-- 2. QR_DATA TABLE - Insert 1000 QR records
-- =============================================
INSERT INTO qr_data (id, entity_id, irn, gstin, invoice_no, date, total_amount, buyer_gstin, seller_gstin, invoice_type, qr_string, processed_by, status, extracted_at) VALUES
('qr-001', 'hsbc', '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z', '27ABCDE1234F1Z5', 'INV-2024-001', '2024-01-15', '₹125,000.00', '29XYZAB5678P1Q2', '27ABCDE1234F1Z5', 'B2B', 'QR:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z:27ABCDE1234F1Z5:29XYZAB5678P1Q2:INV-2024-001:2024-01-15:125000', 'admin', 'success', '2024-01-15 10:30:00'),
('qr-002', 'hsbc', '2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a', '29XYZAB5678P1Q2', 'INV-2024-002', '2024-01-16', '₹89,500.00', '27ABCDE1234F1Z5', '29XYZAB5678P1Q2', 'B2B', 'QR:2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a:29XYZAB5678P1Q2:27ABCDE1234F1Z5:INV-2024-002:2024-01-16:89500', 'john.doe', 'success', '2024-01-16 11:45:00'),
('qr-003', 'hsbc', '3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b', '33PQRST5678M9N0', 'INV-2024-003', '2024-01-17', '₹156,750.00', '07DEFGH9012K3L4', '33PQRST5678M9N0', 'B2B', 'QR:3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b:33PQRST5678M9N0:07DEFGH9012K3L4:INV-2024-003:2024-01-17:156750', 'jane.smith', 'success', '2024-01-17 14:20:00'),
('qr-004', 'hsbc', '4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c', '07DEFGH9012K3L4', 'INV-2024-004', '2024-01-18', '₹203,400.00', '19IJKLM3456N7O8', '07DEFGH9012K3L4', 'B2B', 'QR:4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c:07DEFGH9012K3L4:19IJKLM3456N7O8:INV-2024-004:2024-01-18:203400', 'mike.wilson', 'success', '2024-01-18 09:15:00'),
('qr-005', 'hsbc', '5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d', '19IJKLM3456N7O8', 'INV-2024-005', '2024-01-19', '₹78,900.00', '06OPQRS7890T1U2', '19IJKLM3456N7O8', 'B2C', 'QR:5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d:19IJKLM3456N7O8:06OPQRS7890T1U2:INV-2024-005:2024-01-19:78900', 'sarah.jones', 'success', '2024-01-19 16:30:00'),
('qr-006', 'hsbc', '6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e', '06OPQRS7890T1U2', 'INV-2024-006', '2024-01-20', '₹312,600.00', '24VWXYZ1234A5B6', '06OPQRS7890T1U2', 'B2B', 'QR:6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e:06OPQRS7890T1U2:24VWXYZ1234A5B6:INV-2024-006:2024-01-20:312600', 'david.brown', 'success', '2024-01-20 13:45:00'),
('qr-007', 'hsbc', '7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f', '24VWXYZ1234A5B6', 'INV-2024-007', '2024-01-21', '₹145,300.00', '12CDEFG5678H9I0', '24VWXYZ1234A5B6', 'B2B', 'QR:7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f:24VWXYZ1234A5B6:12CDEFG5678H9I0:INV-2024-007:2024-01-21:145300', 'lisa.garcia', 'success', '2024-01-21 11:20:00'),
('qr-008', 'hsbc', '8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g', '12CDEFG5678H9I0', 'INV-2024-008', '2024-01-22', '₹267,800.00', '35JKLMN9012O3P4', '12CDEFG5678H9I0', 'B2B', 'QR:8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g:12CDEFG5678H9I0:35JKLMN9012O3P4:INV-2024-008:2024-01-22:267800', 'robert.miller', 'success', '2024-01-22 15:10:00'),
('qr-009', 'hsbc', '9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g8h', '35JKLMN9012O3P4', 'INV-2024-009', '2024-01-23', '₹98,450.00', '09QRSTU3456V7W8', '35JKLMN9012O3P4', 'B2C', 'QR:9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g8h:35JKLMN9012O3P4:09QRSTU3456V7W8:INV-2024-009:2024-01-23:98450', 'emily.davis', 'success', '2024-01-23 08:55:00'),
('qr-010', 'hsbc', '0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g8h9i', '09QRSTU3456V7W8', 'INV-2024-010', '2024-01-24', '₹189,200.00', '27ABCDE1234F1Z5', '09QRSTU3456V7W8', 'B2B', 'QR:0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g8h9i:09QRSTU3456V7W8:27ABCDE1234F1Z5:INV-2024-010:2024-01-24:189200', 'chris.anderson', 'success', '2024-01-24 12:40:00');

-- Continue with more QR data records (truncated for brevity - you can expand this pattern)
-- For 1000 records, you would continue this pattern with different IRNs, GSTINs, amounts, etc.

-- =============================================
-- 3. PDF_DATA TABLE - Insert 500 PDF records
-- =============================================
INSERT INTO pdf_data (id, entity_id, file_name, invoice_no, date, irn, gstin, amount, status, extracted_at) VALUES
('pdf-001', 'hsbc', 'invoice_0001_20240115.pdf', 'INV-2024-001', '2024-01-15', '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z', '27ABCDE1234F1Z5', '₹125,000.00', 'processed', '2024-01-15 10:30:00'),
('pdf-002', 'hsbc', 'invoice_0002_20240116.pdf', 'INV-2024-002', '2024-01-16', '2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a', '29XYZAB5678P1Q2', '₹89,500.00', 'processed', '2024-01-16 11:45:00'),
('pdf-003', 'hsbc', 'invoice_0003_20240117.pdf', 'INV-2024-003', '2024-01-17', '3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b', '33PQRST5678M9N0', '₹156,750.00', 'processed', '2024-01-17 14:20:00'),
('pdf-004', 'hsbc', 'invoice_0004_20240118.pdf', 'INV-2024-004', '2024-01-18', '4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c', '07DEFGH9012K3L4', '₹203,400.00', 'processed', '2024-01-18 09:15:00'),
('pdf-005', 'hsbc', 'invoice_0005_20240119.pdf', 'INV-2024-005', '2024-01-19', '5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d', '19IJKLM3456N7O8', '₹78,900.00', 'processed', '2024-01-19 16:30:00'),
('pdf-006', 'hsbc', 'invoice_0006_20240120.pdf', 'INV-2024-006', '2024-01-20', '6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e', '06OPQRS7890T1U2', '₹312,600.00', 'processed', '2024-01-20 13:45:00'),
('pdf-007', 'hsbc', 'invoice_0007_20240121.pdf', 'INV-2024-007', '2024-01-21', '7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f', '24VWXYZ1234A5B6', '₹145,300.00', 'processed', '2024-01-21 11:20:00'),
('pdf-008', 'hsbc', 'invoice_0008_20240122.pdf', 'INV-2024-008', '2024-01-22', '8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g', '12CDEFG5678H9I0', '₹267,800.00', 'processed', '2024-01-22 15:10:00'),
('pdf-009', 'hsbc', 'invoice_0009_20240123.pdf', 'INV-2024-009', '2024-01-23', '9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g8h', '35JKLMN9012O3P4', '₹98,450.00', 'processed', '2024-01-23 08:55:00'),
('pdf-010', 'hsbc', 'invoice_0010_20240124.pdf', 'INV-2024-010', '2024-01-24', '0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g8h9i', '09QRSTU3456V7W8', '₹189,200.00', 'processed', '2024-01-24 12:40:00');

-- Continue with more PDF data records (truncated for brevity)

-- =============================================
-- 4. EGAM_REPOSITORY TABLE - Insert 800 records
-- =============================================
INSERT INTO egam_repository (id, entity_id, irn, invoice_no, date, vendor_gstin, amount, status, fetched_at) VALUES
('egam-001', 'hsbc', '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z', 'INV-2024-001', '2024-01-15', '27ABCDE1234F1Z5', '₹125,000.00', 'processed', '2024-01-15 10:30:00'),
('egam-002', 'hsbc', '2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a', 'INV-2024-002', '2024-01-16', '29XYZAB5678P1Q2', '₹89,500.00', 'processed', '2024-01-16 11:45:00'),
('egam-003', 'hsbc', '3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b', 'INV-2024-003', '2024-01-17', '33PQRST5678M9N0', '₹156,750.00', 'processed', '2024-01-17 14:20:00'),
('egam-004', 'hsbc', '4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c', 'INV-2024-004', '2024-01-18', '07DEFGH9012K3L4', '₹203,400.00', 'processed', '2024-01-18 09:15:00'),
('egam-005', 'hsbc', '5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d', 'INV-2024-005', '2024-01-19', '19IJKLM3456N7O8', '₹78,900.00', 'processed', '2024-01-19 16:30:00'),
('egam-006', 'hsbc', '6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e', 'INV-2024-006', '2024-01-20', '06OPQRS7890T1U2', '₹312,600.00', 'processed', '2024-01-20 13:45:00'),
('egam-007', 'hsbc', '7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f', 'INV-2024-007', '2024-01-21', '24VWXYZ1234A5B6', '₹145,300.00', 'processed', '2024-01-21 11:20:00'),
('egam-008', 'hsbc', '8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g', 'INV-2024-008', '2024-01-22', '12CDEFG5678H9I0', '₹267,800.00', 'processed', '2024-01-22 15:10:00'),
('egam-009', 'hsbc', '9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g8h', 'INV-2024-009', '2024-01-23', '35JKLMN9012O3P4', '₹98,450.00', 'processed', '2024-01-23 08:55:00'),
('egam-010', 'hsbc', '0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g8h9i', 'INV-2024-010', '2024-01-24', '09QRSTU3456V7W8', '₹189,200.00', 'processed', '2024-01-24 12:40:00');

-- Continue with more EGAM repository records (truncated for brevity)

-- =============================================
-- 5. EGAM_AUDIT_LOGS TABLE - Insert 200 records
-- =============================================
INSERT INTO egam_audit_logs (id, entity_id, pull_type, status, records_count, started_at, completed_at, error_message, next_scheduled_at) VALUES
('audit-001', 'hsbc', 'scheduled', 'success', 150, '2024-01-01 00:00:00', '2024-01-01 00:05:30', NULL, '2024-01-02 00:00:00'),
('audit-002', 'hsbc', 'manual', 'success', 89, '2024-01-02 10:30:00', '2024-01-02 10:32:15', NULL, NULL),
('audit-003', 'hsbc', 'scheduled', 'success', 203, '2024-01-03 00:00:00', '2024-01-03 00:06:45', NULL, '2024-01-04 00:00:00'),
('audit-004', 'hsbc', 'manual', 'error', 0, '2024-01-04 14:20:00', NULL, 'Connection timeout', NULL),
('audit-005', 'hsbc', 'scheduled', 'success', 178, '2024-01-05 00:00:00', '2024-01-05 00:05:20', NULL, '2024-01-06 00:00:00'),
('audit-006', 'hsbc', 'manual', 'success', 95, '2024-01-06 11:15:00', '2024-01-06 11:17:30', NULL, NULL),
('audit-007', 'hsbc', 'scheduled', 'success', 167, '2024-01-07 00:00:00', '2024-01-07 00:05:10', NULL, '2024-01-08 00:00:00'),
('audit-008', 'hsbc', 'manual', 'error', 0, '2024-01-08 16:45:00', NULL, 'Invalid response format', NULL),
('audit-009', 'hsbc', 'scheduled', 'success', 192, '2024-01-09 00:00:00', '2024-01-09 00:06:00', NULL, '2024-01-10 00:00:00'),
('audit-010', 'hsbc', 'manual', 'success', 76, '2024-01-10 09:30:00', '2024-01-10 09:31:45', NULL, NULL);

-- Continue with more audit log records (truncated for brevity)

-- =============================================
-- 6. SYSTEM_LOGS TABLE - Insert 1000 records
-- =============================================
INSERT INTO system_logs (id, entity_id, level, module, message, details, user, timestamp) VALUES
('log-001', 'hsbc', 'SUCCESS', 'QR Scanner', 'QR code processed successfully', 'IRN: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z extracted', 'admin', '2024-01-15 10:30:00'),
('log-002', 'hsbc', 'INFO', 'System', 'Database initialized', 'All tables created successfully', 'system', '2024-01-01 00:00:00'),
('log-003', 'SUCCESS', 'PDF Upload', 'PDF document uploaded and processed', 'File: invoice_0001_20240115.pdf processed successfully', 'john.doe', '2024-01-15 11:15:00'),
('log-004', 'hsbc', 'ERROR', 'EGAM Repository', 'EGAM data synchronization failed', 'Connection timeout after 30 seconds', 'jane.smith', '2024-01-16 14:20:00'),
('log-005', 'hsbc', 'SUCCESS', 'Reconciliation', 'Invoice reconciliation completed', '15 invoices reconciled successfully', 'mike.wilson', '2024-01-17 16:45:00'),
('log-006', 'hsbc', 'WARNING', 'EWB Generation', 'EWB generation delayed', 'High server load causing delays', 'sarah.jones', '2024-01-18 09:30:00'),
('log-007', 'hsbc', 'SUCCESS', 'API Validation', 'GSTIN validation completed', '100 GSTINs validated successfully', 'david.brown', '2024-01-19 13:20:00'),
('log-008', 'hsbc', 'INFO', 'User Management', 'User login successful', 'User: lisa.garcia logged in from IP: 192.168.1.100', 'lisa.garcia', '2024-01-20 08:45:00'),
('log-009', 'hsbc', 'SUCCESS', 'System', 'Database backup completed', 'Backup file: backup_20240121_020000.db created', 'system', '2024-01-21 02:00:00'),
('log-010', 'hsbc', 'ERROR', 'QR Scanner', 'QR code processing failed', 'Invalid QR code format detected', 'robert.miller', '2024-01-22 15:30:00');

-- Continue with more system log records (truncated for brevity)

-- =============================================
-- 7. API_LOGS TABLE - Insert 500 records
-- =============================================
INSERT INTO api_logs (id, entity_id, api_name, api_type, parameters, response, status, response_time, endpoint, timestamp) VALUES
('api-001', 'hsbc', 'SEARCH TAXPAYER', 'search-taxpayer', '{"gstin":"27ABCDE1234F1Z5","action":"TP","fy":"2024-25"}', '{"status":"success","data":{"gstin":"27ABCDE1234F1Z5","tradeName":"ABC Technologies Pvt Ltd","status":"Active","registrationDate":"2020-04-15"}}', 'success', 245, '/api/validation/search-taxpayer', '2024-01-15 10:30:00'),
('api-002', 'hsbc', 'PAN TO GSTIN', 'pan-to-gstin', '{"pan":"ABCDE1234F","action":"TP","fy":"2024-25"}', '{"status":"success","data":{"pan":"ABCDE1234F","gstin":"27ABCDE1234F1Z5","tradeName":"ABC Technologies Pvt Ltd"}}', 'success', 189, '/api/validation/pan-to-gstin', '2024-01-15 11:15:00'),
('api-003', 'hsbc', 'VIEW TRACK RETURNS', 'view-track-returns', '{"gstin":"29XYZAB5678P1Q2","action":"TP","fy":"2024-25"}', '{"status":"success","data":{"gstin":"29XYZAB5678P1Q2","returns":[{"period":"2024-01","status":"Filed"}]}}', 'success', 312, '/api/validation/view-track-returns', '2024-01-16 14:20:00'),
('api-004', 'hsbc', 'GET PREFERENCE', 'get-preference', '{"gstin":"33PQRST5678M9N0","action":"TP","fy":"2024-25"}', '{"status":"error","error":"Invalid GSTIN format"}', 'error', 156, '/api/validation/get-preference', '2024-01-17 16:45:00'),
('api-005', 'hsbc', 'MSME VALIDATION', 'msme-validation', '{"msmeId":"MSME12345678","action":"TP","fy":"2024-25"}', '{"status":"success","data":{"msmeId":"MSME12345678","status":"Active","registrationDate":"2021-06-15"}}', 'success', 278, '/api/validation/msme-validation', '2024-01-18 09:30:00'),
('api-006', 'hsbc', 'CIN VALIDATION', 'cin-validation', '{"cin":"U12345AB2020PTC123456","action":"TP","fy":"2024-25"}', '{"status":"success","data":{"cin":"U12345AB2020PTC123456","companyName":"ABC Technologies Pvt Ltd","status":"Active"}}', 'success', 201, '/api/validation/cin-validation', '2024-01-19 13:20:00'),
('api-007', 'hsbc', 'SEARCH TAXPAYER', 'search-taxpayer', '{"gstin":"07DEFGH9012K3L4","action":"TP","fy":"2024-25"}', '{"status":"success","data":{"gstin":"07DEFGH9012K3L4","tradeName":"DEF Logistics Ltd","status":"Active","registrationDate":"2019-08-20"}}', 'success', 267, '/api/validation/search-taxpayer', '2024-01-20 08:45:00'),
('api-008', 'hsbc', 'PAN TO GSTIN', 'pan-to-gstin', '{"pan":"XYZAB5678P","action":"TP","fy":"2024-25"}', '{"status":"error","error":"PAN not found"}', 'error', 134, '/api/validation/pan-to-gstin', '2024-01-21 02:00:00'),
('api-009', 'hsbc', 'VIEW TRACK RETURNS', 'view-track-returns', '{"gstin":"19IJKLM3456N7O8","action":"TP","fy":"2024-25"}', '{"status":"success","data":{"gstin":"19IJKLM3456N7O8","returns":[{"period":"2024-01","status":"Filed"}]}}', 'success', 298, '/api/validation/view-track-returns', '2024-01-22 15:30:00'),
('api-010', 'hsbc', 'GET PREFERENCE', 'get-preference', '{"gstin":"06OPQRS7890T1U2","action":"TP","fy":"2024-25"}', '{"status":"success","data":{"gstin":"06OPQRS7890T1U2","preferences":{"email":"contact@opqrs.com","phone":"+91-9876543210"}}}', 'success', 223, '/api/validation/get-preference', '2024-01-23 11:45:00');

-- Continue with more API log records (truncated for brevity)

-- =============================================
-- 8. PDF_PROCESSING_HISTORY TABLE - Insert 300 records
-- =============================================
INSERT INTO pdf_processing_history (id, entity_id, file_name, document_type, processed_by, ewb_status, processed_at, invoice_no, amount, vendor_name, buyer_name) VALUES
('pdf-hist-001', 'hsbc', 'invoice_0001_20240115.pdf', 'Invoice', 'admin', 'success', '2024-01-15 10:30:00', 'INV-2024-001', '₹125,000.00', 'ABC Technologies Pvt Ltd', 'XYZ Corporation Ltd'),
('pdf-hist-002', 'hsbc', 'invoice_0002_20240116.pdf', 'Invoice', 'john.doe', 'success', '2024-01-16 11:45:00', 'INV-2024-002', '₹89,500.00', 'XYZ Corporation Ltd', 'ABC Technologies Pvt Ltd'),
('pdf-hist-003', 'hsbc', 'invoice_0003_20240117.pdf', 'Delivery Challan', 'jane.smith', 'success', '2024-01-17 14:20:00', 'INV-2024-003', '₹156,750.00', 'DEF Logistics Ltd', 'GHI Industries'),
('pdf-hist-004', 'hsbc', 'invoice_0004_20240118.pdf', 'Invoice', 'mike.wilson', 'failed', '2024-01-18 09:15:00', 'INV-2024-004', '₹203,400.00', 'GHI Industries', 'JKL Trading Co'),
('pdf-hist-005', 'hsbc', 'invoice_0005_20240119.pdf', 'Credit Note', 'sarah.jones', 'success', '2024-01-19 16:30:00', 'INV-2024-005', '₹78,900.00', 'JKL Trading Co', 'MNO Enterprises'),
('pdf-hist-006', 'hsbc', 'invoice_0006_20240120.pdf', 'Invoice', 'david.brown', 'success', '2024-01-20 13:45:00', 'INV-2024-006', '₹312,600.00', 'MNO Enterprises', 'PQR Solutions Inc'),
('pdf-hist-007', 'hsbc', 'invoice_0007_20240121.pdf', 'Debit Note', 'lisa.garcia', 'success', '2024-01-21 11:20:00', 'INV-2024-007', '₹145,300.00', 'PQR Solutions Inc', 'STU Manufacturing'),
('pdf-hist-008', 'hsbc', 'invoice_0008_20240122.pdf', 'Invoice', 'robert.miller', 'success', '2024-01-22 15:10:00', 'INV-2024-008', '₹267,800.00', 'STU Manufacturing', 'VWX Services Ltd'),
('pdf-hist-009', 'hsbc', 'invoice_0009_20240123.pdf', 'Shipping Bill', 'emily.davis', 'failed', '2024-01-23 08:55:00', 'INV-2024-009', '₹98,450.00', 'VWX Services Ltd', 'YZA Trading House'),
('pdf-hist-010', 'hsbc', 'invoice_0010_20240124.pdf', 'Invoice', 'chris.anderson', 'success', '2024-01-24 12:40:00', 'INV-2024-010', '₹189,200.00', 'YZA Trading House', 'BCD Electronics');

-- Continue with more PDF processing history records (truncated for brevity)

-- =============================================
-- 9. BULK_QR_BATCHES TABLE - Insert 50 records
-- =============================================
INSERT INTO bulk_qr_batches (id, entity_id, file_name, total_records, processed_records, success_records, failed_records, status, created_at, completed_at) VALUES
('batch-001', 'hsbc', 'qr_batch_1_2024_01.xlsx', 100, 100, 95, 5, 'completed', '2024-01-01 09:00:00', '2024-01-01 09:15:30'),
('batch-002', 'hsbc', 'qr_batch_2_2024_01.xlsx', 150, 150, 142, 8, 'completed', '2024-01-02 10:30:00', '2024-01-02 10:48:15'),
('batch-003', 'hsbc', 'qr_batch_3_2024_01.xlsx', 200, 200, 189, 11, 'completed', '2024-01-03 11:15:00', '2024-01-03 11:42:20'),
('batch-004', 'hsbc', 'qr_batch_4_2024_01.xlsx', 75, 75, 70, 5, 'completed', '2024-01-04 14:20:00', '2024-01-04 14:28:45'),
('batch-005', 'hsbc', 'qr_batch_5_2024_01.xlsx', 300, 300, 285, 15, 'completed', '2024-01-05 15:45:00', '2024-01-05 16:12:30'),
('batch-006', 'hsbc', 'qr_batch_6_2024_02.xlsx', 120, 120, 115, 5, 'completed', '2024-02-01 08:30:00', '2024-02-01 08:42:15'),
('batch-007', 'hsbc', 'qr_batch_7_2024_02.xlsx', 180, 180, 172, 8, 'completed', '2024-02-02 09:15:00', '2024-02-02 09:35:20'),
('batch-008', 'hsbc', 'qr_batch_8_2024_02.xlsx', 250, 250, 238, 12, 'completed', '2024-02-03 10:00:00', '2024-02-03 10:28:45'),
('batch-009', 'hsbc', 'qr_batch_9_2024_02.xlsx', 90, 90, 85, 5, 'completed', '2024-02-04 11:30:00', '2024-02-04 11:38:30'),
('batch-010', 'hsbc', 'qr_batch_10_2024_02.xlsx', 350, 350, 332, 18, 'completed', '2024-02-05 12:45:00', '2024-02-05 13:18:15');

-- Continue with more bulk QR batch records (truncated for brevity)

-- =============================================
-- 10. BULK_QR_PROCESSING TABLE - Insert 1000 records
-- =============================================
INSERT INTO bulk_qr_processing (id, entity_id, batch_id, qr_string, status, processed_at, extracted_data, error_message, created_at) VALUES
('proc-001', 'hsbc', 'batch-001', 'QR:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z:27ABCDE1234F1Z5:29XYZAB5678P1Q2:INV-2024-001:2024-01-15:125000', 'success', '2024-01-01 09:05:30', '{"irn":"1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z","invoiceNo":"INV-2024-001","amount":"125000"}', NULL, '2024-01-01 09:00:00'),
('proc-002', 'hsbc', 'batch-001', 'QR:2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a:29XYZAB5678P1Q2:27ABCDE1234F1Z5:INV-2024-002:2024-01-16:89500', 'success', '2024-01-01 09:06:15', '{"irn":"2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a","invoiceNo":"INV-2024-002","amount":"89500"}', NULL, '2024-01-01 09:00:30'),
('proc-003', 'hsbc', 'batch-001', 'QR:3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b:33PQRST5678M9N0:07DEFGH9012K3L4:INV-2024-003:2024-01-17:156750', 'success', '2024-01-01 09:07:00', '{"irn":"3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b","invoiceNo":"INV-2024-003","amount":"156750"}', NULL, '2024-01-01 09:01:00'),
('proc-004', 'hsbc', 'batch-001', 'QR:4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c:07DEFGH9012K3L4:19IJKLM3456N7O8:INV-2024-004:2024-01-18:203400', 'failed', '2024-01-01 09:07:45', NULL, 'Invalid QR format', '2024-01-01 09:01:30'),
('proc-005', 'hsbc', 'batch-001', 'QR:5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d:19IJKLM3456N7O8:06OPQRS7890T1U2:INV-2024-005:2024-01-19:78900', 'success', '2024-01-01 09:08:30', '{"irn":"5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d","invoiceNo":"INV-2024-005","amount":"78900"}', NULL, '2024-01-01 09:02:00'),
('proc-006', 'hsbc', 'batch-002', 'QR:6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e:06OPQRS7890T1U2:24VWXYZ1234A5B6:INV-2024-006:2024-01-20:312600', 'success', '2024-01-02 10:35:15', '{"irn":"6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e","invoiceNo":"INV-2024-006","amount":"312600"}', NULL, '2024-01-02 10:30:30'),
('proc-007', 'hsbc', 'batch-002', 'QR:7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f:24VWXYZ1234A5B6:12CDEFG5678H9I0:INV-2024-007:2024-01-21:145300', 'success', '2024-01-02 10:36:00', '{"irn":"7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f","invoiceNo":"INV-2024-007","amount":"145300"}', NULL, '2024-01-02 10:31:00'),
('proc-008', 'hsbc', 'batch-002', 'QR:8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g:12CDEFG5678H9I0:35JKLMN9012O3P4:INV-2024-008:2024-01-22:267800', 'success', '2024-01-02 10:36:45', '{"irn":"8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g","invoiceNo":"INV-2024-008","amount":"267800"}', NULL, '2024-01-02 10:31:30'),
('proc-009', 'hsbc', 'batch-002', 'QR:9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g8h:35JKLMN9012O3P4:09QRSTU3456V7W8:INV-2024-009:2024-01-23:98450', 'failed', '2024-01-02 10:37:30', NULL, 'Processing timeout', '2024-01-02 10:32:00'),
('proc-010', 'hsbc', 'batch-002', 'QR:0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g8h9i:09QRSTU3456V7W8:27ABCDE1234F1Z5:INV-2024-010:2024-01-24:189200', 'success', '2024-01-02 10:38:15', '{"irn":"0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b3c4d5e6f7g8h9i","invoiceNo":"INV-2024-010","amount":"189200"}', NULL, '2024-01-02 10:32:30');

-- Continue with more bulk QR processing records (truncated for brevity)

-- =============================================
-- SUMMARY OF DATA TO BE INSERTED
-- =============================================
-- Users: 100 records
-- QR Data: 1000 records  
-- PDF Data: 500 records
-- EGAM Repository: 800 records
-- EGAM Audit Logs: 200 records
-- System Logs: 1000 records
-- API Logs: 500 records
-- PDF Processing History: 300 records
-- Bulk QR Batches: 50 records
-- Bulk QR Processing: 1000 records
-- 
-- Total: 5,450 records across all tables
-- =============================================

-- Note: This is a sample of the INSERT queries. 
-- To get the complete set of 1000+ records for each table,
-- you would need to generate more data following the same pattern
-- with different IRNs, GSTINs, amounts, dates, and other fields.
