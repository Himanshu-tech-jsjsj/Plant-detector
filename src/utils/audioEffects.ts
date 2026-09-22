/**
 * Audio Synthesizer & Speech Engine for FloraMate AI Leaf Scanner
 * - Synthetic "blich / bleep" scanner trigger sound using Web Audio API
 * - Automatic voice readout of disease, medicine, and non-leaf warnings
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a high-tech "blich" scanning radar chirp sound when leaf scan starts
 */
export function playScanBlichSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Oscillator 1: Rapid upward frequency sweep ("blich" chirp)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(440, now);
    osc1.frequency.exponentialRampToValueAtTime(1850, now + 0.09);
    osc1.frequency.exponentialRampToValueAtTime(750, now + 0.16);

    gain1.gain.setValueAtTime(0.01, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.2);

    // Oscillator 2: Subtle secondary high metallic resonant tick
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2200, now + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(800, now + 0.12);

    gain2.gain.setValueAtTime(0.01, now + 0.02);
    gain2.gain.linearRampToValueAtTime(0.2, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.02);
    osc2.stop(now + 0.15);
  } catch (err) {
    console.warn('Could not play scan blich sound:', err);
  }
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

// Preload voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

/**
 * Automated voice speaker function
 */
export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick best Hindi / Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find((v) => v.lang.startsWith('hi')) ||
      voices.find((v) => v.lang.startsWith('en-IN')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (voice) {
      utterance.voice = voice;
    }

    if (onStart) utterance.onstart = onStart;
    utterance.onend = () => {
      activeUtterance = null;
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      activeUtterance = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
    activeUtterance = null;
    if (onEnd) onEnd();
  }
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}
