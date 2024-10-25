export interface Holiday {
  name: string;
  date: Date;
  type: 'fixed' | 'variable';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'birthday' | 'event' | 'reminder';
  icon?: string;
}