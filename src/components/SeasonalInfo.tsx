import React from 'react';
import { Sun, Snowflake, Leaf } from 'lucide-react';
import { norwegianHolidays } from '../utils/norwegianHolidays';
import type { SeasonalEvent } from '../types/calendar';

interface SeasonalInfoProps {
  year: number;
}

const SeasonalInfo: React.FC<SeasonalInfoProps> = ({ year }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('no', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getDSTStart = (year: number) => {
    // Last Sunday in March
    const date = new Date(year, 2, 31);
    while (date.getDay() !== 0) {
      date.setDate(date.getDate() - 1);
    }
    return date;
  };

  const getDSTEnd = (year: number) => {
    // Last Sunday in October
    const date = new Date(year, 9, 31);
    while (date.getDay() !== 0) {
      date.setDate(date.getDate() - 1);
    }
    return date;
  };

  const seasons: SeasonalEvent[] = [
    {
      name: 'Påske',
      date: norwegianHolidays.getEasterDate(year),
      icon: 'Sun'
    },
    {
      name: 'Vinterferie',
      date: `Uke ${year % 2 === 0 ? '8' : '9'}`,
      icon: 'Snowflake'
    },
    {
      name: 'Sommertid',
      date: getDSTStart(year),
      icon: 'Sun'
    },
    {
      name: 'Høstferie',
      date: 'Uke 40',
      icon: 'Leaf'
    },
    {
      name: 'Vintertid',
      date: getDSTEnd(year),
      icon: 'Snowflake'
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5" />;
      case 'Snowflake':
        return <Snowflake className="w-5 h-5" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5" />;
      default:
        return <Sun className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {seasons.map(season => (
        <button
          key={season.name}
          className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          {getIcon(season.icon)}
          <span className="font-medium mt-2">{season.name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {season.date instanceof Date ? formatDate(season.date) : season.date}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SeasonalInfo;