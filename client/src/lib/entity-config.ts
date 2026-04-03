// Entity Configuration System
// This allows KPMG to deploy the same portal for multiple clients with their own branding

export interface EntityConfig {
  id: string;
  name: string;
  displayName: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  onboardingDate: string;
  features: {
    qrScanner: boolean;
    pdfUpload: boolean;
    emailReview: boolean;
    egamRepository: boolean;
    validationApis: boolean;
    noticeApis: boolean;
    systemLogs: boolean;
    userManagement: boolean;
    settings: boolean;
  };
  branding: {
    showKpmgBranding: boolean;
    kpmgPosition: 'top' | 'bottom' | 'side';
    customFooter?: string;
  };
}

// Default entity configurations
export const entityConfigs: Record<string, EntityConfig> = {
  'emirates': {
    id: 'emirates',
    name: 'Emirates',
    displayName: 'KPMG One Tax Platform',
    primaryColor: '#2563eb', // Blue primary
    secondaryColor: '#60a5fa', // Blue secondary
    accentColor: '#dbeafe', // Light blue accent
    textColor: '#1e293b',
    backgroundColor: '#f0f9ff', // Light blue background
    onboardingDate: '05 Jan 2026',
    features: {
      qrScanner: true,
      pdfUpload: true,
      emailReview: true,
      egamRepository: true,
      validationApis: true,
      noticeApis: true,
      systemLogs: true,
      userManagement: true,
      settings: true,
    },
    branding: {
      showKpmgBranding: false,
      kpmgPosition: 'bottom',
      customFooter: 'KPMG One Tax Platform'
    }
  },
  'hsbc': {
    id: 'hsbc',
    name: 'HSBC',
    displayName: 'HSBC Bank',
    primaryColor: '#00338D', // KPMG Blue - consistent with theme
    secondaryColor: '#4A90E2', // KPMG Light Blue - consistent with theme
    accentColor: '#FFD700', // Gold accent
    textColor: '#1a1a1a',
    backgroundColor: '#ffffff',
    onboardingDate: '23 Jan 2024',
    features: {
      qrScanner: true,
      pdfUpload: true,
      emailReview: true,
      egamRepository: true,
      validationApis: true,
      noticeApis: true,
      systemLogs: true,
      userManagement: true,
      settings: true,
    },
    branding: {
      showKpmgBranding: true,
      kpmgPosition: 'bottom',
      customFooter: 'KPMG One Tax Platform'
    }
  },
  'swiggy': {
    id: 'swiggy',
    name: 'Swiggy',
    displayName: 'Swiggy',
    primaryColor: '#FF6B35', // Swiggy Orange
    secondaryColor: '#FF8C42', // Light Orange
    accentColor: '#FFD700', // Gold accent
    textColor: '#1a1a1a',
    backgroundColor: '#ffffff',
    onboardingDate: '15 Feb 2024',
    features: {
      qrScanner: true,
      pdfUpload: true,
      emailReview: true,
      egamRepository: true,
      validationApis: true,
      noticeApis: true,
      systemLogs: true,
      userManagement: true,
      settings: true,
    },
    branding: {
      showKpmgBranding: true,
      kpmgPosition: 'bottom',
      customFooter: 'KPMG One Tax Platform'
    }
  },
  'flipkart': {
    id: 'flipkart',
    name: 'Flipkart',
    displayName: 'Flipkart',
    primaryColor: '#2874F0', // Flipkart Blue
    secondaryColor: '#4A90E2', // Light Blue
    accentColor: '#FFD700', // Gold accent
    textColor: '#1a1a1a',
    backgroundColor: '#ffffff',
    onboardingDate: '01 Mar 2024',
    features: {
      qrScanner: true,
      pdfUpload: true,
      emailReview: true,
      egamRepository: true,
      validationApis: true,
      noticeApis: true,
      systemLogs: true,
      userManagement: true,
      settings: true,
    },
    branding: {
      showKpmgBranding: true,
      kpmgPosition: 'bottom',
      customFooter: 'KPMG One Tax Platform'
    }
  },
  'default': {
    id: 'default',
    name: 'KPMG',
    displayName: 'KPMG One Tax Platform',
    primaryColor: '#00338D', // KPMG Blue
    secondaryColor: '#4A90E2', // KPMG Light Blue
    accentColor: '#FFD700',
    textColor: '#1a1a1a',
    backgroundColor: '#ffffff',
    onboardingDate: '01 Jan 2024',
    features: {
      qrScanner: true,
      pdfUpload: true,
      emailReview: true,
      egamRepository: true,
      validationApis: true,
      noticeApis: true,
      systemLogs: true,
      userManagement: true,
      settings: true,
    },
    branding: {
      showKpmgBranding: false,
      kpmgPosition: 'top'
    }
  }
};

// Get current entity configuration
export function getCurrentEntityConfig(): EntityConfig {
  // In production this would come from environment variables or API
  // Default entity id from env (see VITE_ENTITY_ID)
  const entityId = import.meta.env.VITE_ENTITY_ID || 'emirates';
  return entityConfigs[entityId] || entityConfigs['default'];
}

// Get entity configuration by ID
export function getEntityConfig(entityId: string): EntityConfig {
  return entityConfigs[entityId] || entityConfigs['default'];
}

// Get all available entities
export function getAllEntities(): EntityConfig[] {
  return Object.values(entityConfigs).filter(entity => entity.id !== 'default');
}

// Check if user has Application Admin role
export function isApplicationAdmin(userRole: string): boolean {
  return userRole === 'Application Admin';
}

// Get CSS variables for entity theming
export function getEntityCSSVariables(config: EntityConfig): Record<string, string> {
  return {
    '--entity-primary': config.primaryColor,
    '--entity-secondary': config.secondaryColor,
    '--entity-accent': config.accentColor,
    '--entity-text': config.textColor,
    '--entity-bg': config.backgroundColor,
  };
}
