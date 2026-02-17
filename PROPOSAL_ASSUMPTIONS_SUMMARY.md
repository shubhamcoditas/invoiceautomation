# Critical Assumptions for Cost Model Proposal

This document summarizes key assumptions that should be explicitly stated in any proposal for the Cost Model system.

---

## 🚨 Critical Feature Assumptions

### 1. Depreciation Management
- **Manual Entry Only**: Depreciation must be entered manually per year. No automatic calculation using depreciation methods.
- **No Depreciation Methods**: No support for straight-line, declining balance, or other depreciation methods.
- **No Residual Value**: No support for residual value or residual percentage in depreciation calculations.

### 2. Cost Allocation
- **Percentage-Based Only**: All cost allocations (Indirect, Common, Asset) use percentage-based drivers only.
- **No Other Drivers**: No support for headcount, revenue, usage, or custom driver-based allocation.

### 3. Unit of Measurement (UOM)
- **Single Numeric Value**: UOM is a numeric value for cost per unit calculation, NOT a unit of measurement with multiple units and conversions.
- **No Volume Tracking**: No capture or management of service volumes (budgeted or actual).

### 4. Financial Year Handling
- **Mixed Year Types**: Depreciation uses calendar year; budgets use financial year (YYYY-YY format).
- **No Year Selector for Depreciation**: Depreciation in cost calculations is always for current calendar year.

### 5. Data Entry & Import
- **Manual Entry Only**: All data entry is through UI forms. No Excel upload or bulk import functionality.
- **No System Integration**: No integration with external systems (ERP, accounting systems, etc.).

### 6. Workflow & Approval
- **No Approval Workflows**: All changes are immediately effective. No multi-step approval process.
- **No Versioning**: No support for multiple costing scenarios or versions.
- **No Period Locking**: No support for locking periods after approval.

### 7. Audit & History
- **Basic Audit Only**: Only created_at/updated_at timestamps. No detailed audit trail or version history.
- **No Effective Dating**: No support for scheduling changes for future dates.

### 8. Calculations
- **Real-Time Calculation**: Service costs are calculated on-demand, not pre-calculated or stored.
- **No Historical Snapshots**: No storage of historical costing run records.

### 9. Reporting
- **Pre-Defined Reports Only**: No ad-hoc report builder or custom report creation.
- **Limited Export**: CSV export for costing data only. No Excel templates, PDF reports, or comprehensive data dumps.
- **No Budget vs Actual**: No built-in budget vs actual comparison or variance analysis.

### 10. Advanced Features NOT Included
- ❌ Inter-service cost consumption
- ❌ Revenue capture and pricing management
- ❌ Margin and profitability analysis
- ❌ Circular dependency detection
- ❌ Scheduled reports or automated distribution
- ❌ Cost Sub-Groups (only Cost Groups and Budget Lines exist)

---

## 📋 Data Management Assumptions

### Immutable Relationships
The following relationships **cannot be changed** after entity creation:
- Asset Type (in Asset)
- Service Group (in Service)
- Vertical (in Cost Group, Service Group)
- Cost Group (in Budget Line)
- Budget Line (in Cost Element)
- Cost Type (in Cost Element)

**Impact**: To change relationships, users must create new entities.

### Duplicate Handling
- Duplicate names prevented using case-insensitive matching
- System keeps most recent record when duplicates detected

### Deletion Rules
- Deletion prevented if entities are referenced by other entities
- No automatic cascade deletion
- Users must manually remove child entities before deleting parents

---

## 🔧 Technical Assumptions

### Performance
- Designed for **moderate data volumes**
- Performance may degrade with very large datasets (10,000+ services/assets)
- No specific scalability guarantees or load testing

### Concurrent Access
- Supports moderate concurrent users
- No defined SLA for concurrent access
- Performance may vary with number of concurrent users

### Browser Support
- Designed for modern browsers
- May not support older browser versions

---

## 💼 Business Process Assumptions

### Data Quality
- Basic validation exists (required fields, percentage totals)
- No comprehensive data completeness checks before costing runs
- No validation of data accuracy or reasonableness

### User Access
- Basic role-based access control
- Permissions are not granular per module/action
- Limited configurable permissions

---

## ✅ What IS Included

