import { useState, useEffect } from 'react';
import { Tag as TagIcon, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockTags } from '@/lib/mockData';

interface Tag {
  id: string;
  name: string;
}

interface TagSelectProps {
  recordingId: string;
  disabled?: boolean;
  onTagsChange?: () => void;
}

export default function TagSelect({
  recordingId,
  disabled = false,
  onTagsChange
}: TagSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  useEffect(() => {
    if (recordingId) {
      // Load mock tags
      setAvailableTags(mockTags.map(t => ({ id: t.id, name: t.name })));
      // Randomly select some tags for demo
      const randomSelected = mockTags
        .filter(() => Math.random() > 0.5)
        .slice(0, 2)
        .map(t => ({ id: t.id, name: t.name }));
      setSelectedTags(randomSelected);
    }
  }, [recordingId]);

  const handleTagToggle = async (tag: Tag) => {
    setIsLoading(true);
    // Demo mode - simulate update
    await new Promise(resolve => setTimeout(resolve, 200));

    const isSelected = selectedTags.some(t => t.id === tag.id);
    const newSelectedTags = isSelected
      ? selectedTags.filter(t => t.id !== tag.id)
      : [...selectedTags, tag];

    setSelectedTags(newSelectedTags);
    if (onTagsChange) {
      onTagsChange();
    }
    setIsLoading(false);
  };

  const handleRemoveAllTags = async () => {
    setIsLoading(true);
    // Demo mode - simulate update
    await new Promise(resolve => setTimeout(resolve, 200));

    setSelectedTags([]);
    setIsOpen(false);
    if (onTagsChange) {
      onTagsChange();
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Etiketter
      </label>

      <div className="relative">
        <div ref={setDropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className={cn(
            "w-full flex items-start justify-between px-4 py-2 rounded-lg border text-left transition-colors",
            selectedTags.length > 0
              ? "bg-[#F0F5FF] border-[#CFE0FF]"
              : "bg-white border-gray-300",
            (disabled || isLoading)
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-50"
          )}
        >
          <div className="flex flex-wrap gap-2 min-w-0 pr-6">
            {selectedTags.length === 0 ? (
              <span className="text-gray-500">Ingen etiketter valgt</span>
            ) : (
              selectedTags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-[#E4ECFF] text-[#2C64E3] text-sm"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag.name}
                </span>
              ))
            )}
          </div>
          <ChevronDown className={cn(
            "absolute right-4 top-3 h-4 w-4 text-gray-400 transition-transform",
            isOpen && "transform rotate-180"
          )} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg">
            <div className="p-1">
              {/* Remove all tags option */}
              {selectedTags.length > 0 && (
                <button
                  onClick={handleRemoveAllTags}
                  className="w-full flex items-center px-3 py-2 rounded-md text-left text-sm hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2 text-gray-400" />
                  Fjern alle etiketter
                </button>
              )}

              {/* Available tags */}
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-md text-left text-sm transition-colors",
                    selectedTags.some(t => t.id === tag.id)
                      ? "bg-[#F0F5FF] text-[#1F49C6]"
                      : "hover:bg-gray-50"
                )}
                >
                  <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
