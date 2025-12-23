import { X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PopupBlockedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export default function PopupBlockedDialog({
  isOpen,
  onClose,
  onRetry
}: PopupBlockedDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">Popup ble blokkert</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <p className="text-gray-600">
              For å koble til Microsoft 365 må du tillate popups for denne nettsiden. Følg disse stegene:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Se etter popup-blokkering ikonet i adressefeltet</li>
              <li>Klikk på ikonet og velg "Tillat popups fra denne nettsiden"</li>
              <li>Klikk på "Prøv igjen" knappen nedenfor</li>
            </ol>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  onClose();
                  onRetry();
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Prøv igjen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}