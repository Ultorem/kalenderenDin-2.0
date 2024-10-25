import React, { useState, useEffect } from 'react';
import { Droplet } from 'lucide-react';

const DAILY_GOAL = 8; // 8 glasses per day

const WaterTracker: React.FC = () => {
  const [glasses, setGlasses] = useState(() => {
    const saved = localStorage.getItem('waterTracker');
    if (saved) {
      const { count, date } = JSON.parse(saved);
      // Reset if it's a new day
      if (date !== new Date().toDateString()) {
        return 0;
      }
      return count;
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem('waterTracker', JSON.stringify({
      count: glasses,
      date: new Date().toDateString()
    }));
  }, [glasses]);

  const addGlass = () => {
    if (glasses < DAILY_GOAL) {
      setGlasses(prev => prev + 1);
    }
  };

  const removeGlass = () => {
    if (glasses > 0) {
      setGlasses(prev => prev - 1);
    }
  };

  const progress = (glasses / DAILY_GOAL) * 100;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Droplet className="w-5 h-5" />
        Vanninntak
      </h3>

      <div className="relative h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full overflow-hidden">
        <div
          className="absolute inset-0 bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
          {glasses} av {DAILY_GOAL} glass
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={removeGlass}
          className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full hover:bg-red-200 transition-colors"
          disabled={glasses === 0}
        >
          <span className="text-xl">-</span>
        </button>

        <div className="flex gap-1">
          {Array.from({ length: DAILY_GOAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => i < glasses ? setGlasses(i) : setGlasses(i + 1)}
              className={`
                w-6 h-8 rounded-full transition-all duration-300
                ${i < glasses
                  ? 'bg-blue-500 hover:bg-blue-600 scale-100'
                  : 'bg-blue-100 dark:bg-blue-900/20 scale-90 hover:scale-95'
                }
              `}
            />
          ))}
        </div>

        <button
          onClick={addGlass}
          className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full hover:bg-green-200 transition-colors"
          disabled={glasses === DAILY_GOAL}
        >
          <span className="text-xl">+</span>
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;