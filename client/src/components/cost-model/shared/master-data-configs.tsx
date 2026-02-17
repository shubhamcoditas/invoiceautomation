import { MasterDataConfig } from "./master-data-crud";
import { Badge } from "@/components/ui/badge";
import React from "react";

// Asset Class Configuration
export const assetClassConfig: MasterDataConfig = {
  entityName: "Asset Class",
  entityNamePlural: "Asset Classes",
  apiEndpoint: "/api/asset-class",
  queryKey: "asset-classes",
  idField: "classId",
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "e.g., Furniture and Fixtures",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 3,
      placeholder: "Enter a description for this asset class",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "archived", label: "Archived" },
      ],
    },
    {
      name: "metadata",
      label: "Metadata",
      type: "text",
      hidden: true, // Hide from UI but keep in data
    },
  ],
  tableColumns: [
    {
      id: "classId",
      label: "Class ID",
      render: (item) => (
        <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
          {item.classId}
        </Badge>
      ),
    },
    { id: "name", label: "Name" },
    {
      id: "description",
      label: "Description",
      render: (item) => (
        <span className="max-w-xs truncate">{item.description || "-"}</span>
      ),
    },
    {
      id: "createdAt",
      label: "Created At",
      render: (item) =>
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "-",
    },
  ],
  enableDuplicateDetection: true,
  duplicateField: "name",
  deleteConfirmMessage: "Are you sure you want to delete this asset class?",
};

// Vertical Configuration
export const verticalConfig: MasterDataConfig = {
  entityName: "Vertical",
  entityNamePlural: "Verticals",
  apiEndpoint: "/api/verticals",
  queryKey: "verticals",
  idField: "verticalId",
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "e.g., Information Technology",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 3,
      placeholder: "Enter a description for this vertical",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "archived", label: "Archived" },
      ],
    },
    {
      name: "metadata",
      label: "Metadata",
      type: "text",
      hidden: true,
    },
  ],
  tableColumns: [
    {
      id: "verticalId",
      label: "Vertical ID",
      render: (item) => (
        <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
          {item.verticalId}
        </Badge>
      ),
    },
    { id: "name", label: "Name" },
    {
      id: "description",
      label: "Description",
      render: (item) => (
        <span className="max-w-xs truncate">{item.description || "-"}</span>
      ),
    },
    {
      id: "createdAt",
      label: "Created At",
      render: (item) =>
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "-",
    },
  ],
  enableDuplicateDetection: true,
  duplicateField: "name",
  deleteConfirmMessage: "Are you sure you want to delete this vertical?",
};







