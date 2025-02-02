import { events } from '../../__mocks__/response/mockEvents.json' assert { type: 'json' };
import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

const CLONED_EVENTS = [...events] as Event[];

describe('getFilteredEvents', () => {
  it("검색어 '이벤트'에 맞는 이벤트만 반환한다", () => {
    const result = getFilteredEvents(CLONED_EVENTS, '이벤트', new Date('2024-10'), 'month');
    expect(result).toHaveLength(2);
  });

  it('주간 뷰에서 2024-10-01 주의 이벤트만 반환한다', () => {
    const result = getFilteredEvents(CLONED_EVENTS, '', new Date('2024-10-01'), 'week');
    expect(result).toHaveLength(2);
  });

  it('월간 뷰에서 2024년 10월의 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(CLONED_EVENTS, '', new Date('2024-10'), 'month');
    expect(result).toHaveLength(6);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const result = getFilteredEvents(CLONED_EVENTS, '이벤트', new Date('2024-10-01'), 'week');
    expect(result).toHaveLength(0);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(CLONED_EVENTS, '', new Date('2024-10'), 'month');
    expect(result).toHaveLength(6);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const result = getFilteredEvents(CLONED_EVENTS, 'EvEnT', new Date('2024-10'), 'month');
    expect(result).toHaveLength(2);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const result = [
      ...getFilteredEvents(CLONED_EVENTS, '', new Date('2024-10-01'), 'week'),
      ...getFilteredEvents(CLONED_EVENTS, '', new Date('2024-10-31'), 'week'),
    ];
    expect(result).toHaveLength(4);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const result = getFilteredEvents([], '', new Date('2024-10-01'), 'month');
    expect(result).toHaveLength(0);
  });
});
