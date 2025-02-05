import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, waitFor } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';

import { setupMockHandlers } from '../__mocks__/handlersUtils';
import { events } from '../__mocks__/response/mockEvents.json' assert { type: 'json' };
import App from '../App';
import { Event } from '../types';
import { parseHM } from './utils';
import { formatDate } from '../utils/dateUtils';

const MOCK_EVENTS = events as Event[];

let user: UserEvent;

beforeEach(() => {
  vi.setSystemTime(new Date('2024-10-01'));
  user = userEvent.setup();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.

    setupMockHandlers([]);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const now = new Date();

    const form = {
      title: '다람쥐 헌 쳇바퀴에 타고파',
      date: formatDate(now),
      startTime: '23:00',
      endTime: '23:58',
      description: '가느다란 몸 부수어 쥔 총칼, 터, 평화',
      location: '장소',
      category: '기타',
    };

    await user.type(screen.getByLabelText(/제목/), form.title);
    await user.type(screen.getByLabelText(/날짜/), form.date);
    await user.type(screen.getByLabelText(/시작 시간/), form.startTime);
    await user.type(screen.getByLabelText(/종료 시간/), form.endTime);
    await user.type(screen.getByLabelText(/설명/), form.description);
    await user.type(screen.getByLabelText(/위치/), form.location);
    await user.selectOptions(screen.getByLabelText(/카테고리/), form.category);

    // Promise.all 왜 안됨?
    // await Promise.all([
    //   user.type(screen.getByLabelText('제목'), form.title),
    //   user.type(screen.getByLabelText('날짜'), form.date),
    //   user.type(screen.getByLabelText('시작 시간'), form.startTime),
    //   user.type(screen.getByLabelText('종료 시간'), form.endTime),
    //   user.type(screen.getByLabelText('설명'), form.description),
    //   user.type(screen.getByLabelText('위치'), form.location),
    //   user.type(screen.getByLabelText('카테고리'), form.category),
    // ]);

    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    const eventList = await screen.findByTestId(/event-list/i);

    await waitFor(() => {
      const title = new RegExp(form.title);
      const date = new RegExp(form.date);
      const eventTime = new RegExp(`${form.startTime} - ${form.endTime}`);
      const description = new RegExp(form.description);
      const location = new RegExp(form.location);
      const category = new RegExp(form.category);

      expect(within(eventList).getByText(title)).toBeInTheDocument();
      expect(within(eventList).getByText(date)).toBeInTheDocument();
      expect(within(eventList).getByText(eventTime)).toBeInTheDocument();
      expect(within(eventList).getByText(description)).toBeInTheDocument();
      expect(within(eventList).getByText(location)).toBeInTheDocument();
      expect(within(eventList).getByText(category)).toBeInTheDocument();
    });
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    setupMockHandlers(MOCK_EVENTS);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const eventList = await screen.findByTestId(/event-list/i);
    const block = await within(eventList).findByTestId(MOCK_EVENTS[0].id);
    const button = await within(block).findByRole('button', { name: /edit event/i });

    await user.click(button);

    const now = new Date();

    const form = {
      title: '다람쥐 헌 쳇바퀴에 타고파',
      date: formatDate(now),
      startTime: '23:00',
      endTime: '23:58',
      description: '가느다란 몸 부수어 쥔 총칼, 터, 평화',
      location: '장소',
      category: '기타',
    };

    await user.clear(screen.getByLabelText(/제목/));
    await user.type(screen.getByLabelText(/제목/), form.title);
    await user.clear(screen.getByLabelText(/날짜/));
    await user.type(screen.getByLabelText(/날짜/), form.date);
    await user.clear(screen.getByLabelText(/시작 시간/));
    await user.type(screen.getByLabelText(/시작 시간/), form.startTime);
    await user.clear(screen.getByLabelText(/종료 시간/));
    await user.type(screen.getByLabelText(/종료 시간/), form.endTime);
    await user.clear(screen.getByLabelText(/설명/));
    await user.type(screen.getByLabelText(/설명/), form.description);
    await user.clear(screen.getByLabelText(/위치/));
    await user.type(screen.getByLabelText(/위치/), form.location);
    await user.selectOptions(screen.getByLabelText(/카테고리/), form.category);

    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    const title = new RegExp(form.title);
    const date = new RegExp(form.date);
    const eventTime = new RegExp(`${form.startTime} - ${form.endTime}`);
    const description = new RegExp(form.description);
    const location = new RegExp(form.location);
    const category = new RegExp(form.category);

    expect(within(block).getByText(title)).toBeInTheDocument();
    expect(within(block).getByText(date)).toBeInTheDocument();
    expect(within(block).getByText(eventTime)).toBeInTheDocument();
    expect(within(block).getByText(description)).toBeInTheDocument();
    expect(within(block).getByText(location)).toBeInTheDocument();
    expect(within(block).getByText(category)).toBeInTheDocument();
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    setupMockHandlers(MOCK_EVENTS);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const eventList = await screen.findByTestId('event-list');
    const block = await within(eventList).findByTestId(MOCK_EVENTS[0].id);
    const button = await within(block).findByRole('button', { name: /delete event/i });

    await user.click(button);

    await waitFor(() => {
      expect(block).not.toBeInTheDocument();
    });
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    setupMockHandlers([{ ...MOCK_EVENTS[0], date: '9999-12-31' }]);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.selectOptions(screen.getByLabelText(/view/), 'week');

    const eventList = await screen.findByTestId(/event-list/i);

    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    setupMockHandlers([MOCK_EVENTS[0]]);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.selectOptions(screen.getByLabelText(/view/), 'week');

    const eventList = await screen.findByTestId(/event-list/i);
    const block = await within(eventList).findByTestId(MOCK_EVENTS[0].id);

    expect(within(block).getByText(/기존 회의/)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    setupMockHandlers([{ ...MOCK_EVENTS[0], date: '9999-12-31' }]);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const eventList = await screen.findByTestId(/event-list/i);

    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    setupMockHandlers([MOCK_EVENTS[0]]);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const eventList = await screen.findByTestId(/event-list/i);
    const block = await within(eventList).findByTestId(MOCK_EVENTS[0].id);

    expect(within(block).getByText(/기존 회의/)).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    const date = new Date('2024-01-01');
    vi.setSystemTime(date);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const monthView = await screen.findByTestId(/month-view/);

    expect(within(monthView).getByText(/신정/)).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    setupMockHandlers(MOCK_EVENTS);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.type(screen.getByLabelText(/일정 검색/), '힘들다 힘들다 힘들다 힘들다다');

    const eventList = await screen.findByTestId('event-list');

    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();
  });

  it("'기존 팀 미팅'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    setupMockHandlers(MOCK_EVENTS);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const eventList = await screen.findByTestId('event-list');

    await user.type(screen.getByPlaceholderText(/검색어를 입력하세요/), '기존 팀 미팅');

    expect(within(eventList).getByText('기존 팀 미팅')).toBeInTheDocument();
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    setupMockHandlers(MOCK_EVENTS);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const eventList = await screen.findByTestId('event-list');
    const blocks = await Promise.all(
      MOCK_EVENTS.map(async (event) => await within(eventList).findByTestId(event.id))
    );

    await user.type(screen.getByLabelText(/일정 검색/), '힘들다 힘들다 힘들다 힘들다다');

    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/일정 검색/));

    expect(blocks.length).toBe(MOCK_EVENTS.length);
  });
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    setupMockHandlers(MOCK_EVENTS);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    await user.type(screen.getByLabelText(/제목/), '다다람람쥐쥐');
    await user.type(screen.getByLabelText(/날짜/), formatDate(new Date()));
    await user.type(screen.getByLabelText(/시작 시간/), '09:00');
    await user.type(screen.getByLabelText(/종료 시간/), '10:00');

    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    setupMockHandlers(MOCK_EVENTS);

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const eventList = await screen.findByTestId(/event-list/i);
    const block = await within(eventList).findByTestId(MOCK_EVENTS[0].id);
    const button = await within(block).findByRole('button', { name: /edit event/i });

    await user.click(button);

    await user.clear(screen.getByLabelText(/시작 시간/));
    await user.type(screen.getByLabelText(/시작 시간/), '11:00');
    await user.clear(screen.getByLabelText(/종료 시간/));
    await user.type(screen.getByLabelText(/종료 시간/), '12:00');

    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    expect(screen.getByText(/일정 겹침 경고/)).toBeInTheDocument();
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  const now = new Date();
  const startTime = parseHM(now.getTime() + 10 * 60 * 1000);

  setupMockHandlers([{ ...MOCK_EVENTS[0], startTime }]);

  render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/일정이 시작됩니다./)).toBeInTheDocument();
  });
});
