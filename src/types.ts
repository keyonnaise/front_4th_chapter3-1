import { z } from 'zod';

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
}

export interface EventForm {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;
  notificationTime: number; // 분 단위로 저장
}

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string(),
  location: z.string(),
  category: z.string(),
  repeat: z.object({
    type: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']),
    interval: z.number(),
    endDate: z.string().optional(),
  }),
  notificationTime: z.number(),
});

export type Event = z.infer<typeof EventSchema>;

// export interface Event extends EventForm {
//   id: string;
// }
