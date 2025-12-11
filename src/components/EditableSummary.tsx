import { useState } from 'react';
import { Pencil, Check, X, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableSummaryProps {
  summaryText: string;
  topics: string[];
  actionItems: string[];
  onSave: (data: {
    summaryText: string;
    topics: string[];
    actionItems: string[];
  }) => Promise<void>;
}

export default function EditableSummary({
  summaryText,
  topics,
  actionItems,
  onSave
}: EditableSummaryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(summaryText);
  const [editedTopics, setEditedTopics] = useState(topics);
  const [editedActionItems, setEditedActionItems] = useState(actionItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await onSave({
        summaryText: editedSummary.trim(),
        topics: editedTopics.filter(t => t.trim()),
        actionItems: editedActionItems.filter(a => a.trim())
      });
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving summary:', err);
      setError(err instanceof Error ? err.message : 'Kunne ikke lagre endringer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedSummary(summaryText);
    setEditedTopics(topics);
    setEditedActionItems(actionItems);
    setError(null);
    setIsEditing(false);
  };

  const addListItem = (list: string[], setList: (items: string[]) => void) => {
    setList([...list, '']);
  };

  const updateListItem = (
    index: number,
    value: string,
    list: string[],
    setList: (items: string[]) => void
  ) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const removeListItem = (
    index: number,
    list: string[],
    setList: (items: string[]) => void
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Summary */}
        <div className="relative">
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -top-10 right-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Pencil className="h-4 w-4 text-gray-600" />
          </button>
          <p className="text-gray-600 whitespace-pre-line">{summaryText}</p>
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Hovedtemaer</h3>
            <ul className="list-disc list-inside space-y-1">
              {topics.map((topic, index) => (
                <li key={index} className="text-gray-600">{topic}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Items */}
        {actionItems.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Handlingspunkter</h3>
            <ul className="list-disc list-inside space-y-1">
              {actionItems.map((item, index) => (
                <li key={index} className="text-gray-600">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Edit Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sammendrag
        </label>
        <textarea
          value={editedSummary}
          onChange={(e) => setEditedSummary(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
        />
      </div>

      {/* Edit Topics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hovedtemaer
        </label>
        <div className="space-y-2">
          {editedTopics.map((topic, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => updateListItem(index, e.target.value, editedTopics, setEditedTopics)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                placeholder="Skriv inn tema..."
              />
              <button
                onClick={() => removeListItem(index, editedTopics, setEditedTopics)}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addListItem(editedTopics, setEditedTopics)}
            className="w-full py-2 px-4 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-violet-500 hover:text-violet-600 transition-colors flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Legg til tema
          </button>
        </div>
      </div>

      {/* Edit Action Items */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Handlingspunkter
        </label>
        <div className="space-y-2">
          {editedActionItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateListItem(index, e.target.value, editedActionItems, setEditedActionItems)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                placeholder="Skriv inn handlingspunkt..."
              />
              <button
                onClick={() => removeListItem(index, editedActionItems, setEditedActionItems)}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addListItem(editedActionItems, setEditedActionItems)}
            className="w-full py-2 px-4 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-violet-500 hover:text-violet-600 transition-colors flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Legg til handlingspunkt
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Avbryt
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={cn(
            "px-4 py-2 rounded-lg text-white transition-colors",
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-700"
          )}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Lagrer...
            </div>
          ) : (
            'Lagre'
          )}
        </button>
      </div>
    </div>
  );
}