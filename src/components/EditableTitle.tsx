import { useState, useEffect, useRef } from 'react';
import { Pencil, Check } from 'lucide-react';

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
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          {title}
        </h1>
        <button
          type="button"
          onClick={() => {
            setEditedTitle(title);
            setIsEditing(true);
          }}
          className="p-2 rounded-lg text-gray-500 hover:text-[#2C64E3] hover:bg-[#E4ECFF] transition-colors"
          aria-label="Rediger tittel"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="w-full bg-transparent text-2xl font-semibold text-gray-900 border-b border-[#CFE0FF] focus:border-[#2C64E3] transition-colors outline-none pr-10"
          placeholder="Skriv inn tittel..."
        />
      </div>
      <button
        type="button"
        onClick={handleSave}
        disabled={isLoading}
        className="p-2 rounded-lg text-white bg-[#2C64E3] hover:bg-[#1F49C6] disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Lagre tittel"
      >
        <Check className="h-4 w-4" />
      </button>
    </div>
  );
}
