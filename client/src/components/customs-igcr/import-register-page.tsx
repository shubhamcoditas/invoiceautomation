"use client";

import { ImportRegister } from "./import-register";

export function ImportRegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Import Register
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Register entries — use Dashboards for analytics
        </p>
      </div>

      <ImportRegister embedded />
    </div>
  );
}
