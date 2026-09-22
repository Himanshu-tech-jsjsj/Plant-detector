import React, { useState } from 'react';
import { PlantDiagnosis } from '../types';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Mic,
  Camera,
  Layers
} from 'lucide-react';

interface ScanResultCardProps {
  diagnosis: PlantDiagnosis;
  leafImage: string;
  onNewScan: () => void;
  onReadAloud: () => void;
  isSpeaking: boolean;
}

export const ScanResultCard: React.FC<ScanResultCardProps> = ({
  diagnosis,
  leafImage,
  onNewScan,
  onReadAloud,
  isSpeaking,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);

  return (
    <div
      id="scan-result-card"
      className="w-full max-w-xl mx-auto rounded-3xl bg-[#03241b]/95 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden transition-all duration-300 relative select-none"
    >
      {/* 1. Edge-to-edge photo of scanned Leaf with glowing green circles highlighting key infected areas */}
      <div className="relative w-full h-64 sm:h-72 bg-black/40 overflow-hidden group">
        <img
          src={leafImage}
          alt="Scanned Plant Leaf - Disease Diagnosis"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
        />

        {/* Studio lighting gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#03241b] via-transparent to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03241b]/30 via-transparent to-[#03241b]/30 pointer-events-none" />

        {/* Live Scan Timestamp & Mode pill */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Live Scan Complete</span>
          </span>
        </div>

        {/* Toggle Hotspots Button */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5">
          <button
            id="toggle-hotspots-btn"
            onClick={() => setShowHotspots(!showHotspots)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-400/40 text-[11px] font-medium text-emerald-200 hover:bg-black/80 transition"
          >
            <Layers className="w-3 h-3 text-teal-300" />
            <span>{showHotspots ? 'Spots Chhupayein' : 'Spots Dikhayein'}</span>
          </button>
        </div>

        {/* Soft Glowing Green Circles Automatically Highlighting Infected Areas */}
        {showHotspots &&
          diagnosis.hotspots &&
          diagnosis.hotspots.map((spot, index) => (
            <div
              key={index}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: `${spot.radius * 2}px`,
                height: `${spot.radius * 2}px`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => setActiveHotspot(activeHotspot === index ? null : index)}
              className="absolute cursor-pointer z-20 group/spot flex items-center justify-center"
            >
              {/* Soft, glowing green pulsing outer rings */}
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 bg-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.8)] animate-pulse" />
              <div className="absolute -inset-2 rounded-full border border-teal-300/60 animate-ping [animation-duration:3s]" />
              
              {/* Central pinpoint indicator */}
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#34d399]" />

              {/* Tag / Tooltip on click or hover */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-emerald-400/60 text-[10px] font-semibold text-emerald-200 whitespace-nowrap shadow-xl opacity-90 group-hover/spot:opacity-100 transition pointer-events-none">
                {spot.label}
              </div>
            </div>
          ))}

        {/* Scan line visual aesthetic */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line pointer-events-none opacity-40" />
      </div>

      {/* 2. Below the image: Structured, easy-to-read sections */}
      <div className="p-5 sm:p-7 space-y-6">
        
        {/* Main Diagnosis Header (Hinglish) + Confidence Score meter */}
        <div className="space-y-3 pb-4 border-b border-emerald-500/20">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Bimari Pehchan
                </span>
                {diagnosis.botanicalName && (
                  <span className="text-[11px] text-emerald-400/70 italic font-mono">
                    ({diagnosis.botanicalName})
                  </span>
                )}
              </div>
              
              {/* Large, bold font diagnosis header in Hinglish */}
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug font-['Cabinet_Grotesk',sans-serif]">
                {diagnosis.diseaseName}
              </h1>
            </div>

            {/* Quick Listen Button with Mike */}
            <button
              id="listen-diagnosis-btn"
              onClick={onReadAloud}
              title="Aawaz me bimari aur dawai sunein"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border transition-all duration-200 shrink-0 ${
                isSpeaking
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 animate-pulse ring-2 ring-amber-400/40'
                  : 'bg-emerald-900/70 border-emerald-400/40 text-emerald-200 hover:bg-emerald-800 hover:text-white shadow-md'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold">Stop Voice</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-emerald-300 animate-bounce" />
                  <span className="text-xs font-bold">Bolein (Voice)</span>
                </>
              )}
            </button>
          </div>

          {/* Dedicated Voice Announcement Bar */}
          <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#033325] to-emerald-950 border border-emerald-400/30 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <Mic className={`w-3.5 h-3.5 ${isSpeaking ? 'text-amber-300 animate-pulse' : 'text-emerald-300'}`} />
              </div>
              <div>
                <p className="font-bold text-white leading-tight">
                  Voice Sahayata (Automated Voice)
                </p>
                <p className="text-[11px] text-emerald-300/80">
                  {isSpeaking ? 'AI aawaz me bimari aur dawai bata raha hai...' : 'Bimari aur dawai ki jankari sunne ke liye Mike dabayein'}
                </p>
              </div>
            </div>

            <button
              onClick={onReadAloud}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition shrink-0 ${
                isSpeaking
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                  : 'bg-emerald-800/60 border-emerald-400/30 text-emerald-200 hover:bg-emerald-700/80'
              }`}
            >
              {isSpeaking ? 'Aawaz Rokein' : 'Aawaz Sunein'}
            </button>
          </div>

          {/* Confidence Score Meter showing 94% */}
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                {/* Circular Meter SVG */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    className="text-emerald-900"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={2 * Math.PI * 18 * (1 - diagnosis.confidenceScore / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-xs font-black text-white">
                  {diagnosis.confidenceScore}%
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-200">
                  Confidence Score: <span className="text-emerald-400">{diagnosis.confidenceScore}%</span>
                </p>
                <p className="text-[11px] text-emerald-300/70">
                  Uchh Vishwasniyata (High Certainty)
                </p>
              </div>
            </div>

            {/* Severity Pill */}
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300">
                {diagnosis.severity || 'Chintajanak'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Sanket/Symptoms (Short Bullet Points - Hinglish) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
              1
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Sanket / Symptoms (लक्षण)
            </h3>
          </div>
          <ul className="space-y-2 pl-8 list-none">
            {diagnosis.symptoms.map((symptom, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed relative before:content-['•'] before:absolute before:-left-4 before:text-amber-400 before:font-bold"
              >
                {symptom}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2: Ilaaj aur Dawai (Treatment & Medicines - Hinglish) */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-400/25 shadow-inner">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xs font-bold">
              2
            </div>
            <h3 className="text-sm font-bold text-emerald-200 tracking-wide uppercase flex items-center gap-1.5">
              <span>Ilaaj aur Dawai (Treatment & Medicines)</span>
            </h3>
          </div>

          <div className="pl-8 space-y-2 text-xs sm:text-sm text-emerald-50">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
              <strong className="text-teal-300 font-bold shrink-0">Dawai:</strong>
              <span className="text-white font-medium bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/30">
                {diagnosis.treatment.dawai}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 pt-1">
              <strong className="text-teal-300 font-bold shrink-0">Tariqa:</strong>
              <span className="text-emerald-100/95 leading-relaxed">
                {diagnosis.treatment.tariqa}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Paudhe ki Dekhbhal (General Care & Prevention - Hinglish) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xs font-bold">
              3
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Paudhe ki Dekhbhal (General Care & Prevention)
            </h3>
          </div>
          <ul className="space-y-2 pl-8 list-none">
            {diagnosis.care.map((carePoint, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed relative before:content-['•'] before:absolute before:-left-4 before:text-teal-400 before:font-bold"
              >
                {carePoint}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons: Scan Another Plant & Share */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            id="rescan-btn"
            onClick={onNewScan}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold tracking-wide shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all duration-200 active:scale-98 flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Naya Paudha Scan Karein</span>
          </button>

          <button
            id="audio-repeat-btn"
            onClick={onReadAloud}
            className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isSpeaking ? 'Aawaz Rokein' : 'Aawaz me Sunein'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
