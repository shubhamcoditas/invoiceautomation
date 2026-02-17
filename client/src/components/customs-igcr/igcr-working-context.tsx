"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/** Sum of all dutyPayable from import register mock data (INITIAL + CAT_FETCH) */
const DEFAULT_DUTY_PAYABLE = 2230500;
/** Sum of dutyWaiver from ERT mock data */
const DEFAULT_ERT_WAIVER = 183950;
/** Sum of dutyWaiver from DSRT mock data */
const DEFAULT_DSRT_WAIVER = 202500;

export type IgcrWorkingState = {
  dutyPayable: number;
  ertWaiver: number;
  dsrtWaiver: number;
};

type IgcrWorkingContextValue = IgcrWorkingState & {
  setDutyPayable: (value: number) => void;
  setErtWaiver: (value: number) => void;
  setDsrtWaiver: (value: number) => void;
};

const IgcrWorkingContext = createContext<IgcrWorkingContextValue | null>(null);

export function IgcrWorkingProvider({ children }: { children: ReactNode }) {
  const [dutyPayable, setDutyPayableState] = useState(DEFAULT_DUTY_PAYABLE);
  const [ertWaiver, setErtWaiverState] = useState(DEFAULT_ERT_WAIVER);
  const [dsrtWaiver, setDsrtWaiverState] = useState(DEFAULT_DSRT_WAIVER);

  const setDutyPayable = useCallback((value: number) => {
    setDutyPayableState(value);
  }, []);
  const setErtWaiver = useCallback((value: number) => {
    setErtWaiverState(value);
  }, []);
  const setDsrtWaiver = useCallback((value: number) => {
    setDsrtWaiverState(value);
  }, []);

  const value: IgcrWorkingContextValue = {
    dutyPayable,
    ertWaiver,
    dsrtWaiver,
    setDutyPayable,
    setErtWaiver,
    setDsrtWaiver,
  };

  return (
    <IgcrWorkingContext.Provider value={value}>
      {children}
    </IgcrWorkingContext.Provider>
  );
}

export function useIgcrWorking() {
  const ctx = useContext(IgcrWorkingContext);
  if (!ctx) {
    throw new Error("useIgcrWorking must be used within IgcrWorkingProvider");
  }
  return ctx;
}

/** Total duty waiver (ERT + DSRT) */
export function totalDutyWaiver(state: IgcrWorkingState): number {
  return state.ertWaiver + state.dsrtWaiver;
}

/** Difference: Duty Payable - (ERT waiver + DSRT waiver). Should be positive. */
export function igcrWorkingDifference(state: IgcrWorkingState): number {
  return state.dutyPayable - totalDutyWaiver(state);
}
