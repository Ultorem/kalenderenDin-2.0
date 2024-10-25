import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import type { Theme } from '../types';

interface ThemeToggleProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onChange }) => {
  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun className="w-4 h-4" />, label: 'Lys' },
    { value: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Mørk' },
    { value: 'system', icon: <Laptop className="w-4 h-4" />, label: 'System' },
  ];

  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow p-1">
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded
            ${theme === value 
              ? 'bg-red-600 text-white' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
          title={label}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;