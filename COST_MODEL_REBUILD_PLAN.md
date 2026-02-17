# Cost Model Rebuild Plan

## Status: IN PROGRESS

### Phase 1: Database Schema ✅ COMPLETED
- [x] Added Cost Model tables to `shared/schema.ts`
  - [x] verticals
  - [x] asset_class
  - [x] asset_type
  - [x] assets
  - [x] asset_service_allocations
  - [x] service_groups
  - [x] services
  - [x] cost_groups
  - [x] budget_lines
  - [x] budgets
  - [x] cost_elements
  - [x] cost_rules
- [x] Added Zod schemas for validation
- [x] Added TypeScript types

### Phase 2: Storage Layer (IN PROGRESS)
- [ ] Update `server/storage.ts` to add Cost Model operations
- [ ] Implement CRUD operations for all Cost Model entities
- [ ] Add calculation methods for service costing
- [ ] Add allocation rule management

### Phase 3: API Routes (PENDING)
- [ ] Create API routes for Verticals
- [ ] Create API routes for Asset Classes/Types/Assets
- [ ] Create API routes for Service Groups/Services
- [ ] Create API routes for Cost Groups/Budget Lines/Cost Elements
- [ ] Create API routes for Cost Allocation Rules
- [ ] Create API routes for Budget Management
- [ ] Create API routes for Service Costing calculations

### Phase 4: React Components (PENDING)
- [ ] Cost Model Dashboard (hierarchical tree view)
- [ ] Verticals Master component
- [ ] Asset Management components (Class, Type, Asset)
- [ ] Service Management components (Group, Service)
- [ ] Cost Structure components (Cost Group, Budget Line, Cost Element)
- [ ] Cost Allocation Rules components
- [ ] Budget Management components
- [ ] Service Costing Reports
- [ ] Service Detail views

### Phase 5: Integration (PENDING)
- [ ] Add Cost Model to app routing
- [ ] Update sidebar navigation
- [ ] Update landing page to link to Cost Model
- [ ] Add Cost Model to entity configuration

## Implementation Notes

- Using PostgreSQL schema (pgTable) to match existing pattern
- All entities include entityId for multi-tenant support
- Auto-generated IDs follow pattern: V001, AC001, AT001, etc.
- Depreciation schedules stored as JSONB
- Financial years in YYYY-YY format (e.g., 2024-25)

## Next Steps

1. Complete storage layer implementation
2. Create API routes
3. Build core components (Dashboard, Master Data CRUD)
4. Add calculation engine
5. Build reporting components

