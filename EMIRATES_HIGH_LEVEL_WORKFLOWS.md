# Emirates Invoice Downloader - High-Level Workflow Diagrams

## Document Overview

This document contains simplified, high-level workflow diagrams for each user role in the Emirates Invoice Downloader system. These diagrams provide a clear overview of the main processes without detailed error handling or conditional branches.

**Document Version:** 1.0  
**Last Updated:** January 2025

---

## Administrator Workflow

### Agent Management Workflow

```mermaid
flowchart TD
    A[Start: Access Invoice Downloader] --> B[Navigate to Agent Management]
    B --> C[View Agents List]
    C --> D{Action Required?}
    D -->|Add New Agent| E[Click Add Agent Button]
    D -->|Edit Agent| F[Search for Agent]
    D -->|Search Agents| G[Enter Search Criteria]
    D -->|Deactivate Agent| H[Locate Agent in List]
    
    E --> E1[Enter Agent Details:<br/>First Name, Last Name, Email, Company]
    E1 --> E2[Enter Optional Fields:<br/>SL Code, Comments]
    E2 --> E3[Click Save Button]
    E3 --> E4[System Generates Username]
    E4 --> E5[Agent Account Activated]
    E5 --> C
    
    F --> F1[Click Edit Button]
    F1 --> F2[Modify Agent Information]
    F2 --> F3[Click Save Button]
    F3 --> F4[Agent Information Updated]
    F4 --> C
    
    G --> G1[View Filtered Results]
    G1 --> C
    
    H --> H1[Click Deactivate Button]
    H1 --> H2[Confirm Deactivation]
    H2 --> H3[Agent Status: Inactive]
    H3 --> C
    
    style A fill:#2563eb,color:#fff
    style C fill:#c8e6c9
    style D fill:#fff9c4
```

### Tickets Management Workflow

```mermaid
flowchart TD
    A[Start: Access Invoice Downloader] --> B[Navigate to Tickets Management]
    B --> C[View All Tickets Dashboard]
    C --> D{Action Required?}
    D -->|View Tickets| E[Review Ticket List]
    D -->|Filter Tickets| F[Select Status Filter]
    D -->|Search by Invoice| G[Enter Invoice ID]
    D -->|Track Ticket| H[Click on Ticket Row]
    
    E --> E1[Review Ticket Details:<br/>Ticket ID, Invoice Number,<br/>Status, Priority, Created Date]
    E1 --> C
    
    F --> F1[Select Priority Filter]
    F1 --> F2[View Filtered Tickets]
    F2 --> C
    
    G --> G1[View Tickets for Invoice]
    G1 --> C
    
    H --> H1[View Complete Ticket Information]
    H1 --> H2[Review Comments and Timestamps]
    H2 --> H3[Update Ticket Status if Needed]
    H3 --> H4[Status Updated and Logged]
    H4 --> C
    
    style A fill:#2563eb,color:#fff
    style C fill:#c8e6c9
    style D fill:#fff9c4
```

### Audit Logs Workflow

```mermaid
flowchart TD
    A[Start: Access Invoice Downloader] --> B[Navigate to Audit Logs]
    B --> C[View All Log Entries]
    C --> D{Action Required?}
    D -->|Filter Logs| E[Select Category Filter:<br/>All/Authentication/Download/Cloud Sync]
    D -->|Monitor Activities| F[Review Log Entries]
    D -->|Refresh Logs| G[Click Refresh Button]
    
    E --> E1[View Filtered Results]
    E1 --> C
    
    F --> F1[Identify User Activity Patterns]
    F1 --> F2[Review Activity Details:<br/>User Name, Role, Description,<br/>Timestamp, Status, IP Address]
    F2 --> F3[Export Logs if Needed]
    F3 --> C
    
    G --> G1[System Fetches Latest Logs]
    G1 --> G2[New Entries Displayed]
    G2 --> C
    
    style A fill:#2563eb,color:#fff
    style C fill:#c8e6c9
    style D fill:#fff9c4
```

### Invoice Downloader Workflow (Admin)

```mermaid
flowchart TD
    A[Start: Access Invoice Downloader] --> B[Enter Document ID or PNR]
    B --> C[Click Search Button]
    C --> D[System Searches for Invoice]
    D --> E[View Invoice Details:<br/>Invoice Number, Type, Date, Amount]
    E --> F[Click Download Button]
    F --> G[Confirm Download]
    G --> H[File Downloads to Device]
    H --> I[Activity Logged in Audit Logs]
    I --> J[End: Download Complete]
    
    style A fill:#2563eb,color:#fff
    style J fill:#c8e6c9
```

---

## User / Business User Workflow

