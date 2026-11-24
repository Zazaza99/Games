window.ChemTycoon = window.ChemTycoon || {};

window.ChemTycoon.Audio = (function () {
  let ctx = null;
  let muted = false;
  let humOsc1 = null;
  let humOsc2 = null;
  let humGain = null;
  let humActive = false;

  function ensureContext() {
    if (muted) return null;
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playTone(freq, duration, type, volume, endFreq, delaySec) {
    const c = ensureContext();
    if (!c) return;
    const now = c.currentTime + (delaySec || 0);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq && endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume || 0.08, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playNoiseBurst(duration, volume, filterFreq, delaySec, filterType) {
    const c = ensureContext();
    if (!c) return;
    const now = c.currentTime + (delaySec || 0);
    const sampleRate = c.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = c.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = c.createBufferSource();
    noise.buffer = buffer;

    const filter = c.createBiquadFilter();
    filter.type = filterType || "bandpass";
    filter.frequency.setValueAtTime(filterFreq || 1800, now);
    filter.Q.setValueAtTime(1.6, now);

    const gain = c.createGain();
    gain.gain.setValueAtTime(volume || 0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    noise.start(now);
    noise.stop(now + duration + 0.02);
  }

  function playClick() {
    playTone(920, 0.055, "triangle", 0.06, 480, 0);
  }

  function playSurvey() {
    playTone(440, 0.14, "sine", 0.07, 660, 0);
    playTone(660, 0.18, "sine", 0.07, 990, 0.11);
    playTone(1320, 0.22, "triangle", 0.05, 1180, 0.24);
  }

  function playUpgrade() {
    playNoiseBurst(0.18, 0.065, 2400, 0);
    playTone(320, 0.1, "sawtooth", 0.045, 520, 0.04);
    playTone(640, 0.16, "triangle", 0.065, 960, 0.12);
  }

  function playCoin() {
    playTone(1174.66, 0.09, "sine", 0.065, 1174.66, 0);
    playTone(1567.98, 0.19, "sine", 0.075, 1567.98, 0.075);
  }

  function playError() {
    playTone(180, 0.1, "sawtooth", 0.05, 140, 0);
    playTone(140, 0.12, "sawtooth", 0.05, 110, 0.11);
  }

  function playPaperRustle() {
    playNoiseBurst(0.12, 0.05, 3200, 0, "bandpass");
    playNoiseBurst(0.16, 0.045, 2200, 0.08, "bandpass");
  }

  function playStamp() {
    playNoiseBurst(0.08, 0.07, 600, 0, "lowpass");
    playTone(160, 0.09, "triangle", 0.08, 90, 0.01);
  }

  function playShipHorn() {
    playTone(130, 0.35, "sawtooth", 0.055, 128, 0);
    playTone(195, 0.35, "triangle", 0.045, 192, 0.02);
  }

  function playExplosion() {
    // Deep boom + debris noise + SCADA emergency klaxon
    playNoiseBurst(0.95, 0.18, 280, 0, "lowpass");
    playNoiseBurst(0.65, 0.10, 1200, 0.08, "bandpass");
    playTone(110, 0.75, "sawtooth", 0.14, 28, 0);
    playTone(880, 0.18, "square", 0.07, 620, 0.45);
    playTone(880, 0.18, "square", 0.07, 620, 0.70);
  }

  function updateHum() {
    if (muted || !humActive) {
      if (humGain && ctx) {
        humGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.15);
      }
      return;
    }
    const c = ensureContext();
    if (!c) return;
    if (!humOsc1) {
      humOsc1 = c.createOscillator();
      humOsc2 = c.createOscillator();
      const filter = c.createBiquadFilter();
      humGain = c.createGain();

      humOsc1.type = "sawtooth";
      humOsc1.frequency.setValueAtTime(58, c.currentTime);
      humOsc2.type = "triangle";
      humOsc2.frequency.setValueAtTime(116.5, c.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(190, c.currentTime);

      humGain.gain.setValueAtTime(0.0001, c.currentTime);

      humOsc1.connect(filter);
      humOsc2.connect(filter);
      filter.connect(humGain);
      humGain.connect(c.destination);

      humOsc1.start();
      humOsc2.start();
    }
    humGain.gain.setTargetAtTime(0.022, c.currentTime, 0.35);
  }

  function setHumActive(active) {
    humActive = Boolean(active);
    updateHum();
  }

  function toggleMute() {
    muted = !muted;
    updateHum();
    if (!muted) {
      playClick();
    }
    return muted;
  }

  function isMuted() {
    return muted;
  }

  return {
    playClick,
    playSurvey,
    playUpgrade,
    playCoin,
    playError,
    playPaperRustle,
    playStamp,
    playShipHorn,
    playExplosion,
    setHumActive,
    toggleMute,
    isMuted
  };
})();
