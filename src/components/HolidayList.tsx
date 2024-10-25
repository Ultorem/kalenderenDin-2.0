import React from 'react';
import { getHolidays } from '../utils/norwegianHolidays';
import { type Holiday } from '../types/calendar';

interface HolidayListProps {
  year: number;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const HolidayList: React.FC<HolidayListProps> = ({ year }) => {
  const holidays: Holiday[] = getHolidays(year);

  return (
    <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Norske helligdager {year}
      </h2>
      <div className="grid gap-2">
        {holidays.map((holiday, index) => (
          <div 
            key={`${holiday.name}-${index}`}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center"
          >
            <span className="font-medium text-gray-800 dark:text-white">
              {holiday.name}
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              {formatDate(holiday.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayList;