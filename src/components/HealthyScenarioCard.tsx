import React from 'react';
import { CheckCircle2, Sun, Sparkles, Sprout, ArrowRight } from 'lucide-react';
import { ASSETS } from '../data/mockData';

interface HealthyScenarioCardProps {
  onSwitchToHealthy: () => void;
  isCurrentViewHealthy?: boolean;
  onSwitchToBlight?: () => void;
}

export const HealthyScenarioCard: React.FC<HealthyScenarioCardProps> = ({
  onSwitchToHealthy,
  isCurrentViewHealthy = false,
  onSwitchToBlight,
}) => {
  return (
    <div
      id="healthy-scenario-comparison-card"
      className="w-full max-w-xl mx-auto mt-6 rounded-3xl bg-gradient-to-br from-[#063327]/90 via-[#03231a]/95 to-[#021812]/90 border border-emerald-400/25 p-5 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden select-none"
    >
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>No-Disease Scenario (Healthy Plant Mockup Logic)</span>
        </div>

        {isCurrentViewHealthy ? (
          <button
            id="view-blight-toggle-btn"
            onClick={onSwitchToBlight}
            className="flex items-center gap-1 text-xs font-semibold text-teal-300 hover:text-white transition"
          >
            <span>Early Blight Dikhayein</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            id="view-healthy-toggle-btn"
            onClick={onSwitchToHealthy}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-200 transition"
          >
            <span>Full Preview Kholein</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <p className="text-xs text-emerald-200/70 mb-4 leading-relaxed">
        Agar scan kiya gaya paudha swasth hota hai, toh UI is tarah badal jayega:
      </p>

      {/* Mockup Preview Box */}
      <div className="rounded-2xl bg-emerald-950/70 border border-emerald-500/30 p-4 space-y-3 shadow-inner">
        <div className="flex items-center gap-3">
          {/* Leaf thumbnail */}
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-emerald-400/40 shadow-md">
            <img
              src={ASSETS.healthyLeafImg}
              alt="Swasth Paudha Leaf"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-emerald-500/10" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>98% Confidence • All Clear</span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white leading-tight font-['Cabinet_Grotesk',sans-serif]">
              Aapka Paudha Swasth Hai! (No Disease Detected)
            </h4>
          </div>
        </div>

        {/* Structured advice bullets */}
        <div className="pt-2 border-t border-emerald-500/20 space-y-2 text-xs text-emerald-100">
          <div className="flex items-start gap-2">
            <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-amber-300 font-semibold">Dhoop:</strong> Is paudhe ko zyada dhoop/paani ki zarurat hai. Hafte me sirf ek baar pani dein aur direct sunlight me rakhein.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-emerald-300 font-semibold">Fertilizer:</strong> Agle mahine ek baar fertilizer dein.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
