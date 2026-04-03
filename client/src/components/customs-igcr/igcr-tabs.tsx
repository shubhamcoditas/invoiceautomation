"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { igcrTabsList, igcrTabsTrigger } from "@/lib/customs-igcr-styles";
import type { LucideIcon } from "lucide-react";

export interface IgcrTabItem {
  value: string;
  label: string;
  icon?: LucideIcon;
  content: React.ReactNode;
}

interface IgcrTabsProps {
  defaultValue: string;
  tabs: IgcrTabItem[];
  className?: string;
  contentClassName?: string;
}

/**
 * Config-driven tabs for Customs IGCR (amber theme). Use for Dashboards, Sales tracking, etc.
 */
export function IgcrTabs({ defaultValue, tabs, className, contentClassName = "mt-4" }: IgcrTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className={cn("w-full", className)}>
      <TabsList className={cn(igcrTabsList)}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.value} value={tab.value} className={cn(igcrTabsTrigger)}>
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className={contentClassName}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
