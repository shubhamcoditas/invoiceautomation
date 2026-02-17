// Simplified Verticals Master component using generic MasterDataCRUD
import { useState } from "react";
import { MasterDataCRUD } from "../shared/master-data-crud";
import { verticalConfig } from "../shared/master-data-configs.tsx";
import { VerticalsBulkUploadModal } from "./verticals-bulk-upload-modal";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function VerticalsMaster() {
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  return (
    <>
      <MasterDataCRUD
        config={verticalConfig}
        headerActions={
          <Button
            type="button"
            variant="outline"
            onClick={() => setBulkModalOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk upload
          </Button>
        }
      />
      <VerticalsBulkUploadModal
        open={bulkModalOpen}
        onOpenChange={setBulkModalOpen}
      />
    </>
  );
}
