import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, waitFor } from '@testing-library/react';

import { events } from '../__mocks__/response/mockEvents.json' assert { type: 'json' };
import { EventCard } from '../entities/schedule/ui';
import { Event } from '../types';
import { SearchEvent } from '../widgets/search-event/ui';

const MOCK_EVENTS = events as Event[];

describe('<SearchEvent />', () => {
  it('컴포넌트가 주어진 이벤트 목록을 모두 렌더링 한다.', async () => {
    render(
      <ChakraProvider>
        <SearchEvent
          searchTerm=""
          filteredEvents={MOCK_EVENTS}
          notifiedEvents={[]}
          notificationOptions={[]}
          setSearchTerm={() => {}}
          editEvent={() => {}}
          deleteEvent={async () => {}}
        />
      </ChakraProvider>
    );

    const eventList = await screen.findByTestId('event-list');
    const blocks = await within(eventList).findAllByTestId(/.*/);

    expect(blocks).toHaveLength(MOCK_EVENTS.length);
  });
});

describe('<EventCard />', () => {
  it('컴포넌트가 주어진 데이터 값을 모두 포함해 렌더링 한다.', async () => {
    const event = MOCK_EVENTS[0];

    render(
      <ChakraProvider>
        <EventCard
          event={event}
          notifiedEvents={[]}
          notificationOptions={[]}
          editEvent={() => {}}
          deleteEvent={async () => {}}
        />
      </ChakraProvider>
    );

    const card = screen.getByTestId(new RegExp(event.id));

    const title = new RegExp(event.title);
    const date = new RegExp(event.date);
    const eventTime = new RegExp(`${event.startTime} - ${event.endTime}`);
    const description = new RegExp(event.description);
    const location = new RegExp(event.location);
    const category = new RegExp(event.category);

    await waitFor(() => {
      expect(within(card).getByText(title)).toBeInTheDocument();
      expect(within(card).getByText(date)).toBeInTheDocument();
      expect(within(card).getByText(eventTime)).toBeInTheDocument();
      expect(within(card).getByText(description)).toBeInTheDocument();
      expect(within(card).getByText(location)).toBeInTheDocument();
      expect(within(card).getByText(category)).toBeInTheDocument();
    });
  });
});
