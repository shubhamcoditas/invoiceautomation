# EGAM and Invoice Reader Platform

## Overview

This is a frontend-focused web application that simulates an "EGAM and Invoice Reader Platform" - a dummy prototype designed for demonstration and testing of invoice processing workflows. The platform provides QR code scanning, PDF upload processing, EGAM repository management, data reconciliation, and validation API testing capabilities. Built with React, TypeScript, and modern web technologies, it simulates real invoice processing workflows without requiring actual backend integrations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: Custom React Context (AppStateProvider) combined with useReducer for global state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express server for API endpoints
- **Language**: TypeScript with ESM modules for consistency across frontend and backend
- **Data Storage**: In-memory storage implementation (MemStorage class) simulating database operations
- **API Design**: RESTful endpoints following standard HTTP conventions
- **Development Server**: Vite middleware integration for seamless full-stack development

### Data Storage Solutions
- **Database Setup**: Drizzle ORM configured for PostgreSQL with migration support
- **Schema Design**: Modular schema definitions in shared directory for type safety
- **Storage Interface**: IStorage interface allowing easy switching between storage implementations
- **Data Models**: Structured tables for QR data, PDF data, EGAM repository, system logs, and API logs

### Component Architecture
- **Layout System**: Responsive sidebar navigation with mobile support and header with notifications
- **Feature Modules**: Dedicated components for each major feature (QR scanner, PDF upload, reconciliation, etc.)
- **UI Components**: Comprehensive shadcn/ui component library with custom theming
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

### Development Workflow
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Hot Reloading**: Vite HMR for instant development feedback
- **Path Aliases**: Configured import paths for clean code organization
- **Error Handling**: Runtime error overlay and comprehensive error boundaries

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for server state management
- **Development Tools**: Vite, TypeScript, ESBuild for fast builds and development
- **Routing**: Wouter for lightweight client-side routing

### UI and Styling
- **Design System**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS for utility-first styling with custom design tokens
- **Icons**: Lucide React for consistent iconography
- **Animations**: CSS animations and transitions for smooth user interactions

### Data and Forms
- **Form Management**: React Hook Form with Hookform Resolvers for validation
- **Schema Validation**: Zod for runtime type checking and validation
- **Data Export**: XLSX library for Excel file generation and export
- **State Management**: TanStack React Query for server state and caching

### Backend Infrastructure
- **Database**: PostgreSQL with Neon serverless adapter for cloud deployment
- **ORM**: Drizzle ORM with Drizzle Kit for migrations and schema management
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Date Utilities**: date-fns for date manipulation and formatting

### Development and Build Tools
- **Replit Integration**: Specialized Vite plugins for Replit development environment
- **Error Handling**: Runtime error modal and cartographer for debugging
- **Build Optimization**: ESBuild for production builds with external package bundling