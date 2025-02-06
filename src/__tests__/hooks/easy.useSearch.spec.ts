import { act, renderHook } from '@testing-library/react';

import { events } from '../../__mocks__/response/mockEvents.json' assert { type: 'json' };
import { useSearch } from '../../pages/scheduler/model/index.ts';
import { Event } from '../../types.ts';

const CLONED_EVENTS = [...events] as Event[];

beforeEach(() => {
  vi.setSystemTime(new Date('2024-10-01'));
});

afterEach(() => {
  vi.useRealTimers();
});

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(CLONED_EVENTS, new Date(), 'month'));

  expect(result.current.searchTerm).toBe('');
  expect(result.current.filteredEvents).toHaveLength(CLONED_EVENTS.length);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(CLONED_EVENTS, new Date(), 'month'));

  act(() => result.current.setSearchTerm('기존 회의'));

  expect(result.current.filteredEvents).toHaveLength(4);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(CLONED_EVENTS, new Date(), 'month'));

  act(() => result.current.setSearchTerm('기존 회의'));

  expect(result.current.filteredEvents).toHaveLength(4);
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  // 주간
  const { result: weekResult } = renderHook(() => useSearch(CLONED_EVENTS, new Date(), 'week'));

  expect(weekResult.current.filteredEvents).toHaveLength(2);

  // 월간
  const { result: monthResult } = renderHook(() => useSearch(CLONED_EVENTS, new Date(), 'month'));

  expect(monthResult.current.filteredEvents).toHaveLength(6);
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(CLONED_EVENTS, new Date(), 'month'));

  act(() => result.current.setSearchTerm('회의'));

  expect(result.current.filteredEvents).toHaveLength(6);

  act(() => result.current.setSearchTerm('점심'));

  expect(result.current.filteredEvents).toHaveLength(0);
});
