import { act, renderHook } from '@testing-library/react';

import { useNotifications } from '../../feature/feedback/model';
import { formatDate } from '../../shared/lib';
import { Event } from '../../types.ts';
import { parseHM } from '../utils.ts';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('초기 상태에서는 알림이 없어야 한다', () => {
  const { result } = renderHook(() => useNotifications([]));

  expect(result.current.notifications).toHaveLength(0);
});

it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', async () => {
  const now = new Date();
  const startTime = parseHM(now.getTime() + 2 * 60 * 1000);

  const event: Event = {
    id: '1',
    title: '다람쥐 헌 쳇바퀴에 타고파',
    date: formatDate(now),
    startTime: startTime,
    endTime: '23:58',
    description: '가느다란 몸 부수어 쥔 총칼, 터, 평화',
    location: '장소',
    category: '분류',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 2,
  };

  const { result } = renderHook(() => useNotifications([event]));

  await act(() => vi.advanceTimersByTime(1000));

  expect(result.current.notifications).toHaveLength(1);
});

it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
  const now = new Date();
  const startTime = parseHM(now.getTime() + 10 * 60 * 1000);

  const event1: Event = {
    id: '1',
    title: '다람쥐 헌 쳇바퀴에 타고파',
    date: formatDate(now),
    startTime: startTime,
    endTime: '23:58',
    description: '가느다란 몸 부수어 쥔 총칼, 터, 평화',
    location: '장소',
    category: '분류',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 10,
  };

  const event2: Event = {
    id: '2',
    title: '다람쥐 헌 쳇바퀴에 타고파',
    date: formatDate(now),
    startTime: startTime,
    endTime: '23:58',
    description: '가느다란 몸 부수어 쥔 총칼, 터, 평화',
    location: '장소',
    category: '분류',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 10,
  };

  const { result } = renderHook(() => useNotifications([event1, event2]));

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toHaveLength(2);

  act(() => {
    result.current.removeNotification(0);
  });

  expect(result.current.notifications[0].id).toBe('2');
});

it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
  const now = new Date();
  const startTime = parseHM(now.getTime() + 10 * 60 * 1000);

  const event: Event = {
    id: '1',
    title: '다람쥐 헌 쳇바퀴에 타고파',
    date: formatDate(now),
    startTime: startTime,
    endTime: '23:58',
    description: '가느다란 몸 부수어 쥔 총칼, 터, 평화',
    location: '장소',
    category: '분류',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 10,
  };

  const { result } = renderHook(() => useNotifications([event]));

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toHaveLength(1);

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toHaveLength(1);
});
