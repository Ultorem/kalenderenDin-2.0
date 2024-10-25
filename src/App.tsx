import React, { useState } from 'react';
import { Calendar as CalendarIcon, Moon } from 'lucide-react';
import Calendar from './components/Calendar';
import HolidayList from './components/HolidayList';
import ThemeToggle from './components/ThemeToggle';
import SeasonalInfo from './components/SeasonalInfo';
import ExportButton from './components/ExportButton';
import CurrentDateTime from './components/CurrentDateTime';
import Sidebar from './components/Sidebar';
import MoonPhaseCalendar from './components/MoonPhaseCalendar';
import PostItNotes from './components/PostItNotes';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { CustomEvent } from './types';

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showMoonPhases, setShowMoonPhases] = useState(false);
  const { theme, setTheme } = useTheme();
  const { events, addEvent, removeEvent } = useLocalStorage();
  
  const years = Array.from(
    { length: 11 },
    (_, i) => currentYear - 5 + i
  );

  const handleExport = (format: 'json' | 'csv' | 'png') => {
    const data = {
      events,
      settings: { theme }
    };

    switch (format) {
      case 'json':
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadFile(jsonBlob, `norsk-kalender-${selectedYear}.json`);
        break;
      case 'csv':
        const csvContent = generateCSV(events);
        const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        downloadFile(csvBlob, `norsk-kalender-${selectedYear}.csv`);
        break;
      case 'png':
        exportToPNG();
        break;
    }
  };

  const generateCSV = (events: CustomEvent[]): string => {
    const headers = ['Dato', 'Tittel', 'Beskrivelse', 'Type'];
    const rows = events.map(event => [
      new Date(event.date).toLocaleDateString('nb-NO'),
      event.title,
      event.description || '',
      'Egendefinert'
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPNG = () => {
    const calendarElement = document.getElementById('calendar-container');
    if (!calendarElement) return;

    import('html-to-image').then(htmlToImage => {
      htmlToImage.toPng(calendarElement)
        .then(dataUrl => {
          const link = document.createElement('a');
          link.download = `norsk-kalender-${selectedYear}.png`;
          link.href = dataUrl;
          link.click();
        });
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-8 h-8 text-red-600" />
              <h1 className="text-3xl font-bold">
                Norsk Kalender
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMoonPhases(!showMoonPhases)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  ${showMoonPhases
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  }
                  shadow-sm transition-colors
                `}
              >
                <Moon className="w-5 h-5" />
                <span>Månefaser</span>
              </button>
              <ThemeToggle theme={theme} onChange={setTheme} />
              <ExportButton 
                onExport={handleExport} 
                onPrint={handlePrint} 
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CurrentDateTime />
        
        <div className="no-print">
          <SeasonalInfo year={selectedYear} />
        </div>

        {showMoonPhases && (
          <div className="mb-8">
            <MoonPhaseCalendar year={selectedYear} initialMonth={new Date().getMonth()} />
          </div>
        )}

        <div className="flex justify-center mb-8 no-print">
          <div className="inline-flex rounded-md shadow-sm">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`
                  px-4 py-2 text-sm font-medium
                  ${year === selectedYear
                    ? 'bg-red-600 text-white dark:bg-red-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  }
                  ${year === years[0] ? 'rounded-l-md' : ''}
                  ${year === years[years.length - 1] ? 'rounded-r-md' : ''}
                  border border-gray-300 dark:border-gray-600
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:z-10
                `}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div id="calendar-container" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <Calendar 
            year={selectedYear} 
            events={events}
            onAddEvent={addEvent}
            onRemoveEvent={removeEvent}
          />
        </div>

        <div className="mb-8">
          <PostItNotes />
        </div>

        <HolidayList year={selectedYear} />
      </main>

      <Sidebar />

      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} Norsk Kalender - Alle rettigheter forbeholdt
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;