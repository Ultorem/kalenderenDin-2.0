import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X, StickyNote, Plus } from 'lucide-react';

interface PostIt {
  id: string;
  text: string;
  position: { x: number; y: number };
  color: string;
}

const DraggablePostIt: React.FC<{ postIt: PostIt; onRemove: () => void }> = ({ postIt, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: postIt.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute',
    left: postIt.position.x,
    top: postIt.position.y,
    backgroundColor: postIt.color,
  };

  return (
    <div
      ref={setNodeRef}
      style={style as any}
      className="w-48 h-48 p-4 shadow-lg rounded-sm cursor-move group transition-transform hover:scale-105"
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-start">
        <div className="w-full break-words text-gray-800">{postIt.text}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-gray-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const PostItNotes: React.FC = () => {
  const [postIts, setPostIts] = useState<PostIt[]>(() => {
    const saved = localStorage.getItem('postItNotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newPostItText, setNewPostItText] = useState('');

  useEffect(() => {
    localStorage.setItem('postItNotes', JSON.stringify(postIts));
  }, [postIts]);

  const colors = [
    '#fef3c7', // Yellow
    '#d1fae5', // Green
    '#dbeafe', // Blue
    '#fce7f3', // Pink
    '#f3e8ff', // Purple
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    setPostIts(postIts => 
      postIts.map(postIt => 
        postIt.id === active.id
          ? {
              ...postIt,
              position: {
                x: postIt.position.x + delta.x,
                y: postIt.position.y + delta.y,
              },
            }
          : postIt
      )
    );
  };

  const addPostIt = () => {
    if (newPostItText.trim()) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setPostIts([
        ...postIts,
        {
          id: Date.now().toString(),
          text: newPostItText,
          position: { x: Math.random() * 200, y: Math.random() * 200 },
          color: randomColor,
        },
      ]);
      setNewPostItText('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <StickyNote className="w-5 h-5" />
          Notater
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg hover:bg-yellow-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ny notis</span>
        </button>
      </div>

      <div className="relative h-[400px] bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden">
        <DndContext onDragEnd={handleDragEnd}>
          <div className="relative w-full h-full">
            {postIts.map((postIt) => (
              <DraggablePostIt
                key={postIt.id}
                postIt={postIt}
                onRemove={() => setPostIts(postIts.filter(p => p.id !== postIt.id))}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Ny notis</h3>
            <textarea
              value={newPostItText}
              onChange={(e) => setNewPostItText(e.target.value)}
              className="w-full h-32 p-2 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Skriv din notis her..."
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Avbryt
              </button>
              <button
                onClick={addPostIt}
                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200"
              >
                Legg til
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItNotes;