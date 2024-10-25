import React from 'react';
import { Moon } from 'lucide-react';

interface MoonPhase {
  date: Date;
  phase: 'new' | 'first-quarter' | 'full' | 'last-quarter';
  name: string;
}

const MoonPhases: React.FC<{ year: number; month: number }> = ({ year, month }) => {
  const getMoonPhases = (year: number, month: number): MoonPhase[] => {
    const phases: MoonPhase[] = [];
    const lunarMonth = 29.530588853; // Length of synodic month (days)
    const baseDate = new Date(2000, 0, 6, 18, 14); // Known new moon
    const date = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    while (date <= endDate) {
      const daysSinceBase = (date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24);
      const currentAge = (daysSinceBase % lunarMonth + lunarMonth) % lunarMonth;
      
      if (currentAge < 1) {
        phases.push({ date: new Date(date), phase: 'new', name: 'Nymåne' });
      } else if (Math.abs(currentAge - 7.4) < 1) {
        phases.push({ date: new Date(date), phase: 'first-quarter', name: 'Første kvarter' });
      } else if (Math.abs(currentAge - 14.8) < 1) {
        phases.push({ date: new Date(date), phase: 'full', name: 'Fullmåne' });
      } else if (Math.abs(currentAge - 22.1) < 1) {
        phases.push({ date: new Date(date), phase: 'last-quarter', name: 'Siste kvarter' });
      }
      
      date.setDate(date.getDate() + 1);
    }
    
    return phases;
  };

  const phases = getMoonPhases(year, month);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Moon className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Månefaser</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {phases.map((phase, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <div className="relative w-12 h-12">
              {phase.phase === 'new' && (
                <div className="w-12 h-12 rounded-full bg-gray-900 dark:bg-gray-200" />
              )}
              {phase.phase === 'first-quarter' && (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-900 dark:from-gray-200 to-white dark:to-gray-800" />
              )}
              {phase.phase === 'full' && (
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-200 border border-gray-200 dark:border-gray-700" />
              )}
              {phase.phase === 'last-quarter' && (
                <div className="w-12 h-12 rounded-full bg-gradient-to-l from-gray-900 dark:from-gray-200 to-white dark:to-gray-800" />
              )}
            </div>
            <div>
              <div className="font-medium">{phase.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {phase.date.toLocaleDateString('nb-NO', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoonPhases;