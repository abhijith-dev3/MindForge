
let audioCtx;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};


const playTone = ({
  frequency = 440,
  duration = 0.15,
  type = "sine",
  volume = 0.2,
  startDelay = 0,
  frequencyEnd = null,
}) => {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + startDelay);
    if (frequencyEnd) {
      osc.frequency.exponentialRampToValueAtTime(
        frequencyEnd,
        ctx.currentTime + startDelay + duration
      );
    }

    gain.gain.setValueAtTime(volume, ctx.currentTime + startDelay);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + startDelay + duration
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startDelay);
    osc.stop(ctx.currentTime + startDelay + duration + 0.02);
  } catch (err) {
    console.warn("Sound playback failed:", err);
  }
};


const playSequence = (notes) => {
  notes.forEach((note) => playTone(note));
};


export const unlockAudio = () => {
  const ctx = getCtx();
  playTone({ frequency: 440, duration: 0.001, volume: 0.0001 });
  return ctx;
};

const MEMORY_COLOR_FREQ = {
  red: 329.63, 
  blue: 261.63,
  green: 392.0, 
  yellow: 220.0, 
};

export const sounds = {

  hit: () => playTone({ frequency: 880, duration: 0.08, type: "triangle", volume: 0.25 }),
  accuracyGameOver: () =>
    playSequence([
      { frequency: 523.25, duration: 0.35, type: "sine", volume: 0.2, startDelay: 0 },
      { frequency: 659.25, duration: 0.35, type: "sine", volume: 0.2, startDelay: 0.1 },
      { frequency: 783.99, duration: 0.45, type: "sine", volume: 0.22, startDelay: 0.2 },
    ]),

  countdownTick: () => playTone({ frequency: 440, duration: 0.1, type: "square", volume: 0.15 }),
  go: () => playTone({ frequency: 987.77, duration: 0.2, type: "sine", volume: 0.25 }),
  tooSoon: () =>
    playTone({ frequency: 150, duration: 0.4, type: "sawtooth", volume: 0.28, frequencyEnd: 60 }),
  reactionRound: () => playTone({ frequency: 660, duration: 0.1, type: "triangle", volume: 0.2 }),
  reactionGameOver: () =>
    playSequence([
      { frequency: 523.25, duration: 0.35, type: "sine", volume: 0.2, startDelay: 0 },
      { frequency: 659.25, duration: 0.35, type: "sine", volume: 0.2, startDelay: 0.1 },
      { frequency: 783.99, duration: 0.45, type: "sine", volume: 0.22, startDelay: 0.2 },
    ]),


  memoryFlash: (color) =>
    playTone({ frequency: MEMORY_COLOR_FREQ[color] || 440, duration: 0.3, type: "square", volume: 0.2 }),
  memoryWrong: () =>
    playTone({ frequency: 160, duration: 0.5, type: "sawtooth", volume: 0.3, frequencyEnd: 55 }),
  memoryNextRound: () => playTone({ frequency: 523.25, duration: 0.12, type: "sine", volume: 0.18 }),
  memoryWin: () =>
    playSequence([
      { frequency: 523.25, duration: 0.22, type: "sine", volume: 0.25, startDelay: 0 },
      { frequency: 659.25, duration: 0.22, type: "sine", volume: 0.25, startDelay: 0.15 },
      { frequency: 783.99, duration: 0.22, type: "sine", volume: 0.25, startDelay: 0.3 },
      { frequency: 1046.5, duration: 0.4, type: "sine", volume: 0.28, startDelay: 0.45 },
    ]),
};