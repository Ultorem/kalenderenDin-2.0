import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Trash2, Plus, StickyNote } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  isPostIt?: boolean;
  color?: string;
}

interface SortableTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const SortableTodoItem: React.FC<SortableTodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: todo.isPostIt ? todo.color : undefined
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        flex items-center gap-2 p-2 rounded cursor-move
        ${todo.isPostIt 
          ? 'shadow-md hover:shadow-lg transition-shadow'
          : todo.completed 
            ? 'bg-gray-100 dark:bg-gray-700/50' 
            : 'bg-white dark:bg-gray-700'
        }
        group
      `}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className="text-gray-500 hover:text-red-600 dark:text-gray-400"
      >
        {todo.completed ? (
          <CheckSquare className="w-5 h-5" />
        ) : (
          <Square className="w-5 h-5" />
        )}
      </button>
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [isPostIt, setIsPostIt] = useState(false);
  const [postItColor, setPostItColor] = useState('#ffeb3b');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setTodos(prev => [{
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: Date.now(),
      isPostIt,
      color: isPostIt ? postItColor : undefined
    }, ...prev]);
    setNewTodo('');
    setIsPostIt(false);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTodos(prev => {
        const oldIndex = prev.findIndex(t => t.id === active.id);
        const newIndex = prev.findIndex(t => t.id === over.id);
        
        const newTodos = [...prev];
        const [removed] = newTodos.splice(oldIndex, 1);
        newTodos.splice(newIndex, 0, removed);
        
        return newTodos;
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <CheckSquare className="w-5 h-5" />
        Gjøremål
      </h3>

      <form onSubmit={addTodo} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Legg til ny oppgave..."
            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
          <button
            type="button"
            onClick={() => setIsPostIt(!isPostIt)}
            className={`p-2 rounded ${
              isPostIt ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
            }`}
            title="Legg til som post-it"
          >
            <StickyNote className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {isPostIt && (
          <div className="flex items-center gap-2">
            <label className="text-sm">Post-it farge:</label>
            <input
              type="color"
              value={postItColor}
              onChange={(e) => setPostItColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
        )}
      </form>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          <SortableContext
            items={todos.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {todos.map(todo => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default TodoList;