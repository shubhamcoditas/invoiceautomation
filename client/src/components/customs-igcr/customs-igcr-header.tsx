import { ShieldCheck } from "lucide-react";

export function CustomsIGCRHeader() {
  return (
    <header
      className="p-4 shadow-md border-b border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-900 transition-all duration-300"
      data-testid="customs-igcr-header"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-600 text-white">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Customs IGCR Tool
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              IGCR declarations, compliance checks, and reporting
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
