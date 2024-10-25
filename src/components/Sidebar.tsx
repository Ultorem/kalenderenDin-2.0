import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';
import TodoList from './TodoList';
import WaterTracker from './WaterTracker';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`
      fixed right-0 top-1/4 transform transition-all duration-300 ease-in-out z-40
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      print:hidden
    `}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-0 top-4 transform -translate-x-full bg-white dark:bg-gray-800 p-2 rounded-l-lg shadow-lg"
      >
        {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      <div className="w-80 bg-white dark:bg-gray-800 rounded-l-lg shadow-lg p-4">
        <div className="space-y-6">
          <TodoList />
          <WaterTracker />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;