import { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  currentTab: string;
  extractedQRData: any | null;
  extractedPDFData: any[];
  egamData: any[];
  reconciliationResults: any[];
  apiLogs: any[];
  systemLogs: any[];
  isLoading: boolean;
  isTransitioning: boolean;
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

type AppAction = 
  | { type: 'SET_CURRENT_TAB'; payload: string }
  | { type: 'SET_QR_DATA'; payload: any }
  | { type: 'SET_PDF_DATA'; payload: any[] }
  | { type: 'SET_EGAM_DATA'; payload: any[] }
  | { type: 'SET_RECONCILIATION_RESULTS'; payload: any[] }
  | { type: 'SET_API_LOGS'; payload: any[] }
  | { type: 'SET_SYSTEM_LOGS'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TRANSITIONING'; payload: boolean }
  | { type: 'ADD_SYSTEM_LOG'; payload: any }
  | { type: 'ADD_API_LOG'; payload: any }
  | { type: 'SET_CURRENT_USER'; payload: { id: string; name: string; email: string; role: string } | null }
  | { type: 'SWITCH_USER_ROLE'; payload: string };

const initialState: AppState = {
  currentTab: 'landing',
  extractedQRData: null,
  extractedPDFData: [],
  egamData: [],
  reconciliationResults: [],
  apiLogs: [],
  systemLogs: [],
  isLoading: false,
  isTransitioning: false,
  currentUser: {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Application Admin'
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_TAB':
      // Check if entering Emirates Airlines application - auto-set role to Admin
      const isEAModule = action.payload?.startsWith('ea-') || 
                         action.payload === 'ea-invoice-downloader' ||
                         action.payload === 'ea-agent-tickets' ||
                         action.payload === 'ea-audit-logs';
      
      const updatedState = { ...state, currentTab: action.payload, isTransitioning: true };
      
      // Auto-set role to Admin when entering EA application
      if (isEAModule && state.currentUser) {
        updatedState.currentUser = { ...state.currentUser, role: 'Admin' };
      }
      
      return updatedState;
    case 'SET_QR_DATA':
      return { ...state, extractedQRData: action.payload };
    case 'SET_PDF_DATA':
      return { ...state, extractedPDFData: action.payload };
    case 'SET_EGAM_DATA':
      return { ...state, egamData: action.payload };
    case 'SET_RECONCILIATION_RESULTS':
      return { ...state, reconciliationResults: action.payload };
    case 'SET_API_LOGS':
      return { ...state, apiLogs: action.payload };
    case 'SET_SYSTEM_LOGS':
      return { ...state, systemLogs: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_TRANSITIONING':
      return { ...state, isTransitioning: action.payload };
    case 'ADD_SYSTEM_LOG':
      return { ...state, systemLogs: [action.payload, ...state.systemLogs] };
    case 'ADD_API_LOG':
      return { ...state, apiLogs: [action.payload, ...state.apiLogs] };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SWITCH_USER_ROLE':
      return { 
        ...state, 
        currentUser: state.currentUser ? { ...state.currentUser, role: action.payload } : null 
      };
    default:
      return state;
  }
};

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
