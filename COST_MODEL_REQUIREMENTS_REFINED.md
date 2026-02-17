# Cost Model Functional Requirements (Refined Based on Implementation)

This document provides refined functional requirements based on the actual implementation of the Cost Model system.

---

## 3.1 Asset & Depreciation Management

### 3.1.1 Asset Class & Asset Type Management
- The system shall allow authorized users to create, edit, deactivate, and view Asset Classes with unique auto-generated codes, names, descriptions, and status (Active/Inactive/Archived).
- The system shall prevent deletion of an Asset Class if it is referenced by any Asset Type or Asset.
- The system shall allow users to create Asset Types under an Asset Class with name, description, and status.
- The system shall prevent changing the Asset Class of an Asset Type after creation.
- The system shall maintain basic audit information (created_at, updated_at) for all changes to Asset Classes and Asset Types.
- The system shall prevent duplicate Asset Class and Asset Type names (case-insensitive matching).

### 3.1.2 Asset Master Management
- The system shall allow users to create and maintain individual asset records with:
  - Asset code (auto-generated), asset name, description
  - Asset type (required, immutable after creation)
  - Cost of acquisition, date of acquisition
  - Asset life (in years)
  - Service mapping type: Direct or Indirect
  - Status: Active, Inactive, Archived, or Disposed
  - Notes field
- The system shall allow Direct assets to be linked to a single service (100% allocation).
- The system shall allow Indirect assets to be allocated across multiple services with percentage-based allocations (total must equal 100%).
- The system shall prevent deletion of assets that are referenced in cost calculations.
- The system shall prevent changing the Asset Type of an asset after creation.

### 3.1.3 Depreciation Handling
- The system shall support manual depreciation entry for assets with multi-year schedules.
- The system shall auto-generate depreciation schedule structure based on Asset Life and Acquisition Date (creates year entries).
- The system shall allow manual entry of depreciation amount for each year in the schedule.
- The system shall auto-calculate closing values based on opening value minus depreciation.
- The system shall auto-calculate opening values for subsequent years based on previous year's closing value.
- The system shall validate that all years in the depreciation schedule have depreciation values entered before allowing asset save.
- The system shall support year-wise depreciation retrieval for cost calculations (based on current calendar year).
- The system shall maintain depreciation schedule as part of asset record (stored as JSON).

---

## 3.2 Service & Capacity Management

### 3.2.1 Service Master Management
- The system shall allow users to create, edit, deactivate, and view services with:
  - Service code (auto-generated), name, description
  - Service group (required, immutable after creation)
  - Unit of Measurement (UOM) - numeric value
  - Status: Active, Inactive, or Archived
- The system shall prevent deletion of services that are referenced in cost calculations, allocation rules, or asset mappings.
- The system shall allow services to be marked inactive while preserving historical costing and reporting data.
- The system shall prevent changing the Service Group of a service after creation.
- The system shall prevent duplicate service names (case-insensitive matching).

### 3.2.2 Service Group Management
- The system shall allow users to create, edit, and view Service Groups with:
  - Group ID (auto-generated), name, description
  - Vertical (required, immutable after creation)
  - Status: Active, Inactive, or Archived
- The system shall prevent deletion of Service Groups that have associated Services.
- The system shall support budget management at Service Group level with financial year-based budgets.

### 3.2.3 Unit of Measurement & Volume Management
- The system shall allow users to define a single numeric Unit of Measurement (UOM) value for each service.
- The system shall use UOM for cost per unit calculations (Total Cost / UOM).
- The system shall display cost per unit in service costing reports when UOM is greater than zero.

---

## 3.3 Vertical Structure & Realignment

### 3.3.1 Vertical Master Management
- The system shall allow users to create and maintain verticals with name, description, and status (Active/Inactive/Archived).
- The system shall auto-generate unique Vertical IDs.
- The system shall allow assignment of Cost Groups, Service Groups, and related entities to verticals.
- The system shall prevent deletion of verticals that have associated Cost Groups or Service Groups.
- The system shall prevent changing the Vertical of Cost Groups and Service Groups after creation.

---

## 3.4 Cost Structure & Cost Element Management

### 3.4.1 Cost Groups, Budget Lines & Cost Elements
- The system shall allow users to create and maintain Cost Groups with:
  - Cost Group ID (auto-generated), name, description
  - Vertical (required, immutable after creation)
  - Status: Active, Inactive, or Archived
