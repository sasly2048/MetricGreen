"use client";

// High-end synthetic UI sounds using native Web Audio API
// No need for external .wav or .mp3 files!

let globalAudioCtx = null;

function playTone(frequency, type, duration, vol) {
  try {
    if (!globalAudioCtx) {
      globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (globalAudioCtx.state === "suspended") {
      globalAudioCtx.resume();
    }
    const audioCtx = globalAudioCtx;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Fade out to avoid clicks
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + duration,
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio context errors if browser blocks autoplay before interaction
  }
}

export const uiSounds = {
  // ASMR style dull 'tick' for hovering elements
  hover: () => playTone(800, "sine", 0.05, 0.05),

  // Bright tap for success clicks
  tap: () => playTone(1200, "triangle", 0.08, 0.1),

  // High-pitched rapid notification
  notification: () => {
    playTone(1800, "sine", 0.05, 0.08);
    setTimeout(() => playTone(2000, "sine", 0.05, 0.08), 60);
  },

  // Error buzz
  error: () => playTone(150, "sawtooth", 0.2, 0.1),

  // Futuristic success chime
  success: () => {
    playTone(600, "sine", 0.1, 0.1);
    setTimeout(() => playTone(800, "sine", 0.15, 0.1), 100);
    setTimeout(() => playTone(1200, "sine", 0.3, 0.1), 200);
  },

  // Matrix decrypt finish sound
  decrypt: () => playTone(2000, "square", 0.05, 0.03),
};
