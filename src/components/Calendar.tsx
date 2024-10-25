import React, { useState } from 'react';
import { isHoliday, isSunday } from '../utils/norwegianHolidays';
import EventModal from './EventModal';
import type { CustomEvent } from '../types';

interface CalendarProps {
  year: number;
  events: CustomEvent[];
  onAddEvent: (event: CustomEvent) => void;
  onRemoveEvent: (id: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  year, 
  events,
  onAddEvent,
  onRemoveEvent 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const today = new Date();
  
  const months = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  const getWeekNumber = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const renderMonth = (month: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];
    let currentWeek: number | null = null;
    let weekCount = 0;

    // Adjust for Norwegian calendar (Monday is first day)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Calculate weeks for the entire month
    const weeks = [];
    let currentDate = new Date(year, month, 1);
    while (currentDate.getMonth() === month) {
      const weekNum = getWeekNumber(currentDate);
      if (!weeks.includes(weekNum)) {
        weeks.push(weekNum);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<td key={`empty-${i}`} className="h-12 bg-white dark:bg-gray-800" />);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const holiday = isHoliday(date);
      const sunday = isSunday(date);
      const isSpecialDay = holiday || sunday;
      const dateEvents = getEventsForDate(date);
      const isToday = today.getDate() === day && 
                      today.getMonth() === month && 
                      today.getFullYear() === year;

      days.push(
        <td key={day} className="p-0">
          <button
            onClick={() => setSelectedDate(date)}
            className={`
              h-12 w-full flex flex-col items-center justify-center relative
              bg-white dark:bg-gray-800
              hover:bg-gray-100 dark:hover:bg-gray-700 
              transition-colors
              ${isSpecialDay ? 'text-red-600 dark:text-red-400 font-semibold' : ''}
              ${isToday ? 'ring-2 ring-red-600 dark:ring-red-400' : ''}
              print:hover:bg-transparent print:ring-1 print:ring-gray-200
            `}
            title={holiday?.name}
          >
            <span className="text-sm">{day}</span>
            {(holiday || dateEvents.length > 0) && (
              <div className="flex space-x-1 absolute bottom-1">
                {holiday && (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400" />
                )}
                {dateEvents.map((event, i) => (
                  <div 
                    key={event.id}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                ))}
              </div>
            )}
          </button>
        </td>
      );
    }

    // Create table rows with week numbers
    const rows = [];
    let weekDays = [];
    let weekIndex = 0;

    for (let i = 0; i < days.length; i++) {
      if (i % 7 === 0 && i !== 0) {
        rows.push(
          <tr key={`week-${weekIndex}`}>
            <td className="w-12 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 print:text-black">
              {weeks[weekIndex]}
            </td>
            {weekDays}
          </tr>
        );
        weekDays = [];
        weekIndex++;
      }
      weekDays.push(days[i]);
    }

    // Add the last row if there are remaining days
    if (weekDays.length > 0) {
      while (weekDays.length < 7) {
        weekDays.push(
          <td key={`empty-end-${weekDays.length}`} className="h-12 bg-white dark:bg-gray-800" />
        );
      }
      rows.push(
        <tr key={`week-${weekIndex}`}>
          <td className="w-12 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 print:text-black">
            {weeks[weekIndex]}
          </td>
          {weekDays}
        </tr>
      );
    }

    return (
      <div key={month} className="mb-8 print:mb-12">
        <h3 className="text-lg font-semibold mb-4">{months[month]}</h3>
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="w-12 bg-white dark:bg-gray-800 text-sm font-medium p-2 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Uke
              </th>
              {['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'].map(day => (
                <th key={day} className="bg-white dark:bg-gray-800 text-sm font-medium p-2 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {months.map((_, index) => renderMonth(index))}
      </div>

      {selectedDate && (
        <EventModal
          date={selectedDate}
          holiday={isHoliday(selectedDate)}
          events={getEventsForDate(selectedDate)}
          onClose={() => setSelectedDate(null)}
          onAddEvent={onAddEvent}
        />
      )}
    </>
  );
};

export default Calendar;