- The system shall allow users to create and maintain Budget Lines with:
  - Budget Line ID (auto-generated), name, description
  - Cost Group (required, immutable after creation)
  - Status: Active, Inactive, or Archived
  - Financial year-based budget amounts (optional)
- The system shall allow users to create and maintain Cost Elements with:
  - Cost Element ID (auto-generated), name, description
  - Budget Line (required, immutable after creation)
  - Cost Type: Direct, Indirect, or Common (immutable after creation)
  - For Direct Cost Elements: Service (required)
  - Type: Budgeted or Actual
  - For Budgeted: Financial Year (required)
  - Amount (required)
  - Status: Active, Inactive, or Archived
- The system shall prevent deletion of Cost Elements that have associated allocation rules or are referenced in cost calculations.
- The system shall prevent changing the Budget Line and Cost Type of a Cost Element after creation.

### 3.4.2 Cost Element Allocation Configuration
- The system shall require Direct Cost Elements to be linked to a single service at creation.
- The system shall require Indirect and Common Cost Elements to be allocated to services via Cost Rules (percentage-based allocation).
- The system shall validate that allocation percentages total 100% for Indirect and Common cost elements before allowing cost calculations.
- The system shall provide visual indicators (Allocated/Incomplete/Not Set) for allocation status of Indirect and Common cost elements.

---

## 3.5 Indirect Cost Allocation Management

### 3.5.1 Allocation Rules
- The system shall allow configuration of Indirect cost element allocation using percentage-based drivers only.
- The system shall allow users to create allocation rules for Indirect cost elements with:
  - Multiple service allocations
  - Percentage allocation per service
  - Validation that total percentage equals 100%
- The system shall provide real-time validation of percentage totals during rule configuration.
- The system shall display allocated monetary amount per service (Cost Element Amount × Percentage / 100).
- The system shall allow add, edit, and delete of service allocations within a single transaction.
- The system shall save all allocation changes together (batch save).

---

## 3.6 Common Cost Allocation Management

### 3.6.1 Common Cost Rules
- The system shall allow configuration of Common cost element allocation using percentage-based drivers only.
- The system shall allow users to create allocation rules for Common cost elements with:
  - Multiple service allocations
  - Percentage allocation per service
  - Validation that total percentage equals 100%
- The system shall provide real-time validation of percentage totals during rule configuration.
- The system shall display allocated monetary amount per service (Cost Element Amount × Percentage / 100).
- The system shall allow add, edit, and delete of service allocations within a single transaction.
- The system shall save all allocation changes together (batch save).

---

## 3.7 Cost Calculation & Reporting

### 3.7.1 Service Cost Calculation
- The system shall calculate service-level costs by aggregating costs from four sources:
  - **Direct Costs**: Sum of all Direct cost elements mapped to the service
  - **Depreciation**: Sum of depreciation from assets (Direct assets: full amount; Indirect assets: allocated percentage)
  - **Indirect Costs**: Sum of allocated Indirect costs (Cost Element Amount × Allocation Percentage / 100)
  - **Common Costs**: Sum of allocated Common costs (Cost Element Amount × Allocation Percentage / 100)
- The system shall calculate Total Service Cost as: Direct Costs + Depreciation + Indirect Costs + Common Costs
- The system shall calculate Cost Per Unit as: Total Cost / UOM (when UOM > 0)
- The system shall use current calendar year for depreciation calculations.

### 3.7.2 Service Costing Reports
- The system shall provide service-wise costing reports with:
  - Service code, name, UOM
  - Direct Costs, Depreciation, Indirect Costs, Common Costs
  - Total Cost and Cost Per Unit
  - Percentage breakdown of each cost component
- The system shall group services by Service Group in tabbed view.
- The system shall provide expandable rows for detailed cost breakdown per service.
- The system shall display group totals and grand totals.
- The system shall support export of costing data to CSV format.

### 3.7.3 Service Level Cost Reports
- The system shall provide a consolidated view of all services with calculated costs.
- The system shall display cost breakdown with visual progress bars for each component.
- The system shall provide grand total summary across all services.
- The system shall support export to CSV format.

