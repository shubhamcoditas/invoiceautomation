import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Await the async config function if it's a function
  const resolvedConfig = typeof viteConfig === "function" ? await viteConfig() : viteConfig;
  
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...resolvedConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg: string, options?: any) => {
        viteLogger.error(msg, options);
        // Don't exit immediately - let the error propagate for better error handling
        // process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Apply Vite middleware ONLY for non-API routes
  // CRITICAL: Use Express path matching to exclude /api/* routes
  // Express middleware with path matching runs in order, but route handlers (app.get) are matched first
  // By excluding /api/* here, we ensure API routes are never touched by Vite
  
  // Apply Vite dev server middleware for non-API routes only
  // This handles Vite's HMR, asset serving, etc.
  app.use((req: any, res: any, next: any) => {
    const url = req.originalUrl || req.url || '';
    const pathname = url.split('?')[0];
    
    // CRITICAL: Completely skip /api/* routes - never call vite.middlewares for them
    if (pathname.startsWith('/api/')) {
      return next(); // Let Express route handlers handle it
    }
    
    // For all other routes, use Vite middleware
    vite.middlewares(req, res, next);
  });
  
  // Catch-all for SPA routing - ONLY for non-API routes
  // This serves index.html for client-side routing
  app.use(async (req: any, res: any, next: any) => {
    const url = req.originalUrl || req.url || '';
    const pathname = url.split('?')[0];

    // CRITICAL: Never serve HTML for API routes
    if (pathname.startsWith('/api/')) {
      return next(); // Let Express handle it - if no route matches, Express will 404
    }
    
    // Skip if response already sent
    if (res.headersSent) {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req: any, res: any) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
