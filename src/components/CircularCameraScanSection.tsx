import React, { useRef } from 'react';
import { Camera, Upload, Sparkles, AlertOctagon } from 'lucide-react';
import { playScanBlichSound } from '../utils/audioEffects';

interface CircularCameraScanSectionProps {
  onScanClick: () => void;
  onFileUpload: (file: File) => void;
  isScanning: boolean;
  onSelectSample: (type: 'blight' | 'powdery_mildew' | 'leaf_curl' | 'rust' | 'healthy' | 'not_a_leaf') => void;
}

export const CircularCameraScanSection: React.FC<CircularCameraScanSectionProps> = ({
  onScanClick,
  onFileUpload,
  isScanning,
  onSelectSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      playScanBlichSound();
      onFileUpload(e.target.files[0]);
    }
  };

  const handleCircleScanClick = () => {
    playScanBlichSound();
    onScanClick();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-6 sm:py-8 px-4 relative select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Main Glowing Circular Button Area */}
      <div className="relative flex items-center justify-center my-4 group">
        {/* Ambient Pulsing Aura Layers */}
        <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-r from-emerald-500/25 via-teal-400/20 to-emerald-600/25 blur-2xl animate-pulse-glow" />
        
        {/* Animated Ripple Waves */}
        <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-emerald-400/30 animate-ripple pointer-events-none" />
        <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-teal-400/20 animate-ripple [animation-delay:1.2s] pointer-events-none" />

        {/* Outer Circular Progress / Shutter Ring */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full p-[3px] bg-gradient-to-tr from-emerald-400 via-teal-300 to-emerald-600 shadow-[0_0_40px_rgba(16,185,129,0.45)] group-hover:shadow-[0_0_55px_rgba(45,212,191,0.6)] transition-all duration-500">
          
          {/* Rotating dashed ring */}
          <div className={`absolute inset-1 rounded-full border border-dashed border-emerald-300/40 ${isScanning ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_25s_linear_infinite]'}`} />

          {/* SVG Progress Circle when isScanning */}
          {isScanning && (
            <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90 pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="#2DD4BF"
                strokeWidth="4"
                strokeDasharray="280"
                strokeDashoffset="70"
                className="animate-spin duration-1000"
              />
            </svg>
          )}

          {/* Core Interactive Center Button */}
          <button
            id="open-camera-circular-btn"
            onClick={handleCircleScanClick}
            disabled={isScanning}
            aria-label="Open Camera - Paudha Scan Karein"
            className="w-full h-full rounded-full bg-gradient-to-b from-[#064e3b] via-[#022c22] to-[#011a14] flex flex-col items-center justify-center p-4 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/50 active:scale-95 transition-transform duration-200 relative overflow-hidden"
          >
            {/* Shimmer light bar across button */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Modern icon: Camera lens icon with embedded leaf shape */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              {/* Camera outer lens aperture */}
              <svg viewBox="0 0 64 64" className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                <defs>
                  <linearGradient id="btnLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="50%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="lensRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5EEAD4" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>

                {/* Outer metallic lens rim */}
                <circle cx="32" cy="32" r="28" fill="none" stroke="url(#lensRingGrad)" strokeWidth="2.5" />
                <circle cx="32" cy="32" r="23" fill="#03231a" />

                {/* Embedded Stylized Leaf Shape that pulses gently */}
                <g className="animate-pulse" style={{ animationDuration: '2.5s' }}>
                  <path
                    d="M32 12 C43 14 47 24 43 36 C39 46 32 49 32 49 C32 49 25 46 21 36 C17 24 21 14 32 12 Z"
                    fill="url(#btnLeafGrad)"
                  />
                  {/* Leaf Central Vein / Sensor beam */}
                  <path d="M32 14 Q32 30 32 48" stroke="#E6FFFA" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M32 23 Q37 20 39 17" stroke="#A7F3D0" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M32 30 Q27 27 25 24" stroke="#A7F3D0" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M32 37 Q37 34 39 31" stroke="#A7F3D0" strokeWidth="1.2" strokeLinecap="round" />
                </g>

                {/* Shutter Blades Highlights */}
                <circle cx="32" cy="32" r="8" fill="none" stroke="#2DD4BF" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
                <circle cx="32" cy="32" r="3" fill="#D1FAE5" />
              </svg>
            </div>

            {/* Quick Micro-tag */}
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-300 mt-1 flex items-center gap-1">
              <Camera className="w-3 h-3 text-teal-300" />
              <span>{isScanning ? "Analyzing..." : "Tap to Scan"}</span>
            </span>
          </button>
        </div>
      </div>

      {/* Primary Call to Action in Hinglish */}
      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-3 text-balance max-w-md font-['Cabinet_Grotesk',sans-serif]">
        Paudha Scan Karein – <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">Bimari Jaanein Turant</span>
      </h2>
      
      <p className="text-xs sm:text-sm text-emerald-200/75 mt-1.5 max-w-md font-normal leading-relaxed">
        Keval ek photo khechein, koi typing ki zarurat nahi. Gemini Vision AI se rog pehchan aur dawai turant payein.
      </p>

      {/* Quick Action Badges: Live Camera / Gallery Upload / Sample Demos */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-sm">
        <button
          id="btn-trigger-camera"
          onClick={onScanClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/30 text-xs font-semibold text-emerald-200 transition active:scale-95"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          <span>Camera Kholein</span>
        </button>

        <button
          id="btn-upload-file"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-950/60 hover:bg-teal-900/80 border border-teal-500/30 text-xs font-semibold text-teal-200 transition active:scale-95"
        >
          <Upload className="w-3.5 h-3.5 text-teal-400" />
          <span>Gallery se Chunein</span>
        </button>

        <div className="w-full flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[11px] text-emerald-400/80">
          <div className="w-full flex items-center justify-center gap-1 text-emerald-300 font-medium mb-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Alag-alag Rog & Dawai Demo Test Karein:</span>
          </div>
          <button
            onClick={() => onSelectSample('blight')}
            className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 hover:text-emerald-200 font-medium cursor-pointer transition active:scale-95"
            title="Blight: Cymoxanil / Copper Oxychloride"
          >
            🍂 Jhulsa (Blight)
          </button>
          <button
            onClick={() => onSelectSample('powdery_mildew')}
            className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 hover:text-emerald-200 font-medium cursor-pointer transition active:scale-95"
            title="Powdery Mildew: Wettable Sulphur"
          >
            🤍 Safed Fafund
          </button>
          <button
            onClick={() => onSelectSample('leaf_curl')}
            className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 hover:text-emerald-200 font-medium cursor-pointer transition active:scale-95"
            title="Leaf Curl: Imidacloprid + Neem Oil"
          >
            🌪️ Murdiya (Leaf Curl)
          </button>
          <button
            onClick={() => onSelectSample('rust')}
            className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 hover:text-emerald-200 font-medium cursor-pointer transition active:scale-95"
            title="Rust: Propiconazole (Tilt)"
          >
            🍁 Gerui (Rust)
          </button>
          <button
            onClick={() => onSelectSample('healthy')}
            className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 hover:text-emerald-200 font-medium cursor-pointer transition active:scale-95"
          >
            🌱 Swasth Patta
          </button>
          <button
            onClick={() => onSelectSample('not_a_leaf')}
            className="px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/30 hover:text-rose-200 text-rose-300 font-medium cursor-pointer transition active:scale-95 flex items-center gap-1"
          >
            <AlertOctagon className="w-2.5 h-2.5 text-rose-400" />
            <span>Not-Leaf</span>
          </button>
        </div>
      </div>
    </div>
  );
};