### 3.7.4 Service Detail Reports
- The system shall provide detailed service cost breakdown with tabs for:
  - Overview: Total cost summary
  - Direct Costs: List of direct cost elements with amounts
  - Depreciation: List of assets contributing depreciation
  - Indirect Costs: List of indirect cost allocations
  - Common Costs: List of common cost allocations
- The system shall display cost per unit prominently.

### 3.7.5 Service Group Detail Reports
- The system shall provide aggregated cost information for service groups.
- The system shall allow financial year selection for budget and cost views.
- The system shall display rollup cost summary (total, direct, depreciation, indirect, common).
- The system shall provide expandable list of services within the group.

---

## 3.8 Budget Management

### 3.8.1 Budget Line Budgets
- The system shall allow entry of budget amounts for Budget Lines by financial year.
- The system shall support financial year format (YYYY-YY) with 3 years available (current + 2 future).
- The system shall allow notes to be attached to budgets.
- The system shall prevent changing financial year after budget creation.
- The system shall display budget amounts in Budget Line list view filtered by selected financial year.

### 3.8.2 Service Group Budgets
- The system shall allow entry of budget amounts for Service Groups by financial year.
- The system shall support financial year format (YYYY-YY) with 3 years available (current + 2 future).
- The system shall allow notes to be attached to budgets.
- The system shall allow view and edit of existing budgets.

---

## 3.9 Dashboard & Hierarchy View

### 3.9.1 Cost Model Dashboard
- The system shall provide a hierarchical tree view of the entire cost model structure:
  - Cost Management: Vertical → Cost Group → Budget Line
  - Service Management: Vertical → Service Group → Service
  - Asset Management: Asset Class → Asset Type → Asset
- The system shall support expandable/collapsible tree nodes.
- The system shall provide Expand All / Collapse All functionality.
- The system shall display count badges at each hierarchy level.
- The system shall provide summary statistics cards (Total Verticals, Cost Groups, Budget Lines, Services).

### 3.9.2 Asset Management Hierarchical View
- The system shall provide a tree view of Asset Class → Asset Type → Assets.
- The system shall display assets in card format with key information.
- The system shall provide quick actions (add, edit, delete) at each hierarchy level.
- The system shall disable actions when prerequisites are missing.

---

## 3.10 Data Validation & Business Rules

### 3.10.1 Hierarchy Validation
- The system shall require parent entities to exist before creating child entities.
- The system shall disable UI controls when parent entities are missing.
- The system shall display validation messages when prerequisites are not met.

### 3.10.2 Immutable Field Rules
- The system shall prevent changes to the following fields after entity creation:
  - Asset Type (in Asset)
  - Service Group (in Service)
  - Vertical (in Cost Group, Service Group)
  - Cost Group (in Budget Line)
  - Budget Line (in Cost Element)
  - Cost Type (in Cost Element)
- The system shall display these fields as read-only in edit mode.

### 3.10.3 Percentage Allocation Validation
- The system shall validate that allocation percentages total exactly 100% for:
  - Indirect asset service allocations
  - Indirect cost element service allocations
  - Common cost element service allocations
- The system shall provide real-time validation feedback during entry.
- The system shall prevent save if total does not equal 100%.

### 3.10.4 Depreciation Schedule Validation
- The system shall require depreciation values for all years in the schedule before allowing asset save.
- The system shall validate that depreciation does not exceed opening value for any year.

### 3.10.5 Duplicate Prevention
- The system shall prevent duplicate entity names using case-insensitive matching.
- The system shall keep the most recent record when duplicates are detected.

---

## 3.11 User Interface Features

### 3.11.1 View Patterns
- The system shall support multiple view patterns:
  - **Table View**: Standard tabular display for most list views
  - **Tabbed View**: Grouped display (Asset Types by Asset Class, Budget Lines by Cost Group, etc.)
  - **Accordion View**: Expandable grouped lists (Services by Service Group)
  - **Tree View**: Hierarchical navigation (Dashboard, Asset Management)
  - **Card View**: Visual entity representation (Services, Assets)
  - **Dialog Forms**: Modal dialogs for create/edit operations

### 3.11.2 Interactive Features
- The system shall support expandable rows for detailed cost breakdowns.
- The system shall provide inline editing capabilities where appropriate.
- The system shall display status badges, count badges, and type badges.
- The system shall provide loading indicators during data fetch operations.
- The system shall display user-friendly error messages for all operations.

