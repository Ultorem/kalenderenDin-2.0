import { type Holiday } from '../types/calendar';

export const getEasterDate = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
};

export const getHolidays = (year: number): Holiday[] => {
  const easter = getEasterDate(year);
  const easterDay = easter.getDate();
  const easterMonth = easter.getMonth();

  const holidays: Holiday[] = [
    {
      name: 'Nyttårsdag',
      date: new Date(year, 0, 1),
      type: 'fixed',
    },
    {
      name: 'Palmesøndag',
      date: new Date(year, easterMonth, easterDay - 7),
      type: 'variable',
    },
    {
      name: 'Skjærtorsdag',
      date: new Date(year, easterMonth, easterDay - 3),
      type: 'variable',
    },
    {
      name: 'Langfredag',
      date: new Date(year, easterMonth, easterDay - 2),
      type: 'variable',
    },
    {
      name: '1. påskedag',
      date: easter,
      type: 'variable',
    },
    {
      name: '2. påskedag',
      date: new Date(year, easterMonth, easterDay + 1),
      type: 'variable',
    },
    {
      name: 'Arbeidernes dag',
      date: new Date(year, 4, 1),
      type: 'fixed',
    },
    {
      name: 'Grunnlovsdagen',
      date: new Date(year, 4, 17),
      type: 'fixed',
    },
    {
      name: 'Kristi himmelfartsdag',
      date: new Date(year, easterMonth, easterDay + 39),
      type: 'variable',
    },
    {
      name: '1. pinsedag',
      date: new Date(year, easterMonth, easterDay + 49),
      type: 'variable',
    },
    {
      name: '2. pinsedag',
      date: new Date(year, easterMonth, easterDay + 50),
      type: 'variable',
    },
    {
      name: '1. juledag',
      date: new Date(year, 11, 25),
      type: 'fixed',
    },
    {
      name: '2. juledag',
      date: new Date(year, 11, 26),
      type: 'fixed',
    },
  ];

  return holidays;
};

export const isHoliday = (date: Date): Holiday | undefined => {
  const holidays = getHolidays(date.getFullYear());
  return holidays.find(holiday => 
    holiday.date.getDate() === date.getDate() &&
    holiday.date.getMonth() === date.getMonth()
  );
};

export const isSunday = (date: Date): boolean => {
  return date.getDay() === 0;
};

export const norwegianHolidays = {
  getEasterDate,
  getHolidays,
  isHoliday,
  isSunday,
};