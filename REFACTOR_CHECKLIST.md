# Code Refactor Checklist — Invoice Automation

A practical, ordered list of refactoring tasks for this project. Use alongside `CODE_OPTIMIZATION_SUMMARY.md` for performance and DB work.

---

## 1. Remove duplication (high impact, low effort)

### 1.1 Single INR / currency formatter
- **Current:** `formatINR()` defined in multiple places (e.g. `import-register.tsx`, `goods-movement.tsx`, `igcr-working.tsx`). `lib/utils.ts` has `formatCurrency()` with decimals.
- **Do:** Add `formatINR(value: number, options?: { decimals?: number })` in `client/src/lib/utils.ts` (or extend `formatCurrency`) and use it everywhere. Delete local `formatINR` definitions.
- **Files:** `lib/utils.ts`; all components that define or use `formatINR` / currency.

### 1.2 Shared Customs IGCR styling
- **Current:** Amber theme classes repeated across customs-igcr (`border-amber-200 dark:border-amber-800`, card styles, tab styles).
- **Do:** Define shared class names or a small theme module, e.g. `client/src/styles/customs-igcr.ts` or constants in a shared file:
  - `cardBorder`, `tabsList`, `tableHeader`, etc.
- **Use:** Replace repeated Tailwind strings with these constants or a wrapper component (e.g. `IgcrCard`).

### 1.3 Reusable tab layout for Customs IGCR
- **Current:** Similar tab structure in `dashboards-page.tsx`, `sales-tracking.tsx`, `import-register-page.tsx` (TabsList + TabsTrigger + amber styling).
- **Do:** Extract a small `IgcrTabs` (or `ModuleTabs`) component: same styling, config-driven tabs (value, label, icon, content). Use it in Dashboards, Sales tracking, and Import Register page.

---

## 2. Types and constants

### 2.1 Centralise shared types
- **Current:** Types like `GoodsMovementEntry`, `JobWorkEntry`, `ImportRegisterEntry` live inside feature components; some are exported, some not.
- **Do:** Move shared domain types to a dedicated folder, e.g. `client/src/types/` or `client/src/lib/types/`:
  - `customs-igcr.ts` (or split: `import-register.ts`, `goods-movement.ts`, `igcr-working.ts`) for IGCR-related types.
  - Re-export from components that need them. Keep component-specific types next to the component only if truly local.

### 2.2 Extract mock/data constants
- **Current:** Large mock arrays (e.g. `EXPORTS_INITIAL`, `DTA_INITIAL`, `INITIAL_ENTRIES`, dashboard data) live inside component files.
- **Do:** Move to `client/src/lib/` or `client/src/data/` (e.g. `customs-igcr-mock-data.ts`, `import-register-mock.ts`, `dashboard-mock.ts`). Import in components. Improves readability and makes it easier to swap for API data later.

---

## 3. Component and file structure

### 3.1 Split very large components
- **Current:** Some files are large (e.g. `bom-setup.tsx`, `goods-movement.tsx`, `import-register.tsx`, `igcr-dashboard.tsx`) with multiple sections or tabs in one file.
- **Do:** Split by feature:
  - BOM: Add FG modal, Step 1, Step 2, BOM table, BOM Upload table as separate components or submodules.
  - Goods movement: Keep `GoodsMovementTab` and job-work tab in separate files if they grow (e.g. `goods-movement-tab.tsx`, `goods-movement-job-work-tab.tsx`).
  - Dashboards: Each dashboard (Imports, Goods Movement, IGCR) can stay in its own file (already done); ensure no single file exceeds ~400–500 lines without a good reason.

### 3.2 Route-based code splitting (see CODE_OPTIMIZATION_SUMMARY)
- **Current:** `App.tsx` imports all route components directly → large initial bundle.
- **Do:** Use `React.lazy()` for route-level components (Invoice Tracker, Cost Model, Customs IGCR, BOM, etc.) and wrap with `<Suspense>`. Reduces initial load and improves TTI.

---

## 4. State and routing

### 4.1 Simplify tab / route detection in App.tsx
- **Current:** Long `isCostModel`, `isInvoiceManagement`, etc. with many string checks; big `switch` in `renderCurrentTab()`.
- **Do:** Introduce a small routing config: array or map of `{ tabId: string | RegExp; component: ReactNode; layout?: 'default' | 'customs-igcr' | 'ea' }`. Derive “module” from `currentTab` (e.g. prefix or config lookup) and pick layout + component from config. Reduces branching and makes new modules a config entry.

### 4.2 Avoid duplicating “tab list” in multiple places
- **Current:** Customs IGCR tab IDs appear in sidebar, in `customs-igcr.tsx`, and in `App.tsx` (switch cases).
- **Do:** Single source of truth for “which tabs exist” (e.g. `customs-igcr-tabs.ts` or sidebar config). Sidebar and router both consume this. Adding a new tab = one config change.

---

## 5. Backend and API

### 5.1 Consistent error handling
- **Current:** Many routes use ad hoc `try/catch` and `res.status(500).json({ error: '...' })`.
- **Do:** Centralise: e.g. `handleApiError(error, res)` or an error middleware that maps known errors to status codes and a standard JSON shape. Use it in all API routes.

### 5.2 Request validation
- **Current:** Some endpoints may not validate body/query strictly.
- **Do:** Validate all mutation inputs (e.g. with Zod or existing schema) and return 400 with clear messages. Reduces bad data and unclear failures.

### 5.3 Normalise and document DB (see CODE_OPTIMIZATION_SUMMARY)
- **Do:** Apply the DB section of `CODE_OPTIMIZATION_SUMMARY.md`: indexes, query optimisation, optional caching, and schema normalisation where it makes sense.

---

## 6. Testing and maintainability

### 6.1 Critical paths
- **Do:** Add a few integration or E2E tests for: login/role flow, one cost-model flow, one customs-igcr flow (e.g. open IGCR Working, see totals). Protects refactors.

### 6.2 README and env
- **Do:** Document in README: how to run client/server, required env vars, and (if any) how to run DB migrations or seed data. Keep a single source of truth for “how to run the app”.

---

## 7. Suggested order of work

1. **Phase 1 (quick wins):** 1.1 (formatINR), 1.2 (IGCR styles), 2.1 (shared types for the files you touch), 2.2 (move mock data for one module as a pilot).
2. **Phase 2 (structure):** 1.3 (IgcrTabs), 3.1 (split one large component, e.g. BOM or Import Register), 4.1–4.2 (routing config + single tab list).
3. **Phase 3 (scale):** 3.2 (lazy loading), 5.1–5.2 (API error handling + validation), then DB work from CODE_OPTIMIZATION_SUMMARY.
4. **Phase 4 (quality):** 6.1–6.2 (tests, docs).

---

## 8. What not to do (during refactor)

- Don’t change behaviour or add features in the same PR as structural refactors; keep “move/rename” separate from “change logic”.
- Don’t refactor everything at once; do one area (e.g. “all INR formatting” or “all customs-igcr tabs”) per PR.
- Don’t remove or rewrite the existing CODE_OPTIMIZATION_SUMMARY.md; use this checklist as a complementary, actionable plan and refer to that doc for performance and DB details.