### Core Functionality
- ✅ Asset Class, Asset Type, Asset management
- ✅ Service Group, Service management
- ✅ Cost Group, Budget Line, Cost Element management
- ✅ Vertical management
- ✅ Manual depreciation schedule entry
- ✅ Direct and Indirect asset service mapping
- ✅ Percentage-based cost allocation (Indirect, Common)
- ✅ Service cost calculation (Direct, Depreciation, Indirect, Common)
- ✅ Cost per unit calculation
- ✅ Service costing reports
- ✅ Service level cost reports
- ✅ Budget management (Budget Lines, Service Groups)
- ✅ Hierarchical dashboard view
- ✅ Basic status management (Active/Inactive/Archived/Disposed)
- ✅ Financial year support for budgets
- ✅ CSV export for costing data

---

## ❓ Questions to Clarify with Client

1. **Depreciation**: Is manual entry acceptable, or is automatic calculation required?
2. **Allocation Drivers**: Are percentage-based allocations sufficient, or are other drivers needed?
3. **UOM**: Is single numeric UOM acceptable, or are multiple units with conversions needed?
4. **Service Volumes**: Is service volume tracking required?
5. **Workflows**: Are approval workflows necessary?
6. **Audit Trail**: Is detailed audit trail/versioning required?
7. **Data Import**: Is Excel upload functionality required?
8. **Reporting**: Is budget vs actual comparison reporting required?
9. **Inter-Service**: Is inter-service cost allocation needed?
10. **Revenue/Pricing**: Are revenue/pricing features part of scope?
11. **Data Volumes**: What are expected data volumes (services, assets, cost elements)?
12. **Concurrent Users**: What is the expected number of concurrent users?
13. **Integration**: Is system integration with other systems required?
14. **Scheduled Reports**: Are scheduled reports or automated distribution needed?

---

## 📝 Proposal Language Suggestions

### For Proposal Document:

**"The following assumptions are made regarding the Cost Model system scope and functionality:"**

1. **Depreciation Management**: The system supports manual depreciation entry per year. Automatic depreciation calculation using standard methods (straight-line, declining balance, etc.) is not included in the current scope.

2. **Cost Allocation**: Cost allocation is percentage-based only. Allocation using other drivers (headcount, revenue, usage, custom drivers) is not included in the current scope.

3. **Unit of Measurement**: UOM is implemented as a single numeric value for cost per unit calculation. Multiple units of measurement with conversion factors are not included in the current scope.

4. **Data Entry**: All data entry is manual through UI forms. Excel upload or bulk import functionality is not included in the current scope.

5. **Workflow & Approval**: The system does not include approval workflows, versioning, or period locking features. All changes are immediately effective upon save.

6. **Audit Trail**: The system maintains basic audit information (created_at, updated_at) but does not include detailed audit trails, version history, or effective dating.

7. **Reporting**: The system provides pre-defined reports with CSV export. Custom report builder, scheduled reports, and budget vs actual comparison are not included in the current scope.

8. **Integration**: The system does not include integration with external systems (ERP, accounting systems, etc.). All data is entered manually.

9. **Advanced Features**: The following features are not included: inter-service cost consumption, revenue/pricing management, circular dependency detection, cost sub-groups, and service volume tracking.

10. **Performance**: The system is designed for moderate data volumes. Specific scalability guarantees or load testing for high-volume scenarios are not included in the current scope.

**"Any requirements beyond the above assumptions will be considered as scope changes and may require additional effort and timeline."**

---

## 🎯 Risk Mitigation

### High-Risk Assumptions (Clarify Early)
1. Manual depreciation entry (may be unacceptable to client)
2. Percentage-only allocation (may need other drivers)
3. No Excel upload (may be critical requirement)
4. No approval workflows (may be regulatory requirement)
5. No audit trail (may be compliance requirement)

### Medium-Risk Assumptions (Document Clearly)
1. Real-time calculations (may need pre-calculation for performance)
2. No versioning (may need scenario management)
3. Limited reporting (may need custom reports)
4. No integration (may need system connectivity)

### Low-Risk Assumptions (Standard Practice)
1. Modern browser support
2. Moderate data volumes
3. Basic RBAC
4. CSV export format







