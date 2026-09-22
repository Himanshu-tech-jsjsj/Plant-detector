import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className="flex items-center gap-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-400/40 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Download className="w-3.5 h-3.5 text-emerald-100" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-900/60 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#062c21] border border-emerald-500/30 p-5 shadow-2xl text-emerald-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  iPhone / iPad par Install karein
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg hover:bg-emerald-900/50 text-emerald-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-emerald-200/80 leading-relaxed mb-4">
                1. Safari browser me neeche <strong>Share</strong> icon par tap karein.<br />
                2. List me niche scroll karein aur <strong>'Add to Home Screen'</strong> chunein.<br />
                3. FloraMate AI aapke mobile me app ki tarah turant install ho jayega.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-semibold text-white transition"
              >
                Samajh Gaya (Close)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
