import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Heading, HStack, IconButton, Select, VStack } from '@chakra-ui/react';

import { MonthView } from '../../../feature/month-view/ui';
import { WeekView } from '../../../feature/week-view/ui';
import { Event } from '../../../types';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
  view: 'week' | 'month';
  holidays: Record<string, string>;
  filteredEvents: Event[];
  notifiedEvents: string[];
  currentDate: Date;
  navigate(direction: 'prev' | 'next'): void;
  getWeeksAtMonth(currentDate: Date): (number | null)[][];
  setView(value: React.SetStateAction<'week' | 'month'>): void;
}

function Calendar({
  view,
  holidays,
  filteredEvents,
  notifiedEvents,
  currentDate,
  navigate,
  getWeeksAtMonth,
  setView,
}: Props) {
  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>

      <HStack mx="auto" justifyContent="space-between">
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeftIcon />}
          onClick={() => navigate('prev')}
        />
        <Select
          aria-label="view"
          value={view}
          onChange={(e) => setView(e.target.value as 'week' | 'month')}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </Select>
        <IconButton
          aria-label="Next"
          icon={<ChevronRightIcon />}
          onClick={() => navigate('next')}
        />
      </HStack>

      {view === 'week' && (
        <WeekView
          weekDays={weekDays}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          currentDate={currentDate}
        />
      )}
      {view === 'month' && (
        <MonthView
          weekDays={weekDays}
          holidays={holidays}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          currentDate={currentDate}
          getWeeksAtMonth={getWeeksAtMonth}
        />
      )}
    </VStack>
  );
}

export default Calendar;
