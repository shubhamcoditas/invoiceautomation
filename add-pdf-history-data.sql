-- SQL script to add PDF processing history data
-- Run this script to populate the pdf_processing_history table

-- Clear existing data (optional)
DELETE FROM pdf_processing_history;

-- Insert sample PDF processing history data
INSERT INTO pdf_processing_history (
    id, entity_id, file_name, document_type, processed_by, 
    ewb_status, processed_at, invoice_no, amount, vendor_name, buyer_name
) VALUES 
-- Invoice records
('pdf-001', 'hsbc', 'invoice_001.pdf', 'invoice', 'admin', 'success', '2024-01-15T10:30:00.000Z', 'INV-2024-001', '₹125,000.00', 'ABC Technologies Pvt Ltd', 'XYZ Corporation Ltd'),
('pdf-002', 'hsbc', 'invoice_002.pdf', 'invoice', 'admin', 'success', '2024-01-16T11:15:00.000Z', 'INV-2024-002', '₹85,500.00', 'DEF Manufacturing Ltd', 'GHI Industries Ltd'),
('pdf-003', 'hsbc', 'invoice_003.pdf', 'invoice', 'admin', 'failed', '2024-01-17T14:20:00.000Z', 'INV-2024-003', '₹200,000.00', 'JKL Trading Co', 'MNO Enterprises Ltd'),
('pdf-004', 'hsbc', 'invoice_004.pdf', 'invoice', 'admin', 'success', '2024-01-18T09:45:00.000Z', 'INV-2024-004', '₹150,000.00', 'PQR Solutions Inc', 'STU Manufacturing Ltd'),
('pdf-005', 'hsbc', 'invoice_005.pdf', 'invoice', 'admin', 'not_attempted', '2024-01-19T16:30:00.000Z', 'INV-2024-005', '₹95,000.00', 'VWX Services Ltd', 'YZA Trading House'),

-- Delivery Challan records
('pdf-006', 'hsbc', 'delivery_challan_001.pdf', 'delivery-challan', 'admin', 'success', '2024-01-20T08:15:00.000Z', 'DC-2024-001', '₹75,500.00', 'BCD Electronics Ltd', 'EFG Pharmaceuticals Ltd'),
('pdf-007', 'hsbc', 'delivery_challan_002.pdf', 'delivery-challan', 'admin', 'failed', '2024-01-21T13:45:00.000Z', 'DC-2024-002', '₹120,000.00', 'HIJ Construction Ltd', 'KLM Textiles Ltd'),
('pdf-008', 'hsbc', 'delivery_challan_003.pdf', 'delivery-challan', 'admin', 'success', '2024-01-22T10:20:00.000Z', 'DC-2024-003', '₹65,000.00', 'NOP Food Products Ltd', 'QRS Automobiles Ltd'),

-- BOE records
('pdf-009', 'hsbc', 'boe_001.pdf', 'boe', 'admin', 'success', '2024-01-23T12:10:00.000Z', 'BOE-2024-001', '₹500,000.00', 'TUV Chemicals Ltd', 'WXY Steel Works Ltd'),
('pdf-010', 'hsbc', 'boe_002.pdf', 'boe', 'admin', 'not_attempted', '2024-01-24T15:35:00.000Z', 'BOE-2024-002', '₹750,000.00', 'ZAB Software Ltd', 'CDE Consultancy Ltd'),
('pdf-011', 'hsbc', 'boe_003.pdf', 'boe', 'admin', 'failed', '2024-01-25T11:50:00.000Z', 'BOE-2024-003', '₹300,000.00', 'EFG Logistics Ltd', 'HIJ Trading Co'),

-- Shipping Bill records
('pdf-012', 'hsbc', 'shipping_bill_001.pdf', 'shipping-bill', 'admin', 'success', '2024-01-26T09:25:00.000Z', 'SB-2024-001', '₹400,000.00', 'KLM Shipping Ltd', 'MNO Imports Ltd'),
('pdf-013', 'hsbc', 'shipping_bill_002.pdf', 'shipping-bill', 'admin', 'success', '2024-01-27T14:40:00.000Z', 'SB-2024-002', '₹600,000.00', 'PQR Maritime Ltd', 'STU Exports Ltd'),
('pdf-014', 'hsbc', 'shipping_bill_003.pdf', 'shipping-bill', 'admin', 'not_attempted', '2024-01-28T16:15:00.000Z', 'SB-2024-003', '₹350,000.00', 'VWX Port Services Ltd', 'YZA Global Ltd'),

