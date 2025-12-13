import { motion, AnimatePresence } from 'framer-motion';
import { createRoot } from 'react-dom/client';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: AlertCircle
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 px-6 py-4 rounded-xl shadow-lg border z-50",
        type === 'success' && "bg-green-50 border-green-200 text-green-700",
        type === 'error' && "bg-red-50 border-red-200 text-red-700",
        type === 'info' && "bg-blue-50 border-blue-200 text-blue-700"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span>{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// Lazy toast creation to avoid DOM access at module load time
const showToast = (message: string, type: ToastProps['type'] = 'info') => {
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container-' + Date.now();
  document.body.appendChild(toastContainer);
  const root = createRoot(toastContainer);

  const handleClose = () => {
    root.unmount();
    if (document.body.contains(toastContainer)) {
      document.body.removeChild(toastContainer);
    }
  };

  root.render(
    <AnimatePresence>
      <Toast
        message={message}
        type={type}
        onClose={handleClose}
      />
    </AnimatePresence>
  );

  // Auto-close after 5 seconds
  setTimeout(handleClose, 5000);
};

export const toast = {
  success: (message: string) => showToast(message, 'success'),
  error: (message: string) => showToast(message, 'error'),
  info: (message: string) => showToast(message, 'info')
};
