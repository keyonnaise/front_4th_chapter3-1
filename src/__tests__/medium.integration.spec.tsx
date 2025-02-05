import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act, waitFor, prettyDOM } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import { setupMockHandlers } from '../__mocks__/handlersUtils';
import { events } from '../__mocks__/response/mockEvents.json' assert { type: 'json' };
import App from '../App';
import { server } from '../setupTests';
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

    const eventList = await screen.findByTestId('event-list');

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

    const eventList = await screen.findByTestId('event-list');
    const buttons = await within(eventList).findAllByRole('button', { name: /edit event/i });

    await user.click(buttons[0]);

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

    const block = await within(eventList).findByTestId(MOCK_EVENTS[0].id);

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

  it.skip('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {});
});

describe.skip('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {});

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {});

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {});

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {});

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {});
});

describe.skip('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {});

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {});

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {});
});

describe.skip('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {});

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {});
});

it.skip('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {});
