import { IFilterState } from '@ansible/ansible-ui-framework';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { AUTOMATION_DASHBOARD_DEFAULT_FILTERS } from '../utils/defaultFilterState';

function periodArraysEqual(a: string[] | undefined, b: string[] | undefined): boolean {
  if (!a && !b) return true;
  if (!a || !b || a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

interface PostGADashboardFilterContextValue {
  period: string[];
  setPeriod: Dispatch<SetStateAction<string[]>>;
  periodArraysEqual: (a: string[] | undefined, b: string[] | undefined) => boolean;
}

const PostGADashboardFilterContext = createContext<PostGADashboardFilterContextValue | null>(null);

export function PostGADashboardFilterProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [period, setPeriod] = useState<string[]>(AUTOMATION_DASHBOARD_DEFAULT_FILTERS.period);

  const value = useMemo(
    () => ({
      period,
      setPeriod,
      periodArraysEqual,
    }),
    [period]
  );

  return (
    <PostGADashboardFilterContext.Provider value={value}>
      {children}
    </PostGADashboardFilterContext.Provider>
  );
}

export function usePostGADashboardPeriodFilter() {
  const context = useContext(PostGADashboardFilterContext);
  if (!context) {
    throw new Error(
      'usePostGADashboardPeriodFilter must be used within PostGADashboardFilterProvider'
    );
  }
  return context;
}

/** Merge shared period into a full filter state update. */
export function withSharedPeriod(filterState: IFilterState, period: string[]): IFilterState {
  return { ...filterState, period };
}
