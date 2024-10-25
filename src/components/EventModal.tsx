import React from 'react';
import { X } from 'lucide-react';
import type { CustomEvent, Holiday } from '../types';

interface EventModalProps {
  date: Date;
  holiday?: Holiday;
  events: CustomEvent[];
  onClose: () => void;
  onAddEvent: (event: CustomEvent) => void;
}

const EventModal: React.FC<EventModalProps> = ({ 
  date, 
  holiday, 
  events, 
  onClose,
  onAddEvent 
}) => {
  const [newEvent, setNewEvent] = React.useState({
    title: '',
    description: '',
    color: '#ff0000'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent({
      id: Date.now().toString(),
      date: date.toISOString(),
      ...newEvent
    });
    setNewEvent({ title: '', description: '', color: '#ff0000' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {date.toLocaleDateString('no', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {holiday && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded">
              <h3 className="font-semibold">{holiday.name}</h3>
              <p className="text-sm">Offentlig helligdag</p>
            </div>
          )}

          {events.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Hendelser</h3>
              {events.map(event => (
                <div 
                  key={event.id}
                  className="p-2 mb-2 rounded"
                  style={{ backgroundColor: `${event.color}20` }}
                >
                  <div className="font-medium" style={{ color: event.color }}>
                    {event.title}
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold">Legg til ny hendelse</h3>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tittel
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Beskrivelse
              </label>
              <textarea
                value={newEvent.description}
                onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Farge
              </label>
              <input
                type="color"
                value={newEvent.color}
                onChange={e => setNewEvent(prev => ({ ...prev, color: e.target.value }))}
                className="w-full"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white rounded py-2 hover:bg-red-700"
            >
              Legg til hendelse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;