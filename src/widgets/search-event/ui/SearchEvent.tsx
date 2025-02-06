import { FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';

import { EventCard } from '../../../entities/schedule/ui';
import { Event } from '../../../types';

interface Props {
  searchTerm: string;
  filteredEvents: Event[];
  notifiedEvents: string[];
  notificationOptions: { value: number; label: string }[];
  setSearchTerm(value: React.SetStateAction<string>): void;
  editEvent(event: Event): void;
  deleteEvent(id: string): Promise<void>;
}

function SearchEvent({
  searchTerm,
  filteredEvents,
  notifiedEvents,
  notificationOptions,
  setSearchTerm,
  editEvent,
  deleteEvent,
}: Props) {
  return (
    <VStack data-testid="event-list" w="500px" h="full" overflowY="auto">
      <FormControl>
        <FormLabel>일정 검색</FormLabel>
        <Input
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormControl>

      {filteredEvents.length === 0 ? (
        <Text>검색 결과가 없습니다.</Text>
      ) : (
        filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            notifiedEvents={notifiedEvents}
            notificationOptions={notificationOptions}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
        ))
      )}
    </VStack>
  );
}

export default SearchEvent;