```mermaid
flowchart TD
    A[Start: Access Invoice Downloader] --> B[Enter Email and Password]
    B --> C[Click Sign In Button]
    C --> D[System Authenticates User]
    D --> E[Redirect to Invoice Search Page]
    E --> F[Enter Document ID or PNR]
    F --> G[Click Search Button]
    G --> H[System Searches for Invoice]
    H --> I{Invoice Found?}
    I -->|Yes| J[View Invoice Details:<br/>Invoice Number, Document Type,<br/>Date, Amount]
    I -->|No| K[Display No Invoice Found Message]
    K --> F
    
    J --> L{Action Required?}
    L -->|Download| M[Click Download Button]
    L -->|Raise Ticket| N[Click Raise Ticket Button]
    
    M --> O[Confirm Download in Modal]
    O --> P[File Downloads to Device]
    P --> Q[Verify Downloaded File]
    Q --> R[End: Download Complete]
    
    N --> N1[Enter Ticket Details:<br/>Invoice ID, Issue Description]
    N1 --> N2[Click Submit Ticket]
    N2 --> N3[Receive Ticket ID Confirmation]
    N3 --> S[End: Ticket Raised]
    
    style A fill:#2563eb,color:#fff
    style R fill:#c8e6c9
    style S fill:#ffd54f
    style I fill:#fff9c4
    style L fill:#fff9c4
```

---

## Agent Workflow

```mermaid
flowchart TD
    A[Start: Access Invoice Downloader] --> B[Enter Username/Email and Password]
    B --> C[Click Sign In Button]
    C --> D[System Validates Credentials]
    D --> E[System Checks Account Status]
    E --> F{Account Active?}
    F -->|No| G[Display Account Inactive Message]
    G --> H[Contact Administrator]
    H --> I[End: Access Denied]
    F -->|Yes| J[Redirect to Invoice Search Interface]
    
    J --> K{Select Search Type}
    K -->|Single Invoice| L[Enter Document ID or PNR]
    K -->|Bulk Search| M[Enter GSTN]
    
    L --> L1[Click Search Button]
    L1 --> L2[System Searches for Invoice]
    L2 --> L3[View Invoice Details]
    L3 --> L4[Click Download Button]
    L4 --> L5[Confirm Download]
    L5 --> L6[File Downloads to Device]
    L6 --> N[End: Download Complete]
    
    M --> M1[Select From Date]
    M1 --> M2[Select To Date]
    M2 --> M3[System Validates Date Range]
    M3 --> M4[Click Search/Fetch Invoices Button]
    M4 --> M5[System Processes Bulk Search]
    M5 --> M6[View Invoice Summary:<br/>Total Invoices, Credit Notes,<br/>Debit Notes, File Sizes,<br/>Estimated Download Time]
    M6 --> M7[Select Document Type:<br/>Invoices/Credit Notes/Debit Notes]
    M7 --> M8[Review Download Details]
    M8 --> M9[Click Download Button]
    M9 --> M10[Confirm Bulk Download]
    M10 --> M11[Monitor Download Progress]
    M11 --> M12[All Files Download to Device]
    M12 --> M13[Verify All Downloads]
    M13 --> N
    
    style A fill:#2563eb,color:#fff
    style N fill:#c8e6c9
    style I fill:#ffcdd2
    style F fill:#fff9c4
    style K fill:#fff9c4
```

---

## Complete System Overview

```mermaid
flowchart TD
    A[Emirates Invoice Downloader System] --> B[Admin Role]
    A --> C[User/Business User Role]
    A --> D[Agent Role]
    
    B --> B1[Agent Management:<br/>Add, Edit, Search, Deactivate Agents]
    B --> B2[Tickets Management:<br/>View, Filter, Track, Search Tickets]
    B --> B3[Audit Logs:<br/>View, Filter, Monitor, Refresh Logs]
    B --> B4[Invoice Downloader:<br/>Search and Download Invoices]
    
    C --> C1[Sign In with Credentials]
    C1 --> C2[Search Invoice by Document ID or PNR]
    C2 --> C3[View Invoice Details]
    C3 --> C4[Download Invoice or Raise Support Ticket]
    
    D --> D1[Sign In with Agent Credentials]
    D1 --> D2{Select Search Type}
    D2 -->|Single| D3[Search by Document ID or PNR]
    D2 -->|Bulk| D4[Search by GSTN + Date Range]
    D3 --> D5[Download Single Invoice]
    D4 --> D6[Select Document Type and Download Multiple Invoices]
    
    style A fill:#2563eb,color:#fff
    style B fill:#60a5fa
    style C fill:#60a5fa
    style D fill:#60a5fa
    style B1 fill:#c8e6c9
    style B2 fill:#c8e6c9
    style B3 fill:#c8e6c9
    style B4 fill:#c8e6c9
    style C4 fill:#c8e6c9
    style D5 fill:#c8e6c9
    style D6 fill:#c8e6c9
    style D2 fill:#fff9c4
```

---

## Workflow Summary

### Administrator
- **Agent Management:** Create, edit, search, and manage agent accounts
- **Tickets Management:** View, filter, track, and manage support tickets
- **Audit Logs:** Monitor system activities and user actions
- **Invoice Downloader:** Search and download invoices with full audit visibility

### User / Business User
- **Sign In:** Authenticate to access the system
- **Search Invoice:** Find invoices using Document ID or PNR
- **Download Invoice:** Download individual invoices
- **Raise Support Ticket:** Create tickets for issues or queries

### Agent
- **Sign In:** Authenticate with active agent account
- **Single Invoice Search:** Search and download individual invoices
- **Bulk Search:** Search multiple invoices using GSTN and date range
- **Bulk Download:** Download multiple invoices by document type

---

*End of High-Level Workflow Diagrams*

**These simplified diagrams provide a quick overview of each role's capabilities without detailed decision points or error handling.*

