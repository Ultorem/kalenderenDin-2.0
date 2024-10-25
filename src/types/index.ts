export interface Holiday {
  name: string;
  date: (year: number) => Date;
  type: 'fixed' | 'variable';
}

export interface CustomEvent {
  id: string;
  title: string;
  date: string;
  icon?: string;
  color?: string;
  description?: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface CalendarSettings {
  theme: Theme;
  customEvents: CustomEvent[];
}