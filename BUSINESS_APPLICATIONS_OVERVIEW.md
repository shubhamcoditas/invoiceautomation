# Business & Requirements Overview — KPMG One Tax Platform

This document describes the **four business applications** exposed from the main dashboard in this repository. They share a single web client and backend but are presented as distinct product areas with separate navigation, branding where applicable, and role-based behaviour.

---

## Platform context

| Aspect | Description |
|--------|-------------|
| **Product** | **KPMG One Tax Platform** — unified client for tax and automation workflows. |
| **Delivery model** | One SPA (`client`) with tab-based routing; users pick an application from the landing dashboard and work inside that application’s sidebar until they return home. |
| **Entry point** | Landing dashboard (`currentTab: landing`) lists four application cards. |
| **Authentication / roles** | Demo-style app state supports roles such as Application Admin, Admin, Business User, User, and Agent. Behaviour (which screens appear, sign-in gates) varies by application and role. |
| **Backend** | Node/Express API (`server`) with SQLite (`database.ts`) for many entities; shared Drizzle-style schema in `shared/schema.ts` for types and validation. |

---

## 1. Cost Model

### Business purpose

Supports **internal cost control and allocation**: modelling how the organisation structures **verticals**, **assets**, **services**, and **cost elements**, then applying **rules** to understand **service-level** and **budget** impact. Suited to finance, FP&A, and operations teams that need a structured view of indirect and direct cost flows.

### Primary stakeholders

- Finance and cost accounting  
- Business unit / vertical owners  
- IT or operations defining service and asset catalogues  

### Functional areas (as implemented)

| Area | Intent |
|------|--------|
| **Cost Model Dashboard** | Hierarchical overview of verticals → cost groups, services, assets, and related master data. |
| **Master data** | Verticals, asset management hierarchy (asset class, type, assets), service groups, services, cost groups, budget lines, cost elements. |
| **Cost allocation** | Cost rules linking cost elements to allocation logic (e.g. indirect/common patterns). |
| **Reports & analysis** | Service costing and service-level cost views for analysis. |

### Key requirements (business)

1. Maintain a **normalised hierarchy** of organisational and cost objects (verticals, services, assets, budgets).  
2. Support **budget lines** and **cost elements** as the basis for planning and allocation.  
3. Enable **repeatable costing** via configurable **cost rules**.  
4. Provide **read-oriented dashboards** for leadership to drill from high-level verticals into services and assets.  

### Technical note

Master data and dashboards consume REST APIs (e.g. `/api/verticals` and related cost-model endpoints) backed by persisted tables in the application database.

---

## 2. EGAM & Invoice Automation

### Business purpose

End-to-end **invoice visibility and automation** aligned with **EGAM** (repository) concepts: ingest invoices from **QR**, **PDF**, and **email**, consolidate tracking, and expose **validation/notice APIs** for integration or testing. Targets operations teams, AP clerks, and administrators who reconcile GST/e-invoice data.

### Primary stakeholders

- Accounts payable and invoice operations  
- Compliance teams validating e-invoices and IRN data  
- Application admins configuring users, email, and integrations  

### Functional areas (as implemented)

| Area | Intent |
|------|--------|
| **Invoice Tracker** | Consolidated view of invoices across sources (QR, PDF, email), status, and detail. |
| **QR Scanner** | Capture and process QR payloads (e-invoice QR strings). |
| **PDF Upload** | Upload and extract structured data from invoice PDFs. |
| **Email Review Queue** | Workflow for invoices arriving via email. |
| **EGAM Repository** | Central store of fetched/synced EGAM-style invoice records (IRN-centric). |
| **API Playground** | **Validation APIs** and **Notice APIs** for sandbox-style testing. |
| **System (role-gated)** | User management, email settings, API usage (admin), system logs, settings/integrations (application admin). |

### Key requirements (business)

1. **Single pane** for invoice lifecycle visibility (received → processed → success/failure/review).  
2. **Multi-channel ingestion** (QR, PDF, email) with traceable processing history.  
3. **Repository sync** concept for EGAM-aligned pulls and audit.  
4. **API exposure** for downstream validation and statutory notices.  
5. **Governance**: logging, user administration, and configurable email/integrations for enterprise use.  

### Technical note

Core entities include `qr_data`, `pdf_data`, `egam_repository`, `email_data`, tickets, bulk QR batches, PDF processing history, and system/API logs—reflected in API routes and SQLite storage.

---

## 3. EA Invoice Downloader (Emirates Airlines)

### Business purpose

