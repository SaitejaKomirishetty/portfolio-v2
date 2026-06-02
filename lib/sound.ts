'use client';

import { useSystemStore } from '@/store/useSystemStore';

/**
 * Tiny synthesized UI sounds via the Web Audio API — no audio assets needed.
 * Respects the global sound toggle and prefers-reduced-motion is unrelated,
 * but we keep sounds short and quiet.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

type Tone = { freq: number; duration: number; type?: OscillatorType };

const TONES: Record<string, Tone> = {
  open: { freq: 660, duration: 0.09, type: 'sine' },
  close: { freq: 320, duration: 0.08, type: 'sine' },
  click: { freq: 880, duration: 0.04, type: 'triangle' },
  minimize: { freq: 440, duration: 0.07, type: 'sine' },
};

export function playSound(name: keyof typeof TONES) {
  if (!useSystemStore.getState().soundEnabled) return;
  const audio = getCtx();
  if (!audio) return;
  const tone = TONES[name];

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = tone.type ?? 'sine';
  osc.frequency.value = tone.freq;
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06, audio.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audio.currentTime + tone.duration
  );
  osc.connect(gain).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + tone.duration);
}
