"use client";

import { useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FileUploadButtonProps {
  /** Button label when idle */
  label: string;
  /** Called when user selects a file; parent can handle sync/processing */
  onFileSelect: (file: File) => void;
  /** Optional label shown when loading (e.g. "Syncing…") */
  loadingLabel?: string;
  /** Whether the button is in a loading state (show spinner) */
  loading?: boolean;
  /** Disable the button */
  disabled?: boolean;
  /** HTML accept attribute for the file input (e.g. ".csv", "image/*") */
  accept?: string;
  /** Button variant - defaults to outline */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /** Extra class names for the button */
  className?: string;
}

export function FileUploadButton({
  label,
  onFileSelect,
  loadingLabel = "Loading…",
  loading = false,
  disabled = false,
  accept = "*/*",
  variant = "outline",
  className,
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (loading || disabled) return;
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        aria-hidden
        onChange={handleChange}
      />
      <Button
        type="button"
        variant={variant}
        disabled={disabled || loading}
        onClick={handleClick}
        className={className}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingLabel}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            {label}
          </>
        )}
      </Button>
    </>
  );
}
