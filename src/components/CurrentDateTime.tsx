import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const CurrentDateTime: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const getTimeEmoji = (hours: number): string => {
    if (hours >= 6 && hours < 18) {
      return '☀️';
    } else {
      return '🌙';
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 rounded-lg shadow-lg p-6 mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6" />
          <div className="text-2xl font-bold">
            {date.toLocaleDateString('nb-NO', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">Uke {getWeekNumber(date)}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <span className="text-2xl font-bold">
              {date.toLocaleTimeString('nb-NO', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
            <span className="text-2xl">{getTimeEmoji(date.getHours())}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentDateTime;