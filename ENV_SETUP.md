# Environment Variables Setup

This document describes all environment variables used by the application.

## Required Variables

### `DATABASE_URL`
- **Required for:** Database migrations (`npm run db:push`)
- **Format:** `postgresql://user:password@host:port/database`
- **Example:** `postgresql://user:pass@localhost:5432/invoice_automation`
- **Note:** Required only if using Drizzle migrations. The application currently uses in-memory storage.

## Optional Variables

### `PORT`
- **Default:** `5000`
- **Description:** Port number for the server to listen on
- **Example:** `PORT=3000`

### `NODE_ENV`
- **Default:** `development`
- **Values:** `development` | `production`
- **Description:** Environment mode. Affects Vite setup, error details, and server binding
- **Example:** `NODE_ENV=production`

### `HOST`
- **Default:** `localhost` (development) | `0.0.0.0` (production)
- **Description:** Host address for the server to bind to
- **Note:** In production, automatically uses `0.0.0.0` to allow external connections
- **Example:** `HOST=0.0.0.0`

### `VITE_ENTITY_ID`
- **Default:** `hsbc`
- **Description:** Entity ID for client-side configuration
- **Example:** `VITE_ENTITY_ID=hsbc`

### `ALLOWED_ORIGINS`
- **Default:** None (allows all in development)
- **Description:** Comma-separated list of allowed CORS origins for production
- **Example:** `ALLOWED_ORIGINS=https://example.com,https://app.example.com`

### `REPL_ID`
- **Default:** None
- **Description:** Replit environment identifier (only needed in Replit)
- **Example:** `REPL_ID=abc123`

### `SESSION_SECRET`
- **Default:** None
- **Description:** Secret key for session management (if sessions are implemented)
- **Note:** Generate a random string for production
- **Example:** `SESSION_SECRET=your-secret-key-here-change-in-production`

## Setup Instructions

1. Copy the example file (if available):
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set the required variables

3. For production, ensure:
   - `NODE_ENV=production`
   - `DATABASE_URL` is set (if using database)
   - `ALLOWED_ORIGINS` is configured
   - `SESSION_SECRET` is set to a secure random string

## Notes

- The application currently uses in-memory storage (`MemStorage`), so `DATABASE_URL` is only needed for migrations
- In development, CORS allows all origins
- In production, configure `ALLOWED_ORIGINS` for security
- Never commit `.env` file to version control

