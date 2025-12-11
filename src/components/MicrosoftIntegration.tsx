import { useState } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MicrosoftIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    // Demo mode - simulate connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsConnected(true);
    setIsLoading(false);
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    // Demo mode - simulate disconnection
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsConnected(false);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col p-4 rounded-lg border border-gray-200 hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-violet-100 rounded-lg">
            <Calendar className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h3 className="font-medium">Microsoft 365 Kalender</h3>
            <p className="text-sm text-gray-600">
              Synkroniser møter fra din Microsoft 365 kalender
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center">
          {isConnected && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Tilkoblet (Demo)
            </div>
          )}
        </div>
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isLoading}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isConnected
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-violet-100 text-violet-700 hover:bg-violet-200"
          )}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
              {isConnected ? 'Kobler fra...' : 'Kobler til...'}
            </div>
          ) : isConnected ? (
            'Koble fra'
          ) : (
            'Koble til'
          )}
        </button>
      </div>
    </div>
  );
}
