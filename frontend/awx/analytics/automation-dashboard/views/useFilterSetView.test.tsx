/* eslint-disable i18next/no-literal-string */
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { metricsAPI } from '../../../common/api/metrics-utils';
import type { IDashboardFilterSet } from '../types';
import { AUTOMATION_DASHBOARD_REPORT_QUERY_KEY } from '../constants/reportQuery';
import { useFilterSetView } from './useFilterSetView';

const mockSetSearchParams = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('@ansible/ansible-ui-framework/components/useURLSearchParams', () => ({
  useURLSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const filterSetA: IDashboardFilterSet = {
  id: 1,
  name: 'Report A',
  filters: '{"period":["last_7_days"]}',
  is_default: false,
};

const filterSetB: IDashboardFilterSet = {
  id: 2,
  name: 'Report B',
  filters: '{"period":["last_30_days"]}',
  is_default: true,
};

const pageResponse = (results: IDashboardFilterSet[], next: string | null = null) => ({
  count: results.length,
  next,
  previous: null,
  results,
});

// ─── MSW server ───────────────────────────────────────────────────────────────

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
beforeEach(() => {
  mockSearchParams = new URLSearchParams();
  mockSetSearchParams.mockClear();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ─── Tests ────────────────────────────────────────────────────────────────────

function queryOpts(
  search = ''
): Parameters<ReturnType<typeof useFilterSetView>['queryOptions']>[0] {
  return { signal: new AbortController().signal, next: undefined, search };
}

describe('useFilterSetView', () => {
  describe('initial state', () => {
    test('should start with undefined value and empty filterSets', () => {
      const { result } = renderHook(() => useFilterSetView());

      expect(result.current.value).toBeUndefined();
      expect(result.current.version).toBe(0);
      expect(result.current.filterSets).toEqual([]);
      expect(result.current.selectedFilterSet).toBeUndefined();
    });

    test('should expose required functions', () => {
      const { result } = renderHook(() => useFilterSetView());

      expect(result.current.setValue).toBeTypeOf('function');
      expect(result.current.queryOptions).toBeTypeOf('function');
      expect(result.current.setSelectedFilterSet).toBeTypeOf('function');
      expect(result.current.removeFilterSet).toBeTypeOf('function');
      expect(result.current.upsertFilterSet).toBeTypeOf('function');
    });
  });

  describe('setSelectedFilterSet', () => {
    test('should update selectedFilterSet', () => {
      const { result } = renderHook(() => useFilterSetView());

      act(() => {
        result.current.setSelectedFilterSet(filterSetA);
      });

      expect(result.current.selectedFilterSet).toEqual(filterSetA);
    });

    test('should clear selectedFilterSet when set to undefined', () => {
      const { result } = renderHook(() => useFilterSetView());

      act(() => {
        result.current.setSelectedFilterSet(filterSetA);
      });
      act(() => {
        result.current.setSelectedFilterSet(undefined);
      });

      expect(result.current.selectedFilterSet).toBeUndefined();
    });
  });

  describe('upsertFilterSet', () => {
    test('should add a new filter set and set value to its id', () => {
      const { result } = renderHook(() => useFilterSetView());

      act(() => {
        result.current.upsertFilterSet(filterSetA);
      });

      expect(result.current.filterSets).toContainEqual(filterSetA);
      expect(result.current.value).toBe('1');
    });

    test('should increment version on every upsert to force remount', () => {
      const { result } = renderHook(() => useFilterSetView());
      const initialVersion = result.current.version;

      act(() => {
        result.current.upsertFilterSet(filterSetA);
      });

      expect(result.current.version).toBe(initialVersion + 1);
    });

    test('should update an existing filter set by id', () => {
      const { result } = renderHook(() => useFilterSetView());

      act(() => {
        result.current.upsertFilterSet(filterSetA);
      });

      const updated: IDashboardFilterSet = { ...filterSetA, name: 'Report A – Updated' };
      act(() => {
        result.current.upsertFilterSet(updated);
      });

      expect(result.current.filterSets).toHaveLength(1);
      expect(result.current.filterSets[0].name).toBe('Report A – Updated');
    });

    test('should accumulate multiple distinct filter sets', () => {
      const { result } = renderHook(() => useFilterSetView());

      act(() => {
        result.current.upsertFilterSet(filterSetA);
      });
      act(() => {
        result.current.upsertFilterSet(filterSetB);
      });

      expect(result.current.filterSets).toHaveLength(2);
    });
  });

  describe('removeFilterSet', () => {
    test('should remove the filter set and reset value and selectedFilterSet', () => {
      const { result } = renderHook(() => useFilterSetView());

      act(() => {
        result.current.upsertFilterSet(filterSetA);
        result.current.setSelectedFilterSet(filterSetA);
      });

      act(() => {
        result.current.removeFilterSet(filterSetA);
      });

      expect(result.current.filterSets).not.toContainEqual(filterSetA);
      expect(result.current.value).toBeUndefined();
      expect(result.current.selectedFilterSet).toBeUndefined();
    });

    test('should not affect other filter sets when removing one', () => {
      const { result } = renderHook(() => useFilterSetView());

      act(() => {
        result.current.upsertFilterSet(filterSetA);
        result.current.upsertFilterSet(filterSetB);
      });
      act(() => {
        result.current.removeFilterSet(filterSetA);
      });

      expect(result.current.filterSets).toHaveLength(1);
      expect(result.current.filterSets[0]).toEqual(filterSetB);
    });
  });

  describe('queryOptions', () => {
    test('should fetch options from the API and return them', async () => {
      server.use(
        http.get(metricsAPI`/dashboard_reports/filter_sets/`, () =>
          HttpResponse.json(pageResponse([filterSetA, filterSetB]))
        )
      );

      const { result } = renderHook(() => useFilterSetView());

      let options: Awaited<ReturnType<typeof result.current.queryOptions>>;
      await act(async () => {
        options = await result.current.queryOptions(queryOpts());
      });

      expect(options!.options).toEqual([
        { label: 'Report A', value: '1' },
        { label: 'Report B', value: '2' },
      ]);
      expect(options!.remaining).toBe(0);
    });

    test('should merge fetched results into filterSets cache', async () => {
      server.use(
        http.get(metricsAPI`/dashboard_reports/filter_sets/`, () =>
          HttpResponse.json(pageResponse([filterSetA]))
        )
      );

      const { result } = renderHook(() => useFilterSetView());

      await act(async () => {
        await result.current.queryOptions(queryOpts());
      });

      await waitFor(() => {
        expect(result.current.filterSets).toContainEqual(filterSetA);
      });
    });

    test('should not add duplicate entries to the filterSets cache', async () => {
      server.use(
        http.get(metricsAPI`/dashboard_reports/filter_sets/`, () =>
          HttpResponse.json(pageResponse([filterSetA]))
        )
      );

      const { result } = renderHook(() => useFilterSetView());

      // Two sequential calls — React must flush state between them
      await act(async () => {
        await result.current.queryOptions(queryOpts());
      });
      await act(async () => {
        await result.current.queryOptions(queryOpts());
      });

      expect(result.current.filterSets.filter((f) => f.id === filterSetA.id)).toHaveLength(1);
    });

    test('should include next page token when more pages exist', async () => {
      server.use(
        http.get(metricsAPI`/dashboard_reports/filter_sets/`, () =>
          HttpResponse.json({ ...pageResponse([filterSetA], 'page2'), count: 15 })
        )
      );

      const { result } = renderHook(() => useFilterSetView());

      let options: Awaited<ReturnType<typeof result.current.queryOptions>>;
      await act(async () => {
        options = await result.current.queryOptions(queryOpts());
      });

      expect(options!.next).toBe('2');
      expect(options!.remaining).toBeGreaterThan(0);
    });

    test('should pass the search parameter to the API', async () => {
      let capturedUrl = '';
      server.use(
        http.get(metricsAPI`/dashboard_reports/filter_sets/`, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json(pageResponse([]));
        })
      );

      const { result } = renderHook(() => useFilterSetView());

      await act(async () => {
        await result.current.queryOptions(queryOpts('my report'));
      });

      expect(new URL(capturedUrl).searchParams.get('search')).toBe('my report');
    });
  });

  describe('report URL persistence', () => {
    test('should initialize value from report query param', () => {
      mockSearchParams = new URLSearchParams(`${AUTOMATION_DASHBOARD_REPORT_QUERY_KEY}=1`);

      const { result } = renderHook(() => useFilterSetView());

      expect(result.current.value).toBe('1');
    });

    test('should write report id to URL when setValue is called', () => {
      const { result } = renderHook(() => useFilterSetView());

      act(() => {
        result.current.setValue('2');
      });

      expect(mockSetSearchParams).toHaveBeenCalled();
      const params = mockSetSearchParams.mock.calls.at(-1)?.[0] as URLSearchParams;
      expect(params.get(AUTOMATION_DASHBOARD_REPORT_QUERY_KEY)).toBe('2');
    });

    test('should remove report from URL when setValue is cleared', () => {
      mockSearchParams = new URLSearchParams(`${AUTOMATION_DASHBOARD_REPORT_QUERY_KEY}=1`);
      const { result } = renderHook(() => useFilterSetView());

      act(() => {
        result.current.setValue(undefined);
      });

      const params = mockSetSearchParams.mock.calls.at(-1)?.[0] as URLSearchParams;
      expect(params.get(AUTOMATION_DASHBOARD_REPORT_QUERY_KEY)).toBeNull();
    });

    test('should restore selectedFilterSet from persisted report id', async () => {
      mockSearchParams = new URLSearchParams(`${AUTOMATION_DASHBOARD_REPORT_QUERY_KEY}=1`);
      server.use(
        http.get(metricsAPI`/dashboard_reports/filter_sets/1/`, () =>
          HttpResponse.json(filterSetA)
        )
      );

      const { result } = renderHook(() => useFilterSetView());

      await waitFor(() => {
        expect(result.current.selectedFilterSet).toEqual(filterSetA);
      });
      expect(result.current.filterSets).toContainEqual(filterSetA);
    });

    test('should clear persisted report and call onPersistedReportMissing when restore fails', async () => {
      mockSearchParams = new URLSearchParams(`${AUTOMATION_DASHBOARD_REPORT_QUERY_KEY}=999`);
      const onPersistedReportMissing = vi.fn();
      server.use(
        http.get(metricsAPI`/dashboard_reports/filter_sets/999/`, () =>
          HttpResponse.json({ detail: 'Not found.' }, { status: 404 })
        )
      );

      const { result } = renderHook(() =>
        useFilterSetView({ onPersistedReportMissing })
      );

      await waitFor(() => {
        expect(onPersistedReportMissing).toHaveBeenCalled();
      });
      expect(result.current.value).toBeUndefined();
      expect(result.current.selectedFilterSet).toBeUndefined();
    });
  });
});
