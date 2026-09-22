import React, { useState, useRef, useEffect } from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import {
  ChevronDown,
  Volume2,
  VolumeX,
  Sparkles,
  Camera,
  Leaf
} from 'lucide-react';
import { ScanViewMode } from '../types';

interface TopNavProps {
  currentMode: ScanViewMode;
  onChangeMode: (mode: ScanViewMode) => void;
  onReadAloud: () => void;
  isSpeaking: boolean;
  onOpenLiveCamera: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentMode,
  onChangeMode,
  onReadAloud,
  isSpeaking,
  onOpenLiveCamera,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#021f17]/90 border-b border-emerald-500/25 transition-all duration-300 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Stylized Logo (Leaf + Camera Lens fusion) */}
        <div
          id="brand-logo-btn"
          onClick={() => onChangeMode('ready_scan')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Logo Icon */}
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-[#022c22] p-[1.5px] shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_22px_rgba(45,212,191,0.5)] transition-all duration-300">
            <div className="w-full h-full bg-[#03231a] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              {/* Outer aperture ring */}
              <div className="absolute inset-1 rounded-full border border-dashed border-emerald-400/40 animate-[spin_20s_linear_infinite]" />
              {/* Center Leaf and Lens symbol */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-400 relative z-10 filter drop-shadow">
                {/* Camera lens outer ring */}
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
                {/* Leaf fusion path */}
                <path
                  d="M12 4C16 5 18 9 17 14C16 19 12 20 12 20C12 20 8 19 7 14C6 9 8 5 12 4Z"
                  fill="#10B981"
                  fillOpacity="0.85"
                />
                {/* Leaf center spine */}
                <line x1="12" y1="5" x2="12" y2="19" stroke="#E6FFFA" strokeWidth="1.2" strokeLinecap="round" />
                {/* Aperture iris dots */}
                <circle cx="9.5" cy="10" r="0.9" fill="#2DD4BF" />
                <circle cx="14.5" cy="10" r="0.9" fill="#2DD4BF" />
                <circle cx="12" cy="15" r="0.9" fill="#2DD4BF" />
              </svg>
            </div>
          </div>

          {/* Logo Name & Author */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white font-['Cabinet_Grotesk',sans-serif]">
                FloraMate
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 text-[#022c22] shadow-[0_0_8px_rgba(45,212,191,0.5)]">
                AI
              </span>
            </div>
            <span className="text-[11px] text-emerald-300 font-semibold tracking-wide flex items-center gap-1">
              By <strong className="text-white font-bold">Himanshu Singh</strong>
            </span>
          </div>
        </div>

        {/* Center: Creator Badge (visible on medium & large screens) */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-950 via-[#033626] to-emerald-950 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] select-none">
          <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
          <span className="text-xs text-emerald-200 font-medium">Fast AI Leaf Detection</span>
          <span className="text-emerald-500">•</span>
          <span className="text-xs font-black text-white tracking-wide">
            Created by <span className="text-emerald-300 font-extrabold">Himanshu Singh</span>
          </span>
        </div>

        {/* Right Actions: Voice, Camera & Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Read Aloud Button (Hinglish Audio) */}
          <button
            id="read-aloud-btn"
            onClick={onReadAloud}
            title={isSpeaking ? "Aawaz Band Karein" : "Hinglish me Sunein"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
              isSpeaking
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/25 hover:bg-emerald-900/50'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Rokein</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Sunein</span>
              </>
            )}
          </button>

          {/* Quick Camera Open Button */}
          <button
            id="top-scan-camera-btn"
            onClick={onOpenLiveCamera}
            title="Scan Leaf with Camera"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)] active:scale-95 border border-emerald-400/40 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-100" />
            <span>Scan Leaf</span>
          </button>

          {/* PWA Install */}
          <PWAInstallButton />

          {/* Subtle Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="subtle-dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-200 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/20 transition-all duration-200"
            >
              <span className="hidden xs:inline">Menu</span>
              <ChevronDown className={`w-3.5 h-3.5 text-emerald-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Content */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#03231a] border border-emerald-500/30 shadow-[0_12px_36px_rgba(0,0,0,0.6)] py-2 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3.5 py-2 border-b border-emerald-500/15">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    FloraMate AI Engine
                  </p>
                  <p className="text-[11px] text-emerald-300/70 mt-0.5">
                    Created by Himanshu Singh
                  </p>
                </div>

                <div className="py-1">
                  <button
                    id="menu-ready-scan"
                    onClick={() => {
                      onChangeMode('ready_scan');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs transition ${
                      currentMode === 'ready_scan'
                        ? 'bg-emerald-500/20 text-emerald-200 font-semibold'
                        : 'text-emerald-100 hover:bg-emerald-900/40'
                    }`}
                  >
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Scanner Home (Fresh Scan)</span>
                  </button>

                  <button
                    id="menu-open-camera"
                    onClick={() => {
                      onOpenLiveCamera();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs text-teal-300 hover:bg-emerald-900/40 transition font-medium"
                  >
                    <Camera className="w-3.5 h-3.5 text-teal-400" />
                    <span>Naya Paudha Scan Karein (Camera)</span>
                  </button>

                  <button
                    id="menu-scenario-blight"
                    onClick={() => {
                      onChangeMode('result_blight');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs transition ${
                      currentMode === 'result_blight'
                        ? 'bg-emerald-500/20 text-emerald-200 font-semibold'
                        : 'text-emerald-100 hover:bg-emerald-900/40'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                    <span>Demo: Leaf Blight (Jhulsa Rog)</span>
                  </button>

                  <button
                    id="menu-scenario-healthy"
                    onClick={() => {
                      onChangeMode('result_healthy');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs transition ${
                      currentMode === 'result_healthy'
                        ? 'bg-emerald-500/20 text-emerald-200 font-semibold'
                        : 'text-emerald-100 hover:bg-emerald-900/40'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>Demo: Swasth Paudha (Healthy Leaf)</span>
                  </button>

                  <button
                    id="menu-scenario-not-leaf"
                    onClick={() => {
                      onChangeMode('not_a_leaf');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs transition ${
                      currentMode === 'not_a_leaf'
                        ? 'bg-rose-500/20 text-rose-200 font-semibold'
                        : 'text-rose-200/80 hover:bg-rose-950/40'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                    <span>Demo: Not a Leaf (Anya Vastu Alert)</span>
                  </button>
                </div>

                <div className="mt-1 pt-2 border-t border-emerald-500/15 px-3.5 py-1 text-[11px] text-emerald-300/60 flex items-center justify-between">
                  <span>Created by Himanshu Singh</span>
                  <span className="text-emerald-400 font-mono">Fast AI</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
