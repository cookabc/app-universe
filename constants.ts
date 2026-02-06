import { EventItem } from "./types";

export const MOCK_EVENTS: EventItem[] = [
  {
    id: '1',
    name: 'Exam',
    date: new Date('2026-01-31T09:00:00'),
    type: 'future',
    category: 'Education',
    color: '#1DE9B6',
    textColor: '#000000'
  },
  {
    id: '2',
    name: 'Birthday Party',
    date: new Date('2025-01-10T14:00:00'),
    type: 'past',
    category: 'Personal',
    color: '#FFEA00',
    textColor: '#000000'
  },
  {
    id: '3',
    name: 'Project Deadline',
    date: new Date('2026-02-20T17:00:00'),
    type: 'future',
    category: 'Work',
    color: '#FF6E40',
    textColor: '#000000'
  },
  {
    id: '4',
    name: 'Vacation',
    date: new Date('2026-01-20T08:00:00'),
    type: 'future',
    category: 'Travel',
    color: '#76FF03',
    textColor: '#000000'
  },
  {
    id: '5',
    name: 'Conference',
    date: new Date('2026-01-20T09:00:00'),
    type: 'future',
    category: 'Work',
    color: '#00E5FF',
    textColor: '#000000'
  },
];