### 3.11.3 Export Functionality
- The system shall support export of service costing data to CSV format.
- The system shall include all cost components and cost per unit in exports.
- The system shall include financial year in export filename where applicable.

---

## 3.12 Status Management

### 3.12.1 Entity Status
- The system shall support status management for all master data entities:
  - **Active**: Entity is in use and included in calculations
  - **Inactive**: Entity is temporarily disabled
  - **Archived**: Entity is no longer in use but retained for historical data
  - **Disposed**: Special status for assets that have been disposed
- The system shall filter active entities in cost calculations by default.
- The system shall preserve historical data when entities are marked inactive or archived.

---

## 3.13 Financial Year Handling

### 3.13.1 Financial Year Support
- The system shall support financial year format (YYYY-YY) for:
  - Budget Line budgets
  - Cost Element budgets (Budgeted type)
  - Service Group budgets
- The system shall auto-generate financial year options (current + 2 future years).
- The system shall default to current financial year in selectors.
- The system shall prevent changing financial year after budget creation.

---

## Non-Functional Requirements

### NFR-1: Data Integrity
- The system shall maintain referential integrity for all parent-child relationships.
- The system shall prevent deletion of entities that are referenced by other entities.
- The system shall validate all business rules before allowing data persistence.

### NFR-2: User Experience
- The system shall provide clear validation messages and error handling for all user actions.
- The system shall display loading states during data operations.
- The system shall provide toast notifications for success and error scenarios.
- The system shall support responsive design for mobile and desktop views.
- The system shall support dark mode theme switching.

### NFR-3: Data Display
- The system shall format all currency values in Indian Rupee (₹) format.
- The system shall display dates in locale-appropriate format.
- The system shall provide appropriate number formatting for percentages and decimals.

### NFR-4: Performance
- The system shall provide efficient data retrieval for hierarchical views.
- The system shall support real-time validation without significant performance impact.

---

## Features NOT Currently Implemented

The following features mentioned in original requirements are **NOT** currently implemented:

1. **Automatic Depreciation Calculation**: System uses manual depreciation entry only
2. **Depreciation Methods**: No support for different depreciation methods (straight-line, declining balance, etc.)
3. **Residual Value**: No support for residual value or residual percentage
4. **Default Depreciation Settings**: Asset Classes and Asset Types do not have default depreciation settings
5. **Version History & Audit Trail**: Only basic created_at/updated_at timestamps, no detailed audit log
6. **Effective Dating**: No support for effective dates on entity changes
7. **Approval Workflows**: No approval process for entity changes
8. **Period Locking**: No support for locking periods or versions
9. **Scenario Versioning**: No support for multiple costing scenarios or versions
10. **Excel Upload**: No bulk upload functionality for cost data or volumes
11. **Multiple UOM**: Only single numeric UOM value, no alternate units or conversion factors
12. **Service Volumes**: No capture of budgeted or actual service volumes
13. **Inter-Service Cost Consumption**: No support for provider-consumer service relationships
14. **Circular Dependency Detection**: No detection of circular cost dependencies
15. **Revenue & Pricing**: No revenue capture, pricing, margin, or profitability features
16. **Cost Sub-Groups**: No support for Cost Sub-Groups (only Cost Groups and Budget Lines)
17. **Domain Field**: No domain field in entities
18. **Billability Flag**: No billability flag for services
19. **Service Type**: No service type classification
20. **Reclassification**: No support for reclassifying cost elements with approval
21. **Allocation Preview**: No preview of allocation impact before activation
22. **Driver Types**: Only percentage-based allocation, no headcount, revenue, usage, or custom drivers
23. **Exclusion of Services**: No support for excluding services from common cost allocation
24. **Budget vs Actual Comparison**: No comparison reporting functionality
25. **Drill-down Reports**: Limited drill-down, mainly through detail views
26. **Role-Based Access Control**: Basic implementation, not fully configurable permissions

---

## Implementation Notes

1. **Depreciation**: Currently implemented as manual entry per year. Automatic calculation based on methods is not implemented.

2. **Cost Allocation**: Only percentage-based allocation is supported. Other driver types (headcount, revenue, usage) are not implemented.

3. **Financial Year**: System uses calendar year for depreciation calculations but supports financial year (YYYY-YY) format for budgets.

4. **UOM**: Implemented as a single numeric value used for cost per unit calculation, not as a unit of measurement with conversion factors.

