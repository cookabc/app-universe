export type EventType = 'past' | 'future';

export type EventCategory = 'General' | 'Birthday' | 'Exam' | 'Meeting' | 'Holiday' | 'Anniversary';

export type RepeatOption = 'Never' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

export interface EventColor {
  name: string;
  bg: string;
  text: string;
}

export interface EventItem {
  id: string;
  name: string;
  date: Date;
  isAllDay: boolean;
  type: EventType;
  category: EventCategory;
  alertEnabled: boolean;
  repeatOption: RepeatOption;
  color: string;
  textColor: string;
}

export const EVENT_CATEGORIES: EventCategory[] = [
  'General',
  'Birthday',
  'Exam',
  'Meeting',
  'Holiday',
  'Anniversary'
];

export const REPEAT_OPTIONS: RepeatOption[] = [
  'Never',
  'Daily',
  'Weekly',
  'Monthly',
  'Yearly'
];

export const EVENT_COLORS: EventColor[] = [
  { name: 'teal', bg: '#1DE9B6', text: '#000000' },
  { name: 'yellow', bg: '#FFEA00', text: '#000000' },
  { name: 'orange', bg: '#FF6E40', text: '#000000' },
  { name: 'lime', bg: '#76FF03', text: '#000000' },
  { name: 'cyan', bg: '#00E5FF', text: '#000000' },
  { name: 'blue', bg: '#0288D1', text: '#FFFFFF' }, // Adjusted to match iOS #0288D1
  { name: 'red', bg: '#E54D3F', text: '#FFFFFF' },
  { name: 'cream', bg: '#EAE8E0', text: '#000000' }
];
