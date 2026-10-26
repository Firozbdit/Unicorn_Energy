import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Network Status"
      className="fixed bottom-20 md:bottom-4 left-4 right-4 md:right-auto z-50 flex items-center justify-between gap-3 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl border border-amber-500/80"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span>Offline Mode — All calculations & surveys saved to device storage.</span>
      </div>
      <span className="text-[10px] bg-amber-700/80 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
        Local Cache
      </span>
    </aside>
  );
};
