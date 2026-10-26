import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, hasNativePrompt, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running inside installed standalone PWA on Android or desktop, hide button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (hasNativePrompt) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-lg transition-colors border border-neutral-300 cursor-pointer shadow-2xs whitespace-nowrap"
        title="Install as Android App"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
        <span>Install App</span>
      </button>

      {/* Mobile Installation Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 text-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-neutral-900">
                  Install Unicorn Solar App
                </h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
                <p>To install on your iPhone or iPad:</p>
                <ol className="list-decimal list-inside space-y-1.5 font-medium text-neutral-800">
                  <li>
                    Tap the <strong>Share</strong> button (box with upward arrow) in the Safari toolbar.
                  </li>
                  <li>
                    Scroll down and select <strong>Add to Home Screen</strong>.
                  </li>
                  <li>
                    Tap <strong>Add</strong> in the top right corner.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
                <p>To install as a native Android App:</p>
                <ol className="list-decimal list-inside space-y-1.5 font-medium text-neutral-800">
                  <li>
                    Tap the <strong>three dots (⋮)</strong> menu in Google Chrome.
                  </li>
                  <li>
                    Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>
                    The Unicorn Energy icon will appear directly in your Android app drawer with offline access!
                  </li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full rounded-xl bg-emerald-800 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