A **dedicated Emirates Airlines workflow** for **invoice download** and **field operations**: administrators manage **agents**, review **tickets**, and inspect **audit logs**; **business users** and **agents** authenticate and use a tailored download experience. Emphasises **role separation** and **auditability** for airline-specific invoice handling.

### Primary stakeholders

- Emirates programme administrators  
- External or internal **agents** performing downloads on behalf of the airline or partners  
- **Business users** with restricted UI (download-focused)  

### Functional areas (as implemented)

| Role / screen | Intent |
|---------------|--------|
| **Admin / Application Admin** | **Agent management** (CRUD-style agent users), **agent tickets**, **audit logs**. |
| **User / Business User** | **Sign-in** gate then **invoice download** UI (`EADownloadInvoice`). |
| **Agent** | **Agent sign-in** then **invoice download** UI (agent mode). |

### Key requirements (business)

1. **Strong role gating**: users and agents must sign in before accessing downloads; admins operate management consoles without the same gate.  
2. **Agent lifecycle**: create and maintain agent accounts tied to entity/company context.  
3. **Ticket management** for operational issues or requests tied to the EA workflow.  
4. **Audit trail** for accountability (who did what, when).  
5. **Brand alignment**: dedicated EA sidebar/header (e.g. Emirates red accents) distinct from the main EGAM shell.  

### Technical note

Application entry sets navigation to EA tabs (`ea-invoice-downloader`, `ea-agent-tickets`, `ea-audit-logs`). App state may normalise role to Admin when entering the EA application for demo purposes. APIs include `/api/agents`, `/api/tickets`, and related user/ticket operations.

---

## 4. Customs IGCR Tool

### Business purpose

Supports **customs and IGCR (Import Goods Compliance / related reporting)** workflows for entities that import goods, track **BOMs**, **goods movement**, **sales**, and **import registers**, and perform **IGCR working** calculations. Oriented toward trade compliance, supply chain, and finance teams operating under customs reporting obligations.

### Primary stakeholders

- Customs and trade compliance  
- Supply chain / logistics  
- Entity onboarding teams registering new legal entities or sites  

### Functional areas (as implemented)

| Tab | Intent |
|-----|--------|
| **Dashboards** | Summary dashboards for IGCR-related KPIs and views. |
| **Entity Onboarding** | Onboarding flows for entities subject to IGCR processes. |
| **Import Register** | Register of imports (e.g. from CAT fetch or PRT upload); line-level fields such as part, BOE, duty, **UOM**. |
| **Goods Movement** | Tracking movement of goods in scope for customs/IGCR. |
| **BOM Setup** | Bill of materials configuration linking components to finished goods. |
| **Sales tracking** | Sales data for reconciliation with import/production narratives. |
| **IGCR Working** | Working area for IGCR calculations and adjustments. |

### Key requirements (business)

1. **End-to-end IGCR data model** from onboarding through imports, BOM, movement, and sales.  
2. **Integration points** (e.g. Customs Automation Tool fetch, PRT file upload) for populating registers—requirements may expand to live APIs.  
3. **Traceability** of quantities and units of measure (UOM) across registers and BOM.  
4. **Dedicated UX** (amber-themed shell) consistent with a compliance product.  

### Technical note

All IGCR screens route through one lazy bundle (`CustomsIGCR`) with tab IDs such as `customs-igcr-dashboards`, `customs-igcr-import-register`, etc. Some areas may still show “coming soon” placeholders where features are under development.

---

## Cross-cutting requirements

| Theme | Applies to |
|-------|------------|
| **Role-based UI** | EA application, Invoice Management (see below), EGAM system menus, Cost Model (business user vs admin visibility patterns). |
| **Audit & logs** | EGAM (system/API logs), EA (audit logs), tickets across applications. |
| **Master data quality** | Cost Model and Customs IGCR (hierarchies and registers). |
| **Extensibility** | API playground, integrations and settings for application admins in EGAM. |

---

## Related application area (not a fifth landing application)

**Invoice Management** (`invoice-management`, `agent-tickets`) is available from the main application sidebar (when not on the landing page) and provides **agent management**, **tickets**, and **invoice download** flows for a **non–EA** context (e.g. HSBC-style demo). It is **not** one of the four dashboard cards but shares patterns with the EA application for agents and tickets.

---

## Document maintenance

- **Source of truth for the four products**: `client/src/components/landing/landing.tsx` (application cards and descriptions).  
- **Route map**: `client/src/lazy-routes.tsx`.  
- **Customs IGCR tabs**: `client/src/lib/customs-igcr-tabs-config.ts`.  

Update this file when product scope, tab names, or business ownership changes.