5. **Status Management**: Basic status values (Active/Inactive/Archived/Disposed) are supported but no workflow or approval process.

6. **Data Relationships**: All relationships are enforced through foreign keys and UI validation, but no cascade delete or complex relationship management.

7. **Calculations**: Service cost calculations are performed on-demand and are not stored as separate costing run records.

---

## Critical Assumptions for Proposal

### A.1 Feature Scope Assumptions

#### A.1.1 Depreciation Management
- **Assumption**: Depreciation is entered manually per year. The system does NOT automatically calculate depreciation using methods (straight-line, declining balance, etc.).
- **Impact**: Users must manually enter depreciation amounts for each year. No automatic calculation based on asset life or depreciation methods.
- **Clarification Required**: If automatic depreciation calculation is needed, this would be a separate enhancement requiring additional effort.

#### A.1.2 Cost Allocation Drivers
- **Assumption**: Only percentage-based allocation is supported. No support for headcount, revenue, usage, or custom driver-based allocation.
- **Impact**: All Indirect and Common cost allocations must be configured using percentages that total 100%.
- **Clarification Required**: If other allocation drivers are required, this would require significant additional development.

#### A.1.3 Unit of Measurement (UOM)
- **Assumption**: UOM is a single numeric value used for cost per unit calculation, NOT a unit of measurement with multiple units and conversion factors.
- **Impact**: Services have one numeric UOM value. No support for alternate units (e.g., hours, days, transactions) with conversions.
- **Clarification Required**: If multiple UOM units with conversions are needed, this would require schema changes and additional functionality.

#### A.1.4 Service Volumes
- **Assumption**: The system does NOT capture or manage service volumes (budgeted or actual).
- **Impact**: Cost per unit is calculated using the UOM value, but there's no volume tracking or volume-based cost allocation.
- **Clarification Required**: If volume tracking is required, this would be a new feature requiring data model and UI changes.

#### A.1.5 Financial Year vs Calendar Year
- **Assumption**: Depreciation calculations use calendar year, while budgets use financial year (YYYY-YY format).
- **Impact**: Depreciation is retrieved based on current calendar year, not financial year. Budgets are financial year-based.
- **Clarification Required**: If depreciation should align with financial year, this would require calculation logic changes.

### A.2 Data Management Assumptions

#### A.2.1 Immutable Relationships
- **Assumption**: Key relationships cannot be changed after entity creation:
  - Asset Type (in Asset)
  - Service Group (in Service)
  - Vertical (in Cost Group, Service Group)
  - Cost Group (in Budget Line)
  - Budget Line (in Cost Element)
  - Cost Type (in Cost Element)
- **Impact**: To change these relationships, users must create new entities and potentially archive old ones.
- **Clarification Required**: If relationship changes are needed, this would require data migration and business rule changes.

#### A.2.2 Duplicate Handling
- **Assumption**: Duplicate names are prevented using case-insensitive matching, keeping the most recent record.
- **Impact**: Users cannot create entities with the same name (case variations). System automatically deduplicates.
- **Clarification Required**: If different duplicate handling is required (e.g., allow duplicates with different codes), this would need changes.

#### A.2.3 Data Persistence
- **Assumption**: Service cost calculations are performed on-demand and NOT stored as historical costing run records.
- **Impact**: Each time costs are viewed, they are recalculated. No historical snapshots of costing runs are maintained.
- **Clarification Required**: If historical costing run storage is needed, this would require new data model and storage logic.

#### A.2.4 Cascade Deletion
- **Assumption**: Deletion is prevented if entities are referenced by other entities. No automatic cascade deletion.
- **Impact**: Users must manually remove all child entities before deleting parent entities.
- **Clarification Required**: If cascade deletion is required, this would need careful implementation to avoid data loss.

### A.3 Business Process Assumptions

#### A.3.1 Approval Workflows
- **Assumption**: No approval workflows exist. All changes are immediately effective upon save.
- **Impact**: Users can create, edit, and delete entities without approval. No multi-step approval process.
- **Clarification Required**: If approval workflows are required, this would be a major enhancement requiring workflow engine.

#### A.3.2 Versioning & History
- **Assumption**: Only basic audit fields (created_at, updated_at) are maintained. No detailed version history or audit trail.
- **Impact**: Cannot track who made changes, when, or what changed. Cannot revert to previous versions.
- **Clarification Required**: If detailed audit trail or versioning is required, this would require significant database and UI changes.

