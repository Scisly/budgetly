const STORAGE_KEY = "budgetly-sounds-enabled";
const VOLUME = 0.08;

let audioContext: AudioContext | null = null;

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  return localStorage.getItem(STORAGE_KEY) !== "false";
}

export function setSoundEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
}

function getContext(): AudioContext | null {
  if (!isSoundEnabled()) return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = VOLUME
): void {
  const context = getContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = gain;
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    context.currentTime + duration
  );

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

export function playClickSound(): void {
  playTone(800, 0.05, "sine", 0.04);
}

export function playNavigateSound(): void {
  playTone(520, 0.06, "sine", 0.05);
  window.setTimeout(() => playTone(660, 0.05, "sine", 0.04), 30);
}

export function playSuccessSound(): void {
  playTone(523, 0.08, "sine", 0.05);
  window.setTimeout(() => playTone(659, 0.08, "sine", 0.05), 80);
  window.setTimeout(() => playTone(784, 0.12, "sine", 0.04), 160);
}

export function unlockAudio(): void {
  getContext();
}
