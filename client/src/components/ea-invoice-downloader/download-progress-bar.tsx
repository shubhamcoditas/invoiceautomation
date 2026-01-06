import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, Download, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp, MoreVertical, FileText } from "lucide-react";

export interface DownloadItem {
  id: string;
  documentType: 'invoices' | 'creditNotes' | 'debitNotes';
  label: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  error?: string;
  totalFiles: number;
  downloadedFiles: number;
}

interface DownloadProgressBarProps {
  downloads: DownloadItem[];
  onRemove: (id: string) => void;
  onCancel: (id: string) => void;
}

export function DownloadProgressBar({ downloads, onRemove, onCancel }: DownloadProgressBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (downloads.length === 0) return null;

  const activeDownloads = downloads.filter(d => d.status === 'downloading' || d.status === 'pending');
  const hasActiveDownloads = activeDownloads.length > 0;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[360px]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {hasActiveDownloads ? 'Preparing download' : 'Downloads'}
            </span>
            {activeDownloads.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({activeDownloads.length})
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                downloads.forEach(d => onRemove(d.id));
              }}
              className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Download Items */}
        {isExpanded && (
          <div className="max-h-[400px] overflow-y-auto">
            {downloads.map((download) => (
              <div
                key={download.id}
                className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {download.status === 'downloading' && (
                      <div className="relative h-8 w-8 flex items-center justify-center">
                        <svg className="h-8 w-8 transform -rotate-90" viewBox="0 0 32 32">
                          <circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${2 * Math.PI * 14}`}
                            strokeDashoffset={`${2 * Math.PI * 14 * (1 - download.progress / 100)}`}
                            strokeLinecap="round"
                            className="text-[#D71921] dark:text-[#D71921] transition-all duration-300"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-3 w-3 animate-spin text-[#D71921] dark:text-[#D71921]" />
                        </div>
                      </div>
                    )}
                    {download.status === 'completed' && (
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                    {download.status === 'error' && (
                      <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                    {download.status === 'pending' && (
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {download.status === 'pending' 
                          ? `Zipping ${download.totalFiles} file${download.totalFiles > 1 ? 's' : ''}`
                          : download.label}
                      </span>
                      {download.status === 'downloading' && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {Math.round(download.progress)}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {download.status === 'pending' 
                          ? 'Preparing...' 
                          : download.status === 'downloading'
                          ? `${download.downloadedFiles} of ${download.totalFiles} files`
                          : download.status === 'completed'
                          ? 'Completed'
                          : download.error || 'Failed'}
                      </span>
                      {(download.status === 'pending' || download.status === 'downloading') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancel(download.id)}
                          className="h-6 px-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                    {download.status === 'downloading' && (
                      <Progress 
                        value={download.progress} 
                        className="h-1 mt-2" 
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Minimized View */}
        {!isExpanded && (
          <div className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {activeDownloads.length > 0 
                  ? `${activeDownloads.length} download${activeDownloads.length > 1 ? 's' : ''} in progress`
                  : `${downloads.length} download${downloads.length > 1 ? 's' : ''} completed`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