#### A.3.3 Effective Dating
- **Assumption**: No support for effective dates on entity changes. All changes are immediately effective.
- **Impact**: Cannot schedule changes for future dates. Cannot maintain historical configurations.
- **Clarification Required**: If effective dating is required, this would require temporal data model changes.

#### A.3.4 Period Locking
- **Assumption**: No support for locking periods or versions after approval.
- **Impact**: All data remains editable regardless of approval status or period closure.
- **Clarification Required**: If period locking is required, this would require new locking mechanism and permission system.

### A.4 Calculation & Reporting Assumptions

#### A.4.1 Cost Calculation Timing
- **Assumption**: Service costs are calculated in real-time when requested, not pre-calculated or stored.
- **Impact**: Cost views may take time to load if there are many services/assets. No pre-aggregated cost data.
- **Clarification Required**: If pre-calculation or caching is needed for performance, this would require background job processing.

#### A.4.2 Year Selection for Depreciation
- **Assumption**: Depreciation is retrieved for current calendar year only. No year selector for depreciation in cost views.
- **Impact**: Cost reports show depreciation for current year. Cannot view historical or future year depreciation in cost calculations.
- **Clarification Required**: If multi-year depreciation views are needed, this would require calculation logic changes.

#### A.4.3 Budget vs Actual Comparison
- **Assumption**: No built-in budget vs actual comparison reports or variance analysis.
- **Impact**: Users must manually compare budget amounts with actual costs. No automated variance calculations.
- **Clarification Required**: If budget vs actual reporting is required, this would be a new reporting feature.

#### A.4.4 Scenario Management
- **Assumption**: No support for multiple costing scenarios or versions within the same period.
- **Impact**: Only one set of costs can be calculated at a time. Cannot compare "what-if" scenarios.
- **Clarification Required**: If scenario management is required, this would require significant data model and calculation engine changes.

### A.5 Integration & Data Import Assumptions

#### A.5.1 Excel Upload
- **Assumption**: No bulk upload functionality via Excel. All data entry is manual through UI forms.
- **Impact**: Users must enter data one record at a time. No batch import capability.
- **Clarification Required**: If Excel upload is required, this would require file parsing, validation, and import logic.

#### A.5.2 External System Integration
- **Assumption**: No integration with external systems (ERP, accounting systems, etc.). All data is entered manually.
- **Impact**: Data must be manually entered or copied from other systems. No automated data sync.
- **Clarification Required**: If system integration is required, this would require API development and integration work.

#### A.5.3 Data Export
- **Assumption**: Export is limited to CSV format for service costing data. No other export formats or comprehensive data export.
- **Impact**: Users can export costing reports to CSV only. No Excel templates, PDF reports, or full data dumps.
- **Clarification Required**: If additional export formats are required, this would require export functionality development.

### A.6 User Access & Security Assumptions

#### A.6.1 Role-Based Access Control
- **Assumption**: Basic role-based access exists but is not fully configurable. Permissions are not granular per module/action.
- **Impact**: Access control may be limited. Cannot configure fine-grained permissions per user role.
- **Clarification Required**: If detailed permission management is required, this would require RBAC system enhancement.

#### A.6.2 Multi-Entity Support
- **Assumption**: System supports entity-level isolation (entity_id field) but multi-entity features may be limited.
- **Impact**: Data isolation exists at database level, but UI may not fully support multi-entity switching.
- **Clarification Required**: If full multi-entity support is required, this would need UI and routing changes.

### A.7 Technical Assumptions

#### A.7.1 Data Volume
- **Assumption**: System is designed for moderate data volumes. Performance may degrade with very large datasets (10,000+ services, assets, etc.).
- **Impact**: Large datasets may result in slower load times, especially for hierarchical views and cost calculations.
- **Clarification Required**: If high-volume performance is critical, this would require performance optimization and possibly pagination.

#### A.7.2 Concurrent Users
- **Assumption**: System supports moderate concurrent user access. No specific load testing or scalability guarantees.
- **Impact**: Performance may vary with number of concurrent users. No defined SLA for concurrent access.
- **Clarification Required**: If high concurrency is required, this would need load testing and optimization.

#### A.7.3 Browser Compatibility
- **Assumption**: System is designed for modern browsers. May not support older browser versions.
- **Impact**: Users on older browsers may experience issues.
- **Clarification Required**: If specific browser support is required, this should be tested and documented.

