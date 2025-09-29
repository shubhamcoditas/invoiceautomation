import { useMemo, useState, useCallback } from 'react';
import { getCurrentEntityConfig, getEntityConfig, getEntityCSSVariables, getAllEntities, type EntityConfig } from '@/lib/entity-config';

export function useEntity() {
  const [currentEntityId, setCurrentEntityId] = useState<string>('hsbc');
  
  const config = useMemo(() => getEntityConfig(currentEntityId), [currentEntityId]);
  const allEntities = useMemo(() => getAllEntities(), []);
  
  const cssVariables = useMemo(() => getEntityCSSVariables(config), [config]);
  
  const applyEntityTheme = useCallback(() => {
    const root = document.documentElement;
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [cssVariables]);
  
  const switchEntity = useCallback((entityId: string) => {
    setCurrentEntityId(entityId);
    // Apply theme immediately after switching
    setTimeout(() => {
      const newConfig = getEntityConfig(entityId);
      const newCssVariables = getEntityCSSVariables(newConfig);
      const root = document.documentElement;
      Object.entries(newCssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }, 0);
  }, []);
  
  return {
    config,
    cssVariables,
    applyEntityTheme,
    isKpmgBrandingVisible: config.branding.showKpmgBranding,
    kpmgPosition: config.branding.kpmgPosition,
    currentEntityId,
    allEntities,
    switchEntity,
  };
}
