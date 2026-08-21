import { useCallback } from 'react';

export function useAudioChime() {
  const playStepChime = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // Master volume for the bell
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.85, now);
      masterGain.connect(ctx.destination);

      // Classic Kitchen Oven Bell harmonic partials (Metallic Brass Bell)
      // Fundamental pitch ~1200 Hz with authentic acoustic bell ratios & decay curves
      const partials = [
        { freqRatio: 1.00, gain: 0.45, decay: 2.2 },  // Fundamental / Prime
        { freqRatio: 1.21, gain: 0.30, decay: 1.6 },  // Tierce (Minor 3rd)
        { freqRatio: 1.50, gain: 0.22, decay: 1.4 },  // Quint (Fifth)
        { freqRatio: 2.00, gain: 0.18, decay: 1.0 },  // Nominal (Octave)
        { freqRatio: 2.76, gain: 0.12, decay: 0.7 },  // Supernominal (Metallic shimmer)
        { freqRatio: 4.07, gain: 0.08, decay: 0.35 }, // High strike ping
        { freqRatio: 5.42, gain: 0.05, decay: 0.15 }  // Initial hammer transient
      ];

      const baseFreq = 1200; // Bright, audible kitchen oven bell tone

      partials.forEach(partial => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * partial.freqRatio, now);

        // Immediate crisp strike attack (<3ms) and exponential metallic decay
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(partial.gain, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + partial.decay);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + partial.decay + 0.05);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  }, []);

  const playSuccessCelebration = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      // Major chord fanfare (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.12);

        gain.gain.setValueAtTime(0.001, now + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.25, now + index * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 1.3);
      });
    } catch {
      // Audio context error handling
    }
  }, []);

  return { playStepChime, playSuccessCelebration };
}
