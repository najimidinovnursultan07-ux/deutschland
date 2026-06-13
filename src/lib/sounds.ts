let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext!)();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.08
) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start();
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
}

export function playCorrectSound(enabled = true): void {
  if (!enabled) return;
  playTone(880, 0.12, "sine", 0.1);
  setTimeout(() => playTone(1174, 0.15, "sine", 0.08), 80);
}

export function playWrongSound(enabled = true): void {
  if (!enabled) return;
  playTone(220, 0.25, "triangle", 0.07);
  setTimeout(() => playTone(165, 0.3, "triangle", 0.05), 100);
}

export function playHeartLostSound(enabled = true): void {
  if (!enabled) return;
  playTone(330, 0.2, "sawtooth", 0.04);
  setTimeout(() => playTone(220, 0.35, "sawtooth", 0.03), 120);
}
