import { useState, useRef, KeyboardEvent } from 'react';
import { X, Send, Mail, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShareSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingTitle: string;
  summaryPreview?: string;
}

type SendStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ShareSummaryModal({
  isOpen,
  onClose,
  meetingTitle,
  summaryPreview
}: ShareSummaryModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const [includeMinutes, setIncludeMinutes] = useState(false);
  const [includeTranscription, setIncludeTranscription] = useState(false);
  const [personalMessage, setPersonalMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed && isValidEmail(trimmed) && !emails.includes(trimmed)) {
      setEmails([...emails, trimmed]);
      setInputValue('');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      removeEmail(emails[emails.length - 1]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const pastedEmails = pastedText.split(/[,;\s]+/).filter(isValidEmail);
    const newEmails = [...new Set([...emails, ...pastedEmails.map(e => e.toLowerCase())])];
    setEmails(newEmails);
  };

  const handleSend = async () => {
    if (emails.length === 0) return;

    setSendStatus('sending');

    // Demo mode - simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Demo: Would send summary to:', {
      emails,
      meetingTitle,
      includeMinutes,
      includeTranscription,
      personalMessage
    });

    setSendStatus('success');

    // Auto-close after success
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setEmails([]);
    setInputValue('');
    setSendStatus('idle');
    setIncludeMinutes(false);
    setIncludeTranscription(false);
    setPersonalMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && sendStatus !== 'sending' && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl"
        >
          {/* Success State */}
          {sendStatus === 'success' ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sammendrag sendt!
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {emails.length === 1
                  ? `Sendt til ${emails[0]}`
                  : `Sendt til ${emails.length} mottakere`
                }
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Del sammendrag
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      Send møtesammendraget på e-post
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={sendStatus === 'sending'}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Meeting info */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Møte</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{meetingTitle}</p>
                </div>

                {/* Email input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mottakere
                  </label>
                  <div
                    className={cn(
                      "min-h-[48px] p-2 rounded-lg border transition-colors flex flex-wrap gap-2 cursor-text",
                      "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
                      "focus-within:border-violet-500 dark:focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/20"
                    )}
                    onClick={() => inputRef.current?.focus()}
                  >
                    {emails.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300"
                      >
                        <Mail className="h-3 w-3" />
                        {email}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEmail(email);
                          }}
                          className="hover:bg-violet-200 dark:hover:bg-violet-800 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      ref={inputRef}
                      type="email"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onPaste={handlePaste}
                      onBlur={() => inputValue && addEmail(inputValue)}
                      placeholder={emails.length === 0 ? "Skriv e-postadresser..." : ""}
                      disabled={sendStatus === 'sending'}
                      className="flex-1 min-w-[150px] bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    Trykk Enter eller komma for å legge til flere
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={includeMinutes}
                      onChange={(e) => setIncludeMinutes(e.target.checked)}
                      disabled={sendStatus === 'sending'}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      Inkluder fullt referat
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={includeTranscription}
                      onChange={(e) => setIncludeTranscription(e.target.checked)}
                      disabled={sendStatus === 'sending'}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      Inkluder full transkripsjon
                    </span>
                  </label>
                </div>

                {/* Personal message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Personlig melding (valgfritt)
                  </label>
                  <textarea
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    placeholder="Legg til en melding..."
                    disabled={sendStatus === 'sending'}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none text-sm"
                  />
                </div>

                {/* Preview */}
                {summaryPreview && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Forhåndsvisning av sammendrag
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 max-h-24 overflow-y-auto">
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-4">
                        {summaryPreview}
                      </p>
                    </div>
                  </div>
                )}

                {/* Demo notice */}
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                  Demo-modus: E-post simuleres
                </p>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gray-200 dark:border-gray-800">
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    disabled={sendStatus === 'sending'}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={emails.length === 0 || sendStatus === 'sending'}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all",
                      emails.length === 0
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-sm hover:shadow-md"
                    )}
                  >
                    {sendStatus === 'sending' ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sender...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send{emails.length > 0 && ` til ${emails.length}`}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