-- Additional Invoice records
('pdf-015', 'hsbc', 'invoice_006.pdf', 'invoice', 'admin', 'success', '2024-01-29T07:30:00.000Z', 'INV-2024-006', '₹180,000.00', 'BCD Retail Ltd', 'EFG Wholesale Ltd'),
('pdf-016', 'hsbc', 'invoice_007.pdf', 'invoice', 'admin', 'failed', '2024-01-30T12:45:00.000Z', 'INV-2024-007', '₹220,000.00', 'HIJ Services Ltd', 'KLM Business Ltd'),
('pdf-017', 'hsbc', 'invoice_008.pdf', 'invoice', 'admin', 'success', '2024-01-31T15:20:00.000Z', 'INV-2024-008', '₹110,000.00', 'NOP Technology Ltd', 'QRS Solutions Ltd'),
('pdf-018', 'hsbc', 'invoice_009.pdf', 'invoice', 'admin', 'not_attempted', '2024-02-01T10:10:00.000Z', 'INV-2024-009', '₹90,000.00', 'TUV Healthcare Ltd', 'WXY Medical Ltd'),
('pdf-019', 'hsbc', 'invoice_010.pdf', 'invoice', 'admin', 'success', '2024-02-02T13:55:00.000Z', 'INV-2024-010', '₹160,000.00', 'ZAB Finance Ltd', 'CDE Banking Ltd'),

-- Additional Delivery Challan records
('pdf-020', 'hsbc', 'delivery_challan_004.pdf', 'delivery-challan', 'admin', 'success', '2024-02-03T08:40:00.000Z', 'DC-2024-004', '₹45,000.00', 'EFG Transport Ltd', 'HIJ Logistics Ltd'),
('pdf-021', 'hsbc', 'delivery_challan_005.pdf', 'delivery-challan', 'admin', 'failed', '2024-02-04T11:25:00.000Z', 'DC-2024-005', '₹85,000.00', 'KLM Distribution Ltd', 'MNO Supply Ltd'),
('pdf-022', 'hsbc', 'delivery_challan_006.pdf', 'delivery-challan', 'admin', 'success', '2024-02-05T14:15:00.000Z', 'DC-2024-006', '₹70,000.00', 'PQR Freight Ltd', 'STU Cargo Ltd'),

-- Additional BOE records
('pdf-023', 'hsbc', 'boe_004.pdf', 'boe', 'admin', 'success', '2024-02-06T09:50:00.000Z', 'BOE-2024-004', '₹800,000.00', 'VWX International Ltd', 'YZA Global Trade Ltd'),
('pdf-024', 'hsbc', 'boe_005.pdf', 'boe', 'admin', 'not_attempted', '2024-02-07T12:30:00.000Z', 'BOE-2024-005', '₹450,000.00', 'BCD Exports Ltd', 'EFG Imports Ltd'),

-- Additional Shipping Bill records
('pdf-025', 'hsbc', 'shipping_bill_004.pdf', 'shipping-bill', 'admin', 'success', '2024-02-08T15:45:00.000Z', 'SB-2024-004', '₹700,000.00', 'HIJ Maritime Ltd', 'KLM Port Services Ltd');

-- Verify the data was inserted
SELECT COUNT(*) as total_records FROM pdf_processing_history;

-- Show summary by document type
SELECT document_type, COUNT(*) as count 
FROM pdf_processing_history 
GROUP BY document_type 
ORDER BY count DESC;

-- Show summary by EWB status
SELECT ewb_status, COUNT(*) as count 
FROM pdf_processing_history 
GROUP BY ewb_status 
ORDER BY count DESC;

-- Show recent records
SELECT file_name, document_type, ewb_status, processed_at 
FROM pdf_processing_history 
ORDER BY processed_at DESC 
LIMIT 10;
