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
  | { type: 'ADD_SYSTEM_LOG'; payload: any }
  | { type: 'ADD_API_LOG'; payload: any };

const initialState: AppState = {
  currentTab: 'dashboard',
  extractedQRData: null,
  extractedPDFData: [],
  egamData: [],
  reconciliationResults: [],
  apiLogs: [],
  systemLogs: [],
  isLoading: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_TAB':
      return { ...state, currentTab: action.payload };
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
    case 'ADD_SYSTEM_LOG':
      return { ...state, systemLogs: [action.payload, ...state.systemLogs] };
    case 'ADD_API_LOG':
      return { ...state, apiLogs: [action.payload, ...state.apiLogs] };
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
