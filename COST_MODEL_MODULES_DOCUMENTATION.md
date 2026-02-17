# Cost Model Modules Documentation

This document provides a comprehensive breakdown of all functional modules and sub-modules within the Cost Model section of the application. This documentation is intended for effort estimation purposes.

## Table of Contents
1. [All Modules & Sub-Modules](#all-modules--sub-modules)
2. [Cross-Module Features](#cross-module-features)
3. [Data Relationships & Dependencies](#data-relationships--dependencies)
4. [Calculation Logic](#calculation-logic)
5. [User Interface Patterns](#user-interface-patterns)
6. [Business Rules & Validations](#business-rules--validations)
7. [Notes for Estimation](#notes-for-estimation)

---

## All Modules & Sub-Modules

| Module | Sub-Module | Functional Description | Key Features |
|--------|------------|------------------------|--------------|
| **Verticals Master** | Create Vertical | Create new business vertical/organizational unit | - Name, Description, Status fields<br>- Auto-generated Vertical ID<br>- Validation for required fields |
| | Edit Vertical | Modify existing vertical details | - Update name, description, status<br>- Preserve Vertical ID (immutable) |
| | Delete Vertical | Remove vertical from system | - Confirmation dialog<br>- Cascade validation (check for dependent records) |
| | List/View Verticals | Display all verticals in tabular format | - Sortable table<br>- Search/filter capability<br>- Status badges<br>- Created date display |
| | Duplicate Detection | Prevent duplicate vertical names | - Case-insensitive name matching<br>- Keep most recent record |
| **Asset Class** | Create Asset Class | Create top-level asset classification | - Name, Description, Status<br>- Auto-generated Class ID<br>- Validation for required fields |
| | Edit Asset Class | Modify asset class details | - Update name, description, status<br>- Preserve Class ID |
| | Delete Asset Class | Remove asset class | - Confirmation dialog<br>- Check for dependent Asset Types |
| | List Asset Classes | Display all asset classes | - Table view with Class ID, Name, Description<br>- Created date<br>- Status badges |
| **Asset Type** | Create Asset Type | Create asset type under an asset class | - Select Asset Class (required)<br>- Name, Description, Status<br>- Auto-generated Type ID<br>- Asset Class cannot be changed after creation |
| | Edit Asset Type | Modify asset type details | - Update name, description, status<br>- Asset Class is read-only |
| | Delete Asset Type | Remove asset type | - Confirmation dialog<br>- Check for dependent Assets |
| | List Asset Types | Display asset types grouped by Asset Class | - Tabbed view by Asset Class<br>- Count badges per class<br>- Table with Type ID, Name, Description |
| **Asset** | Create Asset | Create individual asset record | - Select Asset Type (required, immutable after creation)<br>- Asset Code, Name, Description<br>- Cost of Acquisition, Date of Acquisition<br>- Asset Life (years)<br>- Service Mapping (Direct/Indirect)<br>- Status (Active/Inactive/Archived/Disposed)<br>- Notes field<br>- Depreciation Schedule setup |
| | Edit Asset | Modify asset details | - All fields editable except Asset Type<br>- Update depreciation schedule<br>- Modify service mapping |
| | Delete Asset | Remove asset | - Confirmation dialog |
| | List Assets | Display assets grouped by Asset Type | - Tabbed view by Asset Type<br>- Table with Asset Code, Name, Service, Cost, Date, Asset Life<br>- Status badges |
| | Depreciation Schedule Management | Manage multi-year depreciation | - Auto-generate schedule based on Asset Life and Acquisition Date<br>- Manual entry of depreciation per year<br>- Auto-calculate closing values<br>- Opening value = previous year's closing value<br>- Validation: All years must have depreciation values |
| | Service Mapping - Direct | Map asset to single service | - Select one service from dropdown<br>- 100% allocation to that service |
| | Service Mapping - Indirect | Allocate asset across multiple services | - Add multiple services with percentage allocation<br>- Validation: Total must equal 100%<br>- Real-time percentage validation<br>- Add/Edit/Delete service allocations<br>- Display allocated amount per service |
| **Asset Management (Hierarchical View)** | Tree View | Hierarchical display of Asset Class → Asset Type → Assets | - Expandable/collapsible tree structure<br>- Expand All / Collapse All buttons<br>- Count badges at each level<br>- Visual hierarchy with icons |
| | Quick Actions | Quick access to create/edit/delete | - Dropdown menu for Add operations<br>- Inline edit/delete buttons at each level<br>- Context-aware actions (disable if prerequisites missing) |
| | Asset Card View | Display asset details in card format | - Asset name, code, cost, acquisition date<br>- Asset life, status<br>- Quick edit/delete actions |
| **Service Group** | Create Service Group | Create service grouping under a vertical | - Select Vertical (required, immutable after creation)<br>- Name, Description, Status<br>- Auto-generated Group ID |
| | Edit Service Group | Modify service group details | - Update name, description, status<br>- Vertical is read-only |
| | Delete Service Group | Remove service group | - Confirmation dialog<br>- Check for dependent Services |
| | List Service Groups | Display all service groups | - Table with Vertical, Group ID, Name, Description<br>- Created date<br>- Status badges |
| **Service** | Create Service | Create individual service under service group | - Select Service Group (required, immutable after creation)<br>- Name, Description<br>- Unit of Measurement (UOM) - numeric value<br>- Status (Active/Inactive/Archived) |
| | Edit Service | Modify service details | - Update name, description, UOM, status<br>- Service Group is read-only |
| | Delete Service | Remove service | - Confirmation dialog |
| | List Services | Display services grouped by Service Group | - Accordion view by Service Group<br>- Card layout for each service<br>- Display: Name, Service ID, Description, UOM, Status<br>- Show Total Cost and Cost Per Unit (if calculated)<br>- Quick actions: Edit, View Details, Delete |
| | Service Detail View | Detailed view of a single service | - Service information header<br>- Cost breakdown tabs: Overview, Direct Costs, Depreciation, Indirect Costs, Common Costs<br>- Cost elements table with amounts<br>- Assets table (direct and indirect allocations)<br>- Depreciation details per asset<br>- Total cost summary<br>- Cost per unit calculation |
| **Service Group Detail** | Service Group Overview | View aggregated information for a service group | - Service group information<br>- Financial year selector<br>- Budget management (set/edit budget per financial year)<br>- Rollup cost summary (total, direct, depreciation, indirect, common) |
| | Service Breakdown | Expandable list of services in the group | - Expandable rows for each service<br>- Service cost summary<br>- Quick view of cost components<br>- Link to detailed service view |
| | Budget Management | Set and manage budgets for service group | - Financial year selection<br>- Budget amount entry<br>- Notes field<br>- View/edit existing budgets |
| **Cost Group** | Create Cost Group | Create cost grouping under a vertical | - Select Vertical (required, immutable after creation)<br>- Name, Description, Status<br>- Auto-generated Cost Group ID |
| | Edit Cost Group | Modify cost group details | - Update name, description, status<br>- Vertical is read-only |
| | Delete Cost Group | Remove cost group | - Confirmation dialog<br>- Check for dependent Budget Lines |
| | List Cost Groups | Display all cost groups | - Table with Vertical, Cost Group ID, Name, Description<br>- Created date<br>- Status badges |
| **Budget Line** | Create Budget Line | Create budget line under a cost group | - Select Cost Group (required, immutable after creation)<br>- Name, Description, Status<br>- Auto-generated Budget Line ID |
| | Edit Budget Line | Modify budget line details | - Update name, description, status<br>- Cost Group is read-only |
| | Delete Budget Line | Remove budget line | - Confirmation dialog<br>- Check for dependent Cost Elements |
| | List Budget Lines | Display budget lines grouped by Cost Group | - Tabbed view by Cost Group<br>- Financial year selector<br>- Table with Budget Line ID, Name, Description<br>- Display budget amount for selected financial year<br>- Budget set/edit indicator |
| | Budget Management | Set budgets for budget lines | - Financial year selection (3 years: current + 2 future)<br>- Budget amount entry<br>- Notes field<br>- View/edit existing budgets per financial year<br>- Financial year cannot be changed after creation |
| **Cost Element** | Create Cost Element | Create cost element under a budget line | - Select Budget Line (required, immutable after creation)<br>- Name, Description<br>- Cost Type: Direct/Indirect/Common (immutable after creation)<br>- For Direct: Select Service (required)<br>- Type: Budgeted or Actual<br>- If Budgeted: Financial Year (required)<br>- Amount (required)<br>- Status |
| | Edit Cost Element | Modify cost element details | - Update name, description, amount, status<br>- Budget Line and Cost Type are read-only<br>- Service can be updated for Direct costs<br>- Financial year can be updated for Budgeted costs |
| | Delete Cost Element | Remove cost element | - Confirmation dialog |
| | List Cost Elements | Display cost elements grouped by Budget Line | - Tabbed view by Budget Line<br>- Table with Cost Element ID, Name, Amount, Cost Type, Service<br>- Cost type badges<br>- Currency formatting |
| | Cost Type Validation | Ensure proper cost type configuration | - Direct costs must have service<br>- Indirect/Common costs cannot have service at creation<br>- Budgeted costs require financial year |
| **Cost Rules** | Indirect Cost Allocation | Allocate Indirect cost elements to services | - Select Indirect cost element<br>- Add multiple services with percentage allocation<br>- Validation: Total percentage must equal 100%<br>- Real-time percentage validation<br>- Display allocated amount per service (based on cost element amount)<br>- Add/Edit/Delete service allocations<br>- Save all changes at once |
| | Common Cost Allocation | Allocate Common cost elements to services | - Select Common cost element<br>- Add multiple services with percentage allocation<br>- Validation: Total percentage must equal 100%<br>- Real-time percentage validation<br>- Display allocated amount per service<br>- Add/Edit/Delete service allocations<br>- Save all changes at once |
| | Allocation Status Indicator | Visual indicator of allocation completeness | - "Allocated" badge (100% allocated)<br>- "Incomplete" badge with percentage (partial allocation)<br>- "Not Set" badge (no allocations) |
| | Cost Element Details Display | Show cost element information in allocation dialog | - Cost element name, ID, type<br>- Budgeted/Actual indicator<br>- Financial year (if budgeted)<br>- Total amount<br>- Cost type badge |
| | Percentage Management | Manage allocation percentages | - Inline editing of percentages<br>- Validation against 100% total<br>- Prevent exceeding 100%<br>- Show remaining percentage available |
| | Allocated Amount Calculation | Calculate monetary allocation per service | - Percentage × Cost Element Amount<br>- Display in currency format<br>- Total allocated amount summary |
| **Service Costing** | Service Cost List | Display all services with calculated costs | - Grouped by Service Group (tabs)<br>- Expandable rows for cost breakdown<br>- Financial year display<br>- Export to CSV functionality |
| | Cost Breakdown View | Detailed cost components per service | - Direct Costs with percentage<br>- Depreciation with percentage<br>- Indirect Costs with percentage<br>- Common Costs with percentage<br>- Visual progress bars for each component<br>- Total Cost display<br>- Cost Per Unit calculation |
| | Service Cost Detail Dialog | Detailed view of service cost calculation | - Full cost breakdown<br>- Cost elements list<br>- Assets list with depreciation<br>- Year-wise view |
| | Group Totals | Aggregated costs per service group | - Group total row in table<br>- Grand total across all groups |
| | Export Functionality | Export costing data to CSV | - All service costs<br>- All cost components<br>- Cost per unit<br>- Year in filename |
| **Service Level Cost** | Service Cost Overview | Display all services with total costs | - Single table view<br>- Expandable rows for details<br>- Export to CSV |
| | Cost Component Display | Show cost breakdown in expanded view | - Direct Costs with percentage and progress bar<br>- Depreciation with percentage and progress bar<br>- Indirect Costs with percentage and progress bar<br>- Common Costs with percentage and progress bar<br>- Total Cost and Cost Per Unit prominently displayed |
| | Grand Total Summary | Overall cost summary | - Total Direct Costs<br>- Total Depreciation<br>- Total Indirect Costs<br>- Total Common Costs<br>- Grand Total<br>- Percentage breakdown of each component |
| | Export Functionality | Export service level costs to CSV | - All services<br>- All cost components<br>- Cost per unit |
| **Service Detail** | Service Information | Display service master data | - Service name, ID, description<br>- Service Group information<br>- UOM, Status |
| | Cost Overview Tab | Summary of service costs | - Total Cost, Cost Per Unit<br>- Breakdown by component type<br>- Year information |
| | Direct Costs Tab | List of direct cost elements | - Cost element name, type, amount<br>- Budgeted/Actual indicator<br>- Financial year (if applicable) |
| | Depreciation Tab | List of assets contributing depreciation | - Asset name, code<br>- Depreciation amount for current year<br>- Allocation percentage (for indirect assets)<br>- Total depreciation from asset |
| | Indirect Costs Tab | List of indirect cost allocations | - Cost element name<br>- Allocated amount (based on percentage)<br>- Source cost element amount and percentage |
| | Common Costs Tab | List of common cost allocations | - Cost element name<br>- Allocated amount (based on percentage)<br>- Source cost element amount and percentage |
| **Service Group Detail** | Service Group Information | Display service group master data | - Service group name, ID<br>- Vertical information<br>- Description |
| | Financial Year Selection | Select financial year for budget and costs | - Dropdown with 3 years (current + 2 future)<br>- Auto-default to current financial year |
| | Budget Management | Set and view budgets | - Budget amount per financial year<br>- Notes field<br>- Create/Edit budget dialog |
| | Cost Rollup Summary | Aggregated costs for all services in group | - Total Cost<br>- Direct Costs subtotal<br>- Depreciation subtotal<br>- Indirect Costs subtotal<br>- Common Costs subtotal |
| | Service List with Costs | Expandable list of services | - Service name, cost summary<br>- Expand to see detailed breakdown<br>- Link to full service detail view |
| **Cost Model Dashboard** | Hierarchy Tree View | Visual representation of entire cost model structure | - Expandable/collapsible tree<br>- Two main branches:<br>  - Cost Management: Vertical → Cost Group → Budget Line<br>  - Service Management: Vertical → Service Group → Service<br>- Asset Management: Asset Class → Asset Type → Asset<br>- Expand All / Collapse All buttons<br>- Count badges at each level<br>- Icons for visual distinction |
| | Summary Statistics Cards | Key metrics overview | - Total Verticals count<br>- Total Cost Groups count<br>- Total Budget Lines count<br>- Total Services count<br>- Card-based layout with icons |
| | Navigation | Quick access to detailed views | - Click on tree nodes to navigate<br>- Visual hierarchy representation |

---

## Cross-Module Features

| Feature | Description | Modules Affected |
|---------|-------------|------------------|
| **Status Management** | Active/Inactive/Archived status for all entities | All master data modules |
| **Duplicate Detection** | Case-insensitive name matching, keep most recent | Verticals, Asset Classes, Asset Types, Assets, Service Groups, Services, Cost Groups, Budget Lines, Cost Elements |
| **Auto-Generated IDs** | System-generated unique identifiers | All master data entities |
| **Financial Year Handling** | Support for financial year (April-March) | Budget Lines, Cost Elements, Service Group Budgets |
| **Currency Formatting** | Indian Rupee (₹) formatting | All cost-related displays |
| **Validation** | Form validation and business rule validation | All create/edit operations |
| **Confirmation Dialogs** | Delete confirmation for all entities | All delete operations |
| **Loading States** | Loading indicators during data fetch | All list views |
| **Error Handling** | User-friendly error messages | All API operations |
| **Toast Notifications** | Success/error notifications | All create/update/delete operations |
| **Responsive Design** | Mobile-friendly layouts | All views |
| **Dark Mode Support** | Theme switching capability | All UI components |

---

## Data Relationships & Dependencies

| Parent Entity | Child Entity | Dependency Rule |
|---------------|--------------|-----------------|
| Vertical | Cost Group | Cost Group requires Vertical |
| Vertical | Service Group | Service Group requires Vertical |
| Cost Group | Budget Line | Budget Line requires Cost Group |
| Budget Line | Cost Element | Cost Element requires Budget Line |
| Service Group | Service | Service requires Service Group |
| Asset Class | Asset Type | Asset Type requires Asset Class |
| Asset Type | Asset | Asset requires Asset Type |
| Service | Cost Element (Direct) | Direct Cost Element requires Service |
| Cost Element (Indirect/Common) | Cost Rule | Cost Rule requires Cost Element |
| Asset | Asset Service Allocation | Indirect Asset requires Service Allocations |
| Service | Service Cost Calculation | Service Cost aggregates from multiple sources |

---

## Calculation Logic

| Calculation | Description | Formula/Logic |
|-------------|-------------|---------------|
| **Service Direct Costs** | Sum of all Direct cost elements mapped to service | Sum of Cost Element amounts where Cost Type = 'Direct' AND Service ID = Service ID |
| **Service Depreciation** | Sum of depreciation from assets | For Direct assets: Full depreciation amount<br>For Indirect assets: (Asset Depreciation × Allocation Percentage) / 100 |
| **Service Indirect Costs** | Sum of allocated Indirect costs | Sum of (Cost Element Amount × Allocation Percentage) / 100 for all Indirect cost elements allocated to service via Cost Rules |
| **Service Common Costs** | Sum of allocated Common costs | Sum of (Cost Element Amount × Allocation Percentage) / 100 for all Common cost elements allocated to service via Cost Rules |
| **Service Total Cost** | Total cost for a service | Direct Costs + Depreciation + Indirect Costs + Common Costs |
| **Service Cost Per Unit** | Cost divided by UOM | Total Cost / UOM (if UOM > 0) |
| **Asset Depreciation Schedule** | Year-wise depreciation calculation | Opening Value = Previous Year Closing Value (or Cost of Acquisition for Year 1)<br>Closing Value = Opening Value - Depreciation<br>Depreciation entered manually per year |
| **Allocated Cost Amount** | Monetary allocation from percentage | (Cost Element Amount × Percentage) / 100 |

---

## User Interface Patterns

| Pattern | Usage | Examples |
|---------|-------|----------|
| **Tabbed View** | Group related entities | Asset Types by Asset Class, Budget Lines by Cost Group, Cost Elements by Budget Line, Services by Service Group |
| **Accordion View** | Expandable grouped lists | Services by Service Group |
| **Tree View** | Hierarchical navigation | Cost Model Dashboard, Asset Management |
| **Card View** | Visual entity representation | Services, Assets in hierarchical view |
| **Table View** | Tabular data display | Most list views |
| **Dialog Forms** | Create/Edit operations | All master data entities |
| **Expandable Rows** | Detailed breakdown | Service Costing, Service Level Cost |
| **Badge Indicators** | Status and counts | Status badges, count badges, type badges |

---

## Business Rules & Validations

| Rule Category | Rule Description | Enforcement |
|---------------|-------------------|-------------|
| **Hierarchy** | Parent entities must exist before creating children | UI disable + validation messages |
| **Immutable Fields** | Certain fields cannot be changed after creation | Read-only in edit mode |
| **Percentage Allocation** | Total allocation must equal 100% | Real-time validation + save-time check |
| **Depreciation Schedule** | All years must have depreciation values | Form validation before save |
| **Service Mapping** | Direct mapping requires single service, Indirect requires allocations totaling 100% | Form validation |
| **Financial Year** | Budgeted cost elements require financial year | Required field validation |
| **Cost Type Rules** | Direct costs require service, Indirect/Common cannot have service at creation | Form validation |
| **Duplicate Prevention** | Case-insensitive name matching | Backend + frontend deduplication |

---

## Notes for Estimation

1. **Complexity Factors:**
   - Depreciation schedule management (multi-year calculations)
   - Percentage allocation validation (real-time + save-time)
   - Cost aggregation across multiple sources (Direct, Depreciation, Indirect, Common)
   - Hierarchical data relationships and validation
   - Financial year handling and budget management

2. **UI/UX Considerations:**
   - Multiple view patterns (tables, cards, trees, accordions)
   - Expandable/collapsible sections
   - Real-time validation feedback
   - Loading states and error handling
   - Responsive design requirements
   - Dark mode support

3. **Data Management:**
   - Duplicate detection and handling
   - Cascade validation for dependencies
   - Status management across entities
   - Financial year-based filtering and grouping

4. **Calculation Engine:**
   - Service cost calculation (aggregates from 4 sources)
   - Asset depreciation calculations
   - Percentage-based allocation calculations
   - Cost per unit calculations

5. **Integration Points:**
   - All modules interact through shared entities (Services, Assets, Cost Elements)
   - Cost calculations depend on data from multiple modules
   - Budget management spans multiple entities

