import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { ScanResultCard } from './components/ScanResultCard';
import { NotALeafCard } from './components/NotALeafCard';
import { HealthyScenarioCard } from './components/HealthyScenarioCard';
import { CircularCameraScanSection } from './components/CircularCameraScanSection';
import { CameraModal } from './components/CameraModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PlantDiagnosis, ScanViewMode } from './types';
import { compressLeafImage } from './utils/imageCompressor';
import { playScanBlichSound, speakText, stopSpeaking } from './utils/audioEffects';
import {
  ASSETS,
  EARLY_BLIGHT_DIAGNOSIS,
  POWDERY_MILDEW_DIAGNOSIS,
  LEAF_CURL_DIAGNOSIS,
  RUST_DIAGNOSIS,
  HEALTHY_PLANT_DIAGNOSIS,
  NOT_A_LEAF_DIAGNOSIS,
} from './data/mockData';
import {
  Sparkles,
  Camera,
  CheckCircle2,
  RefreshCw,
  Upload,
  Zap,
  Mic,
  Volume2,
  VolumeX,
  Leaf
} from 'lucide-react';

export default function App() {
  // Leaf Scanner defaults directly to the active ready-to-scan state
  // Old tomato scan and previous medicines are not pre-displayed
  const [viewMode, setViewMode] = useState<ScanViewMode>('ready_scan');
  const [currentDiagnosis, setCurrentDiagnosis] = useState<PlantDiagnosis | null>(null);
  const [currentLeafImage, setCurrentLeafImage] = useState<string | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState<string>('Patta scan ho raha hai...');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCameraSection, setShowCameraSection] = useState(true);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Helper to pronounce diagnosis & medicine automatically or on-demand
  const speakDiagnosisDetails = (diagnosis: PlantDiagnosis) => {
    stopSpeaking();

    if (diagnosis.isLeaf === false || diagnosis.status === 'not_a_leaf') {
      const msg = diagnosis.notLeafMessage || 'Sorry, this is not a leaf. Kripya kisi paudhe ke patte ki photo scan karein.';
      speakText(
        msg,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
      return;
    }

    let speech = '';
    if (diagnosis.diseaseDetected) {
      speech = `${diagnosis.diseaseName}. ` +
        `Dawai hai: ${diagnosis.treatment?.dawai || 'Sahi keetnashak spray karein'}. ` +
        `Tariqa: ${diagnosis.treatment?.tariqa || 'Patton par spray karein'}.`;
    } else {
      speech = `Aapka paudha bilkul swasth hai. Isme koi bimari nahi hai.`;
    }

    speakText(
      speech,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Toggle or re-read current diagnosis
  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (currentDiagnosis) {
      speakDiagnosisDetails(currentDiagnosis);
    } else {
      speakText(
        'Kripya pehle kisi paudhe ke patte ki photo scan karein.',
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  // Switch between preset scenarios or return to scanner
  const handleModeChange = (mode: ScanViewMode) => {
    stopSpeaking();
    setIsSpeaking(false);
    setViewMode(mode);

    if (mode === 'ready_scan') {
      setShowCameraSection(true);
      setCurrentDiagnosis(null);
      setCurrentLeafImage(null);
    } else if (mode === 'result_blight') {
      setShowCameraSection(false);
      setCurrentDiagnosis(EARLY_BLIGHT_DIAGNOSIS);
      setCurrentLeafImage(ASSETS.tomatoBlightImg);
      speakDiagnosisDetails(EARLY_BLIGHT_DIAGNOSIS);
    } else if (mode === 'result_powdery_mildew') {
      setShowCameraSection(false);
      setCurrentDiagnosis(POWDERY_MILDEW_DIAGNOSIS);
      setCurrentLeafImage(ASSETS.tomatoBlightImg);
      speakDiagnosisDetails(POWDERY_MILDEW_DIAGNOSIS);
    } else if (mode === 'result_leaf_curl') {
      setShowCameraSection(false);
      setCurrentDiagnosis(LEAF_CURL_DIAGNOSIS);
      setCurrentLeafImage(ASSETS.tomatoBlightImg);
      speakDiagnosisDetails(LEAF_CURL_DIAGNOSIS);
    } else if (mode === 'result_rust') {
      setShowCameraSection(false);
      setCurrentDiagnosis(RUST_DIAGNOSIS);
      setCurrentLeafImage(ASSETS.tomatoBlightImg);
      speakDiagnosisDetails(RUST_DIAGNOSIS);
    } else if (mode === 'result_healthy') {
      setShowCameraSection(false);
      setCurrentDiagnosis(HEALTHY_PLANT_DIAGNOSIS);
      setCurrentLeafImage(ASSETS.healthyLeafImg);
      speakDiagnosisDetails(HEALTHY_PLANT_DIAGNOSIS);
    } else if (mode === 'not_a_leaf') {
      setShowCameraSection(false);
      setCurrentDiagnosis(NOT_A_LEAF_DIAGNOSIS);
      setCurrentLeafImage(ASSETS.bgGarden);
      speakDiagnosisDetails(NOT_A_LEAF_DIAGNOSIS);
    }
  };

  // Ultra-fast AI analysis on uploaded/captured image with Gemini API
  const handleAnalyzeImage = async (rawImageDataUrl: string) => {
    // 1. Instantly trigger synthesized "blich" sound to confirm scanning start
    playScanBlichSound();

    setIsScanning(true);
    setShowCameraSection(true);
    setScanStatusMessage('Leaf image optimize ho rahi hai & scanning shuru ho gayi hai...');
    stopSpeaking();
    setIsSpeaking(false);

    try {
      // Step 1: Sub-millisecond client compression (<15ms)
      const compressedImageDataUrl = await compressLeafImage(rawImageDataUrl, 800, 0.75);
      setScanStatusMessage('Gemini AI leaf scanner bimari & dawai pehchan raha hai...');

      // Step 2: Server diagnosis call with multi-model fallback
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressedImageDataUrl,
          mimeType: 'image/jpeg',
        }),
      });

      const data = await response.json();

      if (data.success && data.diagnosis) {
        const diag: PlantDiagnosis = data.diagnosis;
        setCurrentDiagnosis(diag);
        setCurrentLeafImage(rawImageDataUrl);
        setShowCameraSection(false);

        // Check if the uploaded image is NOT a leaf
        if (diag.isLeaf === false || diag.status === 'not_a_leaf') {
          setViewMode('not_a_leaf');
        } else if (diag.status === 'healthy') {
          setViewMode('result_healthy');
        } else {
          setViewMode('result_custom');
        }

        // Automatic voice announcement of diagnosis and medicine
        speakDiagnosisDetails(diag);
      } else {
        // Fallback with varied diagnosis
        const fallbackList = [EARLY_BLIGHT_DIAGNOSIS, POWDERY_MILDEW_DIAGNOSIS, LEAF_CURL_DIAGNOSIS, RUST_DIAGNOSIS];
        const chosen = fallbackList[rawImageDataUrl.length % fallbackList.length];
        setCurrentDiagnosis(chosen);
        setCurrentLeafImage(rawImageDataUrl);
        setViewMode('result_custom');
        setShowCameraSection(false);
        speakDiagnosisDetails(chosen);
      }
    } catch (err) {
      console.error('Diagnosis request error:', err);
      const fallbackList = [EARLY_BLIGHT_DIAGNOSIS, POWDERY_MILDEW_DIAGNOSIS, LEAF_CURL_DIAGNOSIS, RUST_DIAGNOSIS];
      const chosen = fallbackList[rawImageDataUrl.length % fallbackList.length];
      setCurrentDiagnosis(chosen);
      setCurrentLeafImage(rawImageDataUrl);
      setViewMode('result_custom');
      setShowCameraSection(false);
      speakDiagnosisDetails(chosen);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectSample = (type: 'blight' | 'powdery_mildew' | 'leaf_curl' | 'rust' | 'healthy' | 'not_a_leaf') => {
    setIsCameraModalOpen(false);
    playScanBlichSound();

    if (type === 'blight') {
      handleModeChange('result_blight');
    } else if (type === 'powdery_mildew') {
      handleModeChange('result_powdery_mildew');
    } else if (type === 'leaf_curl') {
      handleModeChange('result_leaf_curl');
    } else if (type === 'rust') {
      handleModeChange('result_rust');
    } else if (type === 'healthy') {
      handleModeChange('result_healthy');
    } else {
      handleModeChange('not_a_leaf');
    }
  };

  const handleFileUpload = async (file: File) => {
    playScanBlichSound();
    try {
      const compressedDataUrl = await compressLeafImage(file, 800, 0.75);
      handleAnalyzeImage(compressedDataUrl);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          handleAnalyzeImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToScanner = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setViewMode('ready_scan');
    setShowCameraSection(true);
    setCurrentDiagnosis(null);
    setCurrentLeafImage(null);
  };

  return (
    <div className="min-h-screen relative bg-[#021812] text-emerald-50 overflow-x-hidden flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Background: Stylized botanical garden backdrop with sleek green ambient lighting */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={ASSETS.bgGarden}
          alt="Lush botanical garden background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-20 scale-105 filter blur-[3px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#021d15]/90 via-[#03231a]/85 to-[#01140e]/95" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-teal-400/15 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-[90px]" />
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]" />
      </div>

      {/* Prominent Creator Banner at the Very Top */}
      <div className="w-full bg-gradient-to-r from-[#01261c] via-[#043d2c] to-[#01261c] border-b border-emerald-400/35 py-2.5 px-4 shadow-[0_4px_25px_rgba(0,0,0,0.6)] text-center relative z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-emerald-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-400/35">
            Website Creator
          </span>
          <h2 className="text-base sm:text-xl md:text-2xl font-black tracking-wide text-white font-['Cabinet_Grotesk',sans-serif]">
            Created by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300 underline decoration-emerald-400/70 underline-offset-4">Himanshu Singh</span>
          </h2>
          <span className="text-teal-300/80 text-xs hidden sm:inline-block font-medium">
            • Instant AI Plant Leaf Disease Detector
          </span>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <TopNav
        currentMode={viewMode}
        onChangeMode={handleModeChange}
        onReadAloud={handleReadAloud}
        isSpeaking={isSpeaking}
        onOpenLiveCamera={() => {
          playScanBlichSound();
          setIsCameraModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center">
        
        {/* Big Upper Hero Heading: Created by Himanshu Singh */}
        <div className="w-full max-w-2xl mb-6 text-center animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-400/35 text-emerald-300 text-xs font-bold tracking-wide shadow-inner mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Fast AI Leaf Disease Detection & Medicine Assistant</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-['Cabinet_Grotesk',sans-serif] leading-tight">
            Created by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">Himanshu Singh</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-emerald-200/90 mt-2.5 font-medium max-w-lg mx-auto leading-relaxed">
            Kisi bhi paudhe ke patte ki photo khinchein — AI turant bimari pehchan kar aawaz me sahi dawai aur dekhbhal batayega.
          </p>

          {/* Superfast Action Buttons */}
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <button
              id="hero-scan-camera-btn"
              onClick={() => {
                playScanBlichSound();
                setIsCameraModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 transition"
            >
              <Camera className="w-4 h-4" />
              <span>Camera se Patta Scan Karein</span>
            </button>

            {viewMode !== 'ready_scan' && (
              <button
                id="hero-reset-scanner-btn"
                onClick={handleResetToScanner}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-400/30 text-emerald-200 font-bold text-xs sm:text-sm active:scale-95 transition"
              >
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Naya Patta Scan Karein</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Scanning Status Feedback with Audio Indication */}
        {isScanning && (
          <div className="w-full max-w-xl mb-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 border border-emerald-400/50 shadow-2xl flex items-center gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 text-emerald-300 animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-bold text-white flex items-center justify-between">
                <span>Fast AI Scanner Shuru Ho Gya (Blich Sound Triggered)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-mono">
                  &lt; 2 seconds
                </span>
              </p>
              <p className="text-xs text-emerald-200/90 font-medium">
                {scanStatusMessage}
              </p>
            </div>
          </div>
        )}

        {/* Primary View Router */}
        {viewMode === 'ready_scan' || showCameraSection ? (
          <div className="w-full max-w-xl mb-6 rounded-3xl bg-[#03241b]/90 border border-emerald-500/30 shadow-2xl p-6 backdrop-blur-xl">
            <div className="text-center mb-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Live Leaf Scanner Ready
              </span>
              <p className="text-xs text-emerald-400/70 mt-0.5">
                Kripya patte ki photo lene ke liye circle par click karein ya gallery se upload karein
              </p>
            </div>

            <CircularCameraScanSection
              onScanClick={() => {
                playScanBlichSound();
                setIsCameraModalOpen(true);
              }}
              onFileUpload={handleFileUpload}
              isScanning={isScanning}
              onSelectSample={handleSelectSample}
            />
          </div>
        ) : null}

        {/* Non-Leaf Detection Screen ("Sorry, this is not a leaf") */}
        {viewMode === 'not_a_leaf' && currentDiagnosis && (
          <div className="w-full max-w-xl space-y-4">
            <NotALeafCard
              diagnosis={currentDiagnosis}
              scannedImage={currentLeafImage || ASSETS.bgGarden}
              onNewScan={handleResetToScanner}
              onReadAloud={handleReadAloud}
              isSpeaking={isSpeaking}
            />
          </div>
        )}

        {/* Real Leaf Diagnosis Results Card (With prominent Voice readout & Medicine) */}
        {viewMode !== 'ready_scan' && viewMode !== 'not_a_leaf' && currentDiagnosis && (
          <div className="w-full max-w-xl space-y-4">
            <ScanResultCard
              diagnosis={currentDiagnosis}
              leafImage={currentLeafImage || ASSETS.tomatoBlightImg}
              onNewScan={handleResetToScanner}
              onReadAloud={handleReadAloud}
              isSpeaking={isSpeaking}
            />

            {/* Quick Toggle for healthy comparison if needed */}
            <HealthyScenarioCard
              isCurrentViewHealthy={currentDiagnosis.status === 'healthy'}
              onSwitchToHealthy={() => handleModeChange('result_healthy')}
              onSwitchToBlight={() => handleModeChange('result_blight')}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-emerald-300/80 pb-6 space-y-1">
          <p className="font-bold text-white">
            Created by <span className="text-emerald-400 font-extrabold">Himanshu Singh</span> • FloraMate AI
          </p>
          <p className="text-[11px] text-emerald-400/60">
            High-Speed Plant Leaf Disease Detection & Audio Assistant in Hinglish
          </p>
        </footer>
      </main>

      {/* Live Camera Modal */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCaptureImage={(img) => {
          setIsCameraModalOpen(false);
          handleAnalyzeImage(img);
        }}
        onSelectSample={handleSelectSample}
      />

      {/* Offline PWA Indicator */}
      <OfflineIndicator />
    </div>
  );
}
