import { useState, useEffect, useRef } from 'react';

interface EditableTitleProps {
  title: string;
  onSave: (newTitle: string) => Promise<void>;
}

export default function EditableTitle({ title, onSave }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!editedTitle.trim() || editedTitle.trim() === title) {
      setEditedTitle(title);
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      await onSave(editedTitle.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving title:', error);
      setEditedTitle(title);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <h1 
        onClick={() => setIsEditing(true)}
        className="text-2xl font-semibold mb-2 cursor-pointer hover:text-violet-600 transition-colors"
      >
        {title}
      </h1>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={editedTitle}
      onChange={(e) => setEditedTitle(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      disabled={isLoading}
      className="text-2xl font-semibold mb-2 w-[130%] px-0 border-0 border-b-2 border-violet-600 focus:ring-0 bg-transparent"
      placeholder="Skriv inn tittel..."
    />
  );
}