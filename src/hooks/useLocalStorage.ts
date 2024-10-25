import { useState, useEffect } from 'react';
import type { CustomEvent } from '../types';

export function useLocalStorage() {
  const [events, setEvents] = useState<CustomEvent[]>(() => {
    const saved = localStorage.getItem('customEvents');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('customEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (event: CustomEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const removeEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const updateEvent = (event: CustomEvent) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };

  return { events, addEvent, removeEvent, updateEvent };
}