### A.8 Business Logic Assumptions

#### A.8.1 Circular Dependency Detection
- **Assumption**: No detection or prevention of circular cost dependencies (e.g., Service A consumes Service B, Service B consumes Service A).
- **Impact**: Users must manually ensure no circular dependencies exist. System will calculate costs even if circular dependencies exist, potentially causing infinite loops.
- **Clarification Required**: If circular dependency detection is required, this would need graph traversal algorithms.

#### A.8.2 Inter-Service Cost Consumption
- **Assumption**: No support for inter-service cost allocation (provider-consumer relationships between services).
- **Impact**: Services cannot consume costs from other services. All costs flow directly to services from cost elements and assets.
- **Clarification Required**: If inter-service costing is required, this would be a major feature addition.

#### A.8.3 Revenue & Pricing
- **Assumption**: No revenue capture, pricing management, margin calculation, or profitability analysis features.
- **Impact**: System calculates costs only. No revenue, pricing, or profitability features.
- **Clarification Required**: If revenue/pricing features are required, this would be a separate module requiring significant development.

### A.9 Data Quality Assumptions

#### A.9.1 Data Completeness Validation
- **Assumption**: Basic validation exists (required fields, percentage totals), but no comprehensive data completeness checks before costing runs.
- **Impact**: Users must manually ensure all required data is entered. System may calculate costs with incomplete data.
- **Clarification Required**: If data completeness validation is required, this would need validation rules and pre-run checks.

#### A.9.2 Data Accuracy
- **Assumption**: System performs calculations based on entered data. No validation of data accuracy or reasonableness.
- **Impact**: System will calculate costs even if data seems incorrect (e.g., very high depreciation, negative amounts if allowed).
- **Clarification Required**: If data accuracy validation is required, this would need business rule validation.

### A.10 Reporting Assumptions

#### A.10.1 Report Customization
- **Assumption**: Reports are pre-defined. No ad-hoc report builder or custom report creation.
- **Impact**: Users can only view pre-built reports. Cannot create custom reports or modify report layouts.
- **Clarification Required**: If report customization is required, this would require report builder functionality.

#### A.10.2 Drill-Down Capability
- **Assumption**: Limited drill-down through detail views. No comprehensive drill-down from summary to detail across all dimensions.
- **Impact**: Users can view service details but drill-down is limited to specific views.
- **Clarification Required**: If comprehensive drill-down is required, this would need enhanced navigation and data linking.

#### A.10.3 Scheduled Reports
- **Assumption**: No support for scheduled or automated report generation and distribution.
- **Impact**: Reports must be manually generated. No email distribution or scheduled execution.
- **Clarification Required**: If scheduled reports are required, this would need job scheduling and email functionality.

---

## Proposal Recommendations

### Explicitly State in Proposal:

1. **Scope Boundaries**: Clearly list what is included vs. not included
2. **Manual Processes**: Highlight features that require manual data entry (depreciation, allocations)
3. **Calculation Limitations**: Specify that calculations are real-time, not stored
4. **No Automation**: Emphasize lack of automatic depreciation, approval workflows, versioning
5. **Single Allocation Method**: Only percentage-based allocation is supported
6. **Basic UOM**: UOM is numeric value only, not unit of measurement
7. **No Integration**: All data entry is manual, no system integration
8. **Limited Reporting**: Pre-defined reports only, no custom report builder
9. **No Historical Tracking**: No detailed audit trail or version history
10. **Performance Expectations**: Moderate data volumes, no specific scalability guarantees

### Questions to Clarify with Client:

1. Is manual depreciation entry acceptable, or is automatic calculation required?
2. Are percentage-based allocations sufficient, or are other drivers needed?
3. Is single numeric UOM acceptable, or are multiple units with conversions needed?
4. Is service volume tracking required?
5. Are approval workflows necessary?
6. Is detailed audit trail/versioning required?
7. Is Excel upload functionality required?
8. Is budget vs actual comparison reporting required?
9. Is inter-service cost allocation needed?
10. Are revenue/pricing features part of scope?
11. What are the expected data volumes (services, assets, cost elements)?
12. What is the expected number of concurrent users?
13. Is system integration with other systems required?
14. Are scheduled reports or automated distribution needed?

