import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import App from '../App';
import { server } from '../setupTests';
import { Event } from '../types';
import { setupMockHandlers } from '../__mocks__/handlersUtils';
import { formatDate } from '../utils/dateUtils';
import { parseHM } from './utils';

import { UserEvent, userEvent } from '@testing-library/user-event';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.

    setupMockHandlers();
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const now = new Date();
    const startTime = parseHM(now.getTime() + 10 * 60 * 1000);

    const form = {
      id: '1',
      title: '다람쥐 헌 쳇바퀴에 타고파',
      date: formatDate(now),
      startTime: startTime,
      endTime: '23:58',
      description: '가느다란 몸 부수어 쥔 총칼, 터, 평화',
      location: '장소',
      category: '기타',
    };

    await user.type(screen.getByLabelText('제목'), form.title);
    await user.type(screen.getByLabelText('날짜'), form.date);
    await user.type(screen.getByLabelText('시작 시간'), form.startTime);
    await user.type(screen.getByLabelText('종료 시간'), form.endTime);
    await user.type(screen.getByLabelText('설명'), form.description);
    await user.type(screen.getByLabelText('위치'), form.location);
    await user.type(screen.getByLabelText('카테고리'), form.category);

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

    await user.click(screen.getByRole('button', { name: '일정 추가' }));

    const eventList = screen.getByTestId('event-list');

    await waitFor(async () => {
      expect(within(eventList).getByText(form.title)).toBeInTheDocument();
      expect(within(eventList).getByText(form.date)).toBeInTheDocument();
      expect(
        within(eventList).getByText(`${form.startTime} - ${form.endTime}`)
      ).toBeInTheDocument();
      expect(within(eventList).getByText(form.description)).toBeInTheDocument();
      expect(within(eventList).getByText(form.location)).toBeInTheDocument();
      // expect(within(eventList).getByText(form.category)).toBeInTheDocument();
    });
  });

  it.skip('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {});

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
