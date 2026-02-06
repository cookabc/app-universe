export interface EventItem {
  id: string;
  name: string;
  date: Date;
  type: 'past' | 'future';
  category: string;
  color: string;
  textColor: string;
}

export const EVENT_COLORS = [
  { bg: '#1DE9B6', text: '#000000' }, // Teal
  { bg: '#FFEA00', text: '#000000' }, // Yellow
  { bg: '#FF6E40', text: '#000000' }, // Orange
  { bg: '#76FF03', text: '#000000' }, // Lime
  { bg: '#00E5FF', text: '#000000' }, // Cyan
  { bg: '#2979FF', text: '#FFFFFF' }, // Blue
];
