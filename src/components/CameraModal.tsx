import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { ASSETS } from '../data/mockData';
import { playScanBlichSound } from '../utils/audioEffects';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureImage: (imageDataUrl: string) => void;
  onSelectSample: (type: 'blight' | 'powdery_mildew' | 'leaf_curl' | 'rust' | 'healthy' | 'not_a_leaf') => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCaptureImage,
  onSelectSample,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isCancelled = false;
    if (!isOpen) {
      stopCamera();
      return;
    }

    const initCamera = async () => {
      try {
        setCameraError(null);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraError('Camera API is not supported in this browser window.');
          return;
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (isCancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch((playErr) => {
            console.warn('Camera video play caught:', playErr);
          });
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('Camera access error:', err);
          setCameraError(
            'Camera access was restricted or not available. Aap photo upload kar sakte hain ya demo leaf chun sakte hain.'
          );
        }
      }
    };

    initCamera();

    return () => {
      isCancelled = true;
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        try {
          ctx.drawImage(video, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          stopCamera();
          playScanBlichSound();
          onCaptureImage(dataUrl);
          return;
        } catch (drawErr) {
          console.warn('Canvas draw error:', drawErr);
        }
      }
    }
    // Fallback if camera stream was not ready
    stopCamera();
    playScanBlichSound();
    onSelectSample('blight');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          stopCamera();
          playScanBlichSound();
          onCaptureImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#03231a] border border-emerald-500/30 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-500/20 bg-[#021a13]">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white font-['Cabinet_Grotesk',sans-serif]">
              FloraMate AI Lens
            </span>
          </div>
          <button
            id="close-camera-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-900/60 text-emerald-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder display */}
        <div className="relative w-full aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          <canvas ref={canvasRef} className="hidden" />

          {/* Video element */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover ${cameraError ? 'hidden' : 'block'}`}
          />

          {/* Simulated / Fallback leaf if camera error */}
          {cameraError && (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-emerald-950/40">
              <img
                src={ASSETS.tomatoBlightImg}
                alt="Tomato Leaf"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
              <div className="relative z-10 max-w-xs bg-black/75 p-4 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
                <AlertCircle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-xs text-emerald-100 mb-3">{cameraError}</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Photo Upload Karein</span>
                  </button>
                  <button
                    onClick={() => onSelectSample('blight')}
                    className="w-full py-2 px-3 rounded-xl bg-teal-900/70 hover:bg-teal-800 text-teal-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Demo Leaf (Infected Patta) Use Karein</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Viewfinder HUD Overlays */}
          {!cameraError && (
            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
              {/* Corner brackets */}
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-2 border-l-2 border-emerald-400" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-emerald-400" />
              </div>

              {/* Central scanning focus circle with leaf vein */}
              <div className="self-center w-36 h-36 rounded-full border border-dashed border-teal-300/60 animate-pulse flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-400/80 shadow-[0_0_12px_#34d399]" />
              </div>

              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-2 border-l-2 border-emerald-400" />
                <div className="w-8 h-8 border-b-2 border-r-2 border-emerald-400" />
              </div>

              {/* Horizontal animated scan line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line opacity-75" />
            </div>
          )}

          {/* Flip camera button */}
          {!cameraError && (
            <button
              onClick={() => setFacingMode(facingMode === 'environment' ? 'user' : 'environment')}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-emerald-200 hover:bg-black/80 transition"
              title="Camera switch karein"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Bottom controls */}
        <div className="p-4 bg-[#021a13] border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          {/* Shutter Capture Button */}
          <button
            id="snap-photo-btn"
            onClick={handleCapture}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="w-full h-full rounded-full border-2 border-white/80 flex items-center justify-center bg-emerald-700/80">
              <div className="w-8 h-8 rounded-full bg-white shadow-md" />
            </div>
          </button>

          <button
            onClick={() => onSelectSample('blight')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-950/80 hover:bg-teal-900 border border-teal-500/30 text-teal-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Demo Leaf Sample</span>
          </button>
        </div>

      </div>
    </div>
  );
};
