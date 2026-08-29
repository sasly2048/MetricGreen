"use client";

// Refined SFX — "sound with purpose."
// Only triggers on high-value moments: real state transitions, errors, milestones.
// Never on hover, navigation, or trivial clicks.

const STORAGE_KEY = "metricgreen:audio:v1";

let ctx = null;
let masterGain = null;
let settings = { enabled: true, volume: 0.35, mode: "normal" };

function ensureContext() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = settings.enabled ? settings.volume : 0;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) settings = { ...settings, ...JSON.parse(raw) };
  } catch {}
}

function save() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

load();

function tone({ freq = 440, type = "sine", dur = 0.1, gain = 0.1, attack = 0.005, release = 0.05, freqEnd }) {
  if (typeof window === "undefined") return;
  const ac = ensureContext();
  if (!ac) return;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (typeof freqEnd === "number") {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), now + dur);
  }
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur + release);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + dur + release + 0.02);
}

function noise({ dur = 0.15, gain = 0.06, filter = 1500, release = 0.1 }) {
  if (typeof window === "undefined") return;
  const ac = ensureContext();
  if (!ac) return;
  const now = ac.currentTime;
  const bufferSize = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filt = ac.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = filter;
  const g = ac.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur + release);
  src.connect(filt);
  filt.connect(g);
  g.connect(masterGain);
  src.start(now);
  src.stop(now + dur + release + 0.05);
}

// 9 carefully considered effects, each for a specific moment.
export const sfx = {
  // Major success — mint complete, retirement confirmed, big task done
  success() {
    const seq = [
      { f: 523, t: 0 },     // C5
      { f: 659, t: 80 },    // E5
      { f: 784, t: 160 },   // G5
      { f: 1047, t: 240 },  // C6
    ];
    seq.forEach(({ f, t }) =>
      setTimeout(() => tone({ freq: f, type: "sine", dur: 0.22, gain: 0.12, attack: 0.005, release: 0.18 }), t),
    );
  },

  // Failure or rejection
  error() {
    tone({ freq: 220, type: "sine", dur: 0.18, gain: 0.12, attack: 0.005, release: 0.15, freqEnd: 165 });
    setTimeout(() => tone({ freq: 165, type: "sine", dur: 0.22, gain: 0.1, attack: 0.005, release: 0.18 }), 120);
  },

  // Burn / retirement — distinctive low mechanical
  burn() {
    tone({ freq: 80, type: "sawtooth", dur: 0.5, gain: 0.05, attack: 0.01, release: 0.45, freqEnd: 40 });
    noise({ dur: 0.4, gain: 0.035, filter: 500, release: 0.35 });
    setTimeout(() => tone({ freq: 50, type: "sine", dur: 0.3, gain: 0.05, attack: 0.01, release: 0.25 }), 100);
  },

  // ZK proof generation — soft shimmer
  proof() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => tone({
        freq: 600 + i * 180,
        type: "sine",
        dur: 0.05,
        gain: 0.05,
        attack: 0.002,
        release: 0.04,
      }), i * 70);
    }
  },

  // Purchase complete — ascending then a satisfying chord
  purchase() {
    tone({ freq: 659, type: "sine", dur: 0.08, gain: 0.1, attack: 0.002, release: 0.06 });
    setTimeout(() => tone({ freq: 880, type: "sine", dur: 0.1, gain: 0.12, attack: 0.002, release: 0.08 }), 70);
    setTimeout(() => tone({ freq: 1109, type: "triangle", dur: 0.18, gain: 0.1, attack: 0.005, release: 0.15 }), 160);
  },

  // Wallet connect — distinct, futuristic
  connect() {
    tone({ freq: 220, type: "sine", dur: 0.06, gain: 0.08, attack: 0.002, release: 0.05, freqEnd: 660 });
    setTimeout(() => tone({ freq: 660, type: "sine", dur: 0.12, gain: 0.1, attack: 0.002, release: 0.1 }), 80);
  },

  // Network switch — quick blip
  switch() {
    tone({ freq: 880, type: "sine", dur: 0.05, gain: 0.08, attack: 0.002, release: 0.04 });
    setTimeout(() => tone({ freq: 1175, type: "sine", dur: 0.06, gain: 0.08, attack: 0.002, release: 0.05 }), 60);
  },

  // Stage transition — soft step
  step() {
    tone({ freq: 700, type: "sine", dur: 0.07, gain: 0.06, attack: 0.005, release: 0.06, freqEnd: 1000 });
  },

  // Notification — gentle alert
  notify() {
    tone({ freq: 1100, type: "sine", dur: 0.05, gain: 0.08, attack: 0.002, release: 0.04 });
    setTimeout(() => tone({ freq: 1400, type: "sine", dur: 0.06, gain: 0.08, attack: 0.002, release: 0.05 }), 70);
  },

  // Subtle UI tick for the rare meaningful toggle
  tick() {
    tone({ freq: 1200, type: "sine", dur: 0.03, gain: 0.05, attack: 0.002, release: 0.025 });
  },

  // No-op fallbacks (existing call sites still work but produce no sound)
  // These are intentionally silent to remove audio from high-frequency interactions.
  hover() {},
  click() {},
  toggle() {},
  whoosh() {},
  confirm() {},
  warn() {},
};

export function getAudioSettings() {
  return settings;
}

export function setAudioEnabled(enabled) {
  settings.enabled = enabled;
  if (masterGain) masterGain.gain.value = enabled ? settings.volume : 0;
  save();
  if (enabled) ensureContext();
}

export function setAudioVolume(v) {
  settings.volume = Math.max(0, Math.min(1, v));
  if (masterGain && settings.enabled) masterGain.gain.value = settings.volume;
  save();
}

export function setAudioMode(mode) {
  settings.mode = mode === "developer" ? "developer" : "normal";
  save();
}

export function initAudio() {
  ensureContext();
}
