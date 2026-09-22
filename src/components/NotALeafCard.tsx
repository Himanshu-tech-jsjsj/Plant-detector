import React from 'react';
import { AlertOctagon, Camera, Mic, Volume2, VolumeX } from 'lucide-react';
import { PlantDiagnosis } from '../types';

interface NotALeafCardProps {
  diagnosis: PlantDiagnosis;
  scannedImage: string;
  onNewScan: () => void;
  onReadAloud: () => void;
  isSpeaking: boolean;
}

export const NotALeafCard: React.FC<NotALeafCardProps> = ({
  diagnosis,
  scannedImage,
  onNewScan,
  onReadAloud,
  isSpeaking,
}) => {
  return (
    <div
      id="not-a-leaf-card"
      className="w-full max-w-xl mx-auto rounded-3xl bg-[#261010]/90 border border-rose-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden transition-all duration-300 relative select-none animate-in fade-in zoom-in-95 duration-300"
    >
      {/* Scanned Image Preview with Alert Overlay */}
      <div className="relative w-full h-56 sm:h-64 bg-black/60 overflow-hidden">
        <img
          src={scannedImage}
          alt="Scanned non-leaf object"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter grayscale-[30%] brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#261010] via-black/40 to-transparent pointer-events-none" />

        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-500/50 text-[11px] font-bold text-rose-200 shadow-md">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Not a Plant Leaf</span>
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-7 space-y-5">
        {/* Main Alert Header */}
        <div className="flex items-start justify-between gap-3 border-b border-rose-500/20 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Pehchan Alert
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Cabinet_Grotesk',sans-serif] tracking-tight">
              Sorry, This is Not a Leaf
            </h2>
            <p className="text-sm font-semibold text-rose-200/90">
              {diagnosis.notLeafMessage || 'Yeh kisi paudhe ka patta nahi hai. Kripya kisi paudhe ke patte ki photo scan karein.'}
            </p>
          </div>

          {/* Dedicated Mike Button */}
          <button
            id="speak-not-a-leaf-btn"
            onClick={onReadAloud}
            className={`p-3 rounded-2xl border transition-all duration-200 shrink-0 ${
              isSpeaking
                ? 'bg-rose-500/30 border-rose-400 text-rose-200 animate-pulse'
                : 'bg-rose-950/70 hover:bg-rose-900 border-rose-500/40 text-rose-300'
            }`}
            title="Aawaz me sunein"
            aria-label="Aawaz me sunein"
          >
            {isSpeaking ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5 text-rose-300 animate-bounce" />
            )}
          </button>
        </div>

        {/* Guidance Box */}
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/30 space-y-2">
          <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
            Sahi Scan Kaise Karein:
          </h4>
          <ul className="text-xs text-rose-100/85 space-y-1.5 list-disc list-inside">
            <li>Keval ped ya paudhe ke patte ki photo frame me rakhein.</li>
            <li>Roshni achhi honi chahiye taaki patte ki nashein saaf dikhein.</li>
            <li>Kripya haath, chehra, kamra ya koi anya vastu scan na karein.</li>
          </ul>
        </div>

        {/* Voice Announcement status pill */}
        <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-black/40 border border-rose-500/20 text-xs text-rose-200">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-rose-400" />
            <span>Voice Sahayata: <strong>{isSpeaking ? 'Bol raha hai...' : 'Aawaz me sunne ke liye Mike dabayein'}</strong></span>
          </div>
          {isSpeaking && (
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          )}
        </div>

        {/* Action Button: Scan Real Leaf */}
        <button
          id="scan-real-leaf-btn"
          onClick={onNewScan}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 transition"
        >
          <Camera className="w-4 h-4" />
          <span>Asli Paudhe Ka Patta Scan Karein</span>
        </button>
      </div>
    </div>
  );
};
