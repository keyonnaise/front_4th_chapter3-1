import { BellIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Text, VStack } from '@chakra-ui/react';

import { Event } from '../../../types';

interface Props {
  event: Event;
  notifiedEvents: string[];
  notificationOptions: { value: number; label: string }[];
  editEvent(event: Event): void;
  deleteEvent(id: string): Promise<void>;
}

function EventCard({ event, notifiedEvents, notificationOptions, editEvent, deleteEvent }: Props) {
  const {
    id,
    title,
    date,
    startTime,
    endTime,
    description,
    location,
    category,
    repeat,
    notificationTime,
  } = event;

  return (
    <Box borderWidth={1} borderRadius="lg" p={3} width="100%" data-testid={id}>
      <HStack justifyContent="space-between">
        <VStack align="start">
          <HStack>
            {notifiedEvents.includes(id) && <BellIcon color="red.500" />}
            <Text
              fontWeight={notifiedEvents.includes(id) ? 'bold' : 'normal'}
              color={notifiedEvents.includes(id) ? 'red.500' : 'inherit'}
            >
              {title}
            </Text>
          </HStack>
          <Text>{date}</Text>
          <Text>
            {startTime} - {endTime}
          </Text>
          <Text>{description}</Text>
          <Text>{location}</Text>
          <Text>카테고리: {category}</Text>
          {repeat.type !== 'none' && (
            <Text>
              반복: {repeat.interval}
              {repeat.type === 'daily' && '일'}
              {repeat.type === 'weekly' && '주'}
              {repeat.type === 'monthly' && '월'}
              {repeat.type === 'yearly' && '년'}
              마다
              {repeat.endDate && ` (종료: ${repeat.endDate})`}
            </Text>
          )}
          <Text>
            알림:{' '}
            {
              notificationOptions.find((option) => {
                return option.value === notificationTime;
              })?.label
            }
          </Text>
        </VStack>
        <HStack>
          <IconButton
            aria-label="Edit event"
            icon={<EditIcon />}
            onClick={() => editEvent(event)}
          />
          <IconButton
            aria-label="Delete event"
            icon={<DeleteIcon />}
            onClick={() => deleteEvent(id)}
          />
        </HStack>
      </HStack>
    </Box>
  );
}

export default EventCard;
