import React from 'react';
import { Download, FileSpreadsheet, Image, Printer } from 'lucide-react';

interface ExportButtonProps {
  onExport: (format: 'json' | 'csv' | 'png') => void;
  onPrint: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport, onPrint }) => {
  return (
    <div className="flex space-x-2">
      <div className="relative group">
        <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Download className="w-4 h-4" />
          <span>Eksporter</span>
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="py-1">
            <button
              onClick={() => onExport('json')}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Download className="w-4 h-4" />
              <span>JSON Format</span>
            </button>
            <button
              onClick={() => onExport('csv')}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel/CSV Format</span>
            </button>
            <button
              onClick={() => onExport('png')}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Image className="w-4 h-4" />
              <span>Bilde Format</span>
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={onPrint}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <Printer className="w-4 h-4" />
        <span>Skriv ut</span>
      </button>
    </div>
  );
};

export default ExportButton;