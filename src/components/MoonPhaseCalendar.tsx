import React, { useState } from 'react';
import { Moon, ChevronLeft, ChevronRight } from 'lucide-react';

interface MoonPhaseCalendarProps {
  year: number;
  month: number;
}

const MoonPhaseCalendar: React.FC<MoonPhaseCalendarProps> = ({ year, initialMonth }) => {
  const [month, setMonth] = useState(initialMonth);
  
  const getMoonPhase = (date: Date): { phase: string; illumination: number } => {
    const synodic = 29.53058867; // Synodic month length in days
    const reference = new Date(2000, 0, 6, 18, 14); // Known new moon
    const diff = date.getTime() - reference.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    const cycles = days / synodic;
    const phase = cycles % 1;
    
    let phaseName: string;
    const illumination = Math.abs(Math.cos(phase * 2 * Math.PI));

    if (phase < 0.0625 || phase >= 0.9375) phaseName = 'Nymåne';
    else if (phase < 0.1875) phaseName = 'Voksende månesigd';
    else if (phase < 0.3125) phaseName = 'Første kvarter';
    else if (phase < 0.4375) phaseName = 'Voksende måne';
    else if (phase < 0.5625) phaseName = 'Fullmåne';
    else if (phase < 0.6875) phaseName = 'Avtagende måne';
    else if (phase < 0.8125) phaseName = 'Siste kvarter';
    else phaseName = 'Avtagende månesigd';

    return { phase: phaseName, illumination };
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const months = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  const getMoonIcon = (phase: string, illumination: number) => {
    switch (phase) {
      case 'Nymåne':
        return (
          <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-300 border-2 border-gray-300 dark:border-gray-600" />
        );
      case 'Fullmåne':
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-gray-100 border-2 border-gray-300 dark:border-gray-600 shadow-inner" />
        );
      case 'Første kvarter':
        return (
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
            <div className="w-4 h-8 bg-gray-800 dark:bg-gray-300 float-left" />
            <div className="w-4 h-8 bg-yellow-100 dark:bg-gray-100 float-left" />
          </div>
        );
      case 'Siste kvarter':
        return (
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
            <div className="w-4 h-8 bg-yellow-100 dark:bg-gray-100 float-left" />
            <div className="w-4 h-8 bg-gray-800 dark:bg-gray-300 float-left" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
            <div 
              className="w-8 h-8 bg-gradient-to-r from-gray-800 to-yellow-100 dark:from-gray-300 dark:to-gray-100"
              style={{
                transform: `scaleX(${phase.includes('Voksende') ? -1 : 1})`,
                opacity: illumination
              }}
            />
          </div>
        );
    }
  };

  const changeMonth = (delta: number) => {
    const newMonth = month + delta;
    if (newMonth < 0) {
      setMonth(11);
    } else if (newMonth > 11) {
      setMonth(0);
    } else {
      setMonth(newMonth);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Moon className="w-6 h-6" />
          Månefaser
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium min-w-[120px] text-center">
            {months[month]}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        {Array.from({ length: new Date(year, month, 1).getDay() - 1 }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(day => {
          const date = new Date(year, month, day);
          const { phase, illumination } = getMoonPhase(date);
          const isToday = isCurrentMonth && today.getDate() === day;
          
          return (
            <div
              key={day}
              className={`
                aspect-square flex flex-col items-center justify-center p-2 rounded-lg
                ${isToday 
                  ? 'bg-red-50 dark:bg-red-900/20 ring-2 ring-red-500' 
                  : 'bg-gray-50 dark:bg-gray-700'
                }
              `}
            >
              <span className={`text-sm mb-1 ${isToday ? 'font-bold text-red-500' : ''}`}>
                {day}
              </span>
              {getMoonIcon(phase, illumination)}
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                {phase}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoonPhaseCalendar;