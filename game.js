// ============================================================
// NIGHTWATCH - Cold War Radio Intercept Game
// ============================================================

// ===== CIPHER ENGINE =====
const Cipher = {
  caesarEncrypt(text, shift) {
    return text.split('').map(c => {
      if (c >= 'A' && c <= 'Z') return String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65);
      if (c >= 'a' && c <= 'z') return String.fromCharCode(((c.charCodeAt(0) - 97 + shift) % 26) + 97);
      return c;
    }).join('');
  },

  caesarDecrypt(text, shift) {
    return this.caesarEncrypt(text, 26 - (shift % 26));
  },

  atbash(text) {
    return text.split('').map(c => {
      if (c >= 'A' && c <= 'Z') return String.fromCharCode(90 - (c.charCodeAt(0) - 65));
      if (c >= 'a' && c <= 'z') return String.fromCharCode(122 - (c.charCodeAt(0) - 97));
      return c;
    }).join('');
  }
};

// ===== STORY DATA =====
const MISSIONS = [
  {
    id: 0,
    freq: 4725,
    freqDisplay: '04.725',
    title: 'ROUTINE CHECK',
    cipher: 'none',
    message: 'SECTOR SEVEN ALL CLEAR STOP NO UNUSUAL ACTIVITY STOP ROUTINE PATROL COMPLETE STOP NIGHTWATCH STANDING BY',
    words: ['SECTOR', 'SEVEN', 'ALL', 'CLEAR', 'STOP', 'NO', 'UNUSUAL', 'ACTIVITY', 'STOP', 'ROUTINE', 'PATROL', 'COMPLETE', 'STOP', 'NIGHTWATCH', 'STANDING', 'BY'],
    briefing: 'Your first intercept. A routine transmission on a known Allied frequency. Use this to calibrate your equipment and practice the capture protocol.',
    debrief: 'Standard patrol report. Nothing unusual... but Command has flagged unusual signal activity on higher frequencies tonight. Keep scanning.',
    hint: null,
    timePerWord: 5000,
  },
  {
    id: 1,
    freq: 6340,
    freqDisplay: '06.340',
    title: 'FALCON TRANSMISSION',
    cipher: 'caesar',
    cipherKey: 3,
    message: 'FALCON TO NEST STOP PACKAGE SECURED AT DEAD DROP BRAVO STOP WESTERN ASSET CONFIRMS DELIVERY STOP AWAIT FURTHER',
    words: ['FALCON', 'TO', 'NEST', 'STOP', 'PACKAGE', 'SECURED', 'AT', 'DEAD', 'DROP', 'BRAVO', 'STOP', 'WESTERN', 'ASSET', 'CONFIRMS', 'DELIVERY', 'STOP', 'AWAIT', 'FURTHER'],
    briefing: 'Encrypted signal detected on 6.340 MHz. Pattern suggests Soviet military cipher. Intercept and decode. This could be significant.',
    debrief: 'FALCON is a known Soviet handler. "Western asset" confirms a mole is active. Codename unknown. Someone inside Western intelligence is passing information. Continue monitoring — there must be more traffic.',
    hint: 'Analysis suggests a simple letter-shift cipher. Try CAESAR with different shift values.',
    timePerWord: 6500,
  },
  {
    id: 2,
    freq: 8195,
    freqDisplay: '08.195',
    title: 'CARDINAL IDENTIFIED',
    cipher: 'caesar',
    cipherKey: 7,
    message: 'CARDINAL HAS ACCESSED DEFENSE GRID SCHEMATICS STOP DOCUMENTS PHOTOGRAPHED AND READY FOR TRANSFER STOP PRIORITY ALPHA',
    words: ['CARDINAL', 'HAS', 'ACCESSED', 'DEFENSE', 'GRID', 'SCHEMATICS', 'STOP', 'DOCUMENTS', 'PHOTOGRAPHED', 'AND', 'READY', 'FOR', 'TRANSFER', 'STOP', 'PRIORITY', 'ALPHA'],
    briefing: 'Another encrypted transmission, higher frequency. Signal analysis shows same origin as FALCON traffic. Different cipher key suspected.',
    debrief: 'CARDINAL — a codename for the mole. They have access to defense grid schematics. This is a senior operative with high-level clearance. The damage could be catastrophic. We need to identify CARDINAL before the transfer happens.',
    hint: 'Same cipher type as before, but the shift value has changed. Try different CAESAR shifts.',
    timePerWord: 6000,
  },
  {
    id: 3,
    freq: 11480,
    freqDisplay: '11.480',
    title: 'EXTRACTION PLAN',
    cipher: 'caesar',
    cipherKey: 15,
    message: 'EXTRACTION CONFIRMED STOP CHECKPOINT CHARLIE STOP ZERO THREE HUNDRED HOURS STOP OCTOBER TWENTY STOP CARDINAL WILL CARRY BLUE BRIEFCASE',
    words: ['EXTRACTION', 'CONFIRMED', 'STOP', 'CHECKPOINT', 'CHARLIE', 'STOP', 'ZERO', 'THREE', 'HUNDRED', 'HOURS', 'STOP', 'OCTOBER', 'TWENTY', 'STOP', 'CARDINAL', 'WILL', 'CARRY', 'BLUE', 'BRIEFCASE'],
    briefing: 'High-priority transmission detected. Burst encoding suggests urgency. This could be operational details. Intercept immediately.',
    debrief: 'An extraction is planned. Checkpoint Charlie. October 20th, 0300 hours. CARDINAL will carry a blue briefcase. That gives us four days. But we still do not know who CARDINAL is. There must be one more transmission...',
    hint: 'Heavily shifted cipher. The shift value is higher than before. Keep trying CAESAR shifts — look for common words like STOP.',
    timePerWord: 5500,
  },
  {
    id: 4,
    freq: 14275,
    freqDisplay: '14.275',
    title: 'THE MOLE REVEALED',
    cipher: 'caesar',
    cipherKey: 19,
    message: 'CARDINAL IDENTITY VERIFIED STOP SENIOR ANALYST STATION NIGHTWATCH STOP RECRUITED PRAGUE NINETEEN FIFTY NINE STOP HANDLER CODENAME WOLF',
    words: ['CARDINAL', 'IDENTITY', 'VERIFIED', 'STOP', 'SENIOR', 'ANALYST', 'STATION', 'NIGHTWATCH', 'STOP', 'RECRUITED', 'PRAGUE', 'NINETEEN', 'FIFTY', 'NINE', 'STOP', 'HANDLER', 'CODENAME', 'WOLF'],
    briefing: 'URGENT — Final transmission from FALCON network detected. Signal strength is strong. This is the intelligence we have been waiting for. Capture everything.',
    debrief: 'CARDINAL is a senior analyst... at Station NIGHTWATCH. The mole is HERE. In this building. Recruited in Prague, 1959. Handler: WOLF. You need to report this immediately — but to whom can you trust?',
    hint: 'A large Caesar shift. Try values in the upper range (15-25). Look for the word STOP as your anchor.',
    timePerWord: 5000,
  },
  {
    id: 5,
    freq: 17850,
    freqDisplay: '17.850',
    title: 'COMPROMISED',
    cipher: 'caesar',
    cipherKey: 11,
    message: 'URGENT TO ALL UNITS STOP NIGHTWATCH OPERATOR HAS INTERCEPTED CARDINAL TRAFFIC STOP RECOMMEND IMMEDIATE ACTION STOP THE OPERATOR MUST NOT REPORT STOP REPEAT MUST NOT REPORT',
    words: ['URGENT', 'TO', 'ALL', 'UNITS', 'STOP', 'NIGHTWATCH', 'OPERATOR', 'HAS', 'INTERCEPTED', 'CARDINAL', 'TRAFFIC', 'STOP', 'RECOMMEND', 'IMMEDIATE', 'ACTION', 'STOP', 'THE', 'OPERATOR', 'MUST', 'NOT', 'REPORT', 'STOP', 'REPEAT', 'MUST', 'NOT', 'REPORT'],
    briefing: 'An unscheduled transmission on a new frequency. Signal is unusually strong — the source is close. Very close. Intercept immediately.',
    debrief: null, // Special ending
    hint: 'One final cipher to crack. Caesar shift — try all values. This message could save your life.',
    timePerWord: 4500,
  }
];

// Decoy words for mobile tap-to-select
const DECOY_POOL = [
  'ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'GOLF', 'HOTEL',
  'INDIA', 'JULIET', 'KILO', 'LIMA', 'MIKE', 'NOVEMBER', 'OSCAR', 'PAPA',
  'QUEBEC', 'ROMEO', 'SIERRA', 'TANGO', 'UNIFORM', 'VICTOR', 'WHISKEY',
  'XRAY', 'YANKEE', 'ZULU', 'ABORT', 'VECTOR', 'CIPHER', 'SIGNAL',
  'TOWER', 'BRIDGE', 'TARGET', 'SHADOW', 'EAGLE', 'VIPER', 'COBRA',
  'PHOENIX', 'HAMMER', 'DAGGER', 'SHIELD', 'SECTOR', 'CENTRAL', 'COMMAND',
  'RELAY', 'BEACON', 'STATIC', 'COPY', 'ROGER', 'OVER', 'CONFIRM',
  'DENIED', 'SECURE', 'BREACH', 'ASSET', 'AGENT', 'COVER', 'EXTRACT'
];

// ===== AUDIO ENGINE =====
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.staticNode = null;
    this.staticGain = null;
    this.toneNode = null;
    this.toneGain = null;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
      this.startStatic();
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  startStatic() {
    if (!this.initialized) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    this.staticNode = this.ctx.createBufferSource();
    this.staticNode.buffer = buffer;
    this.staticNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    this.staticGain = this.ctx.createGain();
    this.staticGain.gain.value = 0.15;

    this.staticNode.connect(filter);
    filter.connect(this.staticGain);
    this.staticGain.connect(this.masterGain);
    this.staticNode.start();
  }

  setStaticLevel(level) {
    if (!this.staticGain) return;
    this.staticGain.gain.setTargetAtTime(level * 0.2, this.ctx.currentTime, 0.1);
  }

  startTone(freq) {
    if (!this.initialized) return;
    this.stopTone();
    this.toneNode = this.ctx.createOscillator();
    this.toneNode.type = 'sine';
    this.toneNode.frequency.value = freq || 800;
    this.toneGain = this.ctx.createGain();
    this.toneGain.gain.value = 0;
    this.toneNode.connect(this.toneGain);
    this.toneGain.connect(this.masterGain);
    this.toneNode.start();
  }

  setToneLevel(level) {
    if (!this.toneGain) return;
    this.toneGain.gain.setTargetAtTime(level * 0.08, this.ctx.currentTime, 0.1);
  }

  setToneFreq(freq) {
    if (!this.toneNode) return;
    this.toneNode.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
  }

  stopTone() {
    if (this.toneNode) {
      try { this.toneNode.stop(); } catch (e) {}
      this.toneNode = null;
      this.toneGain = null;
    }
  }

  beep(freq = 1000, duration = 0.1) {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.1;
    gain.gain.setTargetAtTime(0, this.ctx.currentTime + duration * 0.7, duration * 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  morseBeep(pattern) {
    if (!this.initialized) return;
    let time = this.ctx.currentTime;
    const dot = 0.08, dash = 0.22, gap = 0.06;
    for (const ch of pattern) {
      const dur = ch === '.' ? dot : ch === '-' ? dash : gap;
      if (ch === '.' || ch === '-') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.setTargetAtTime(0, time + dur * 0.8, 0.01);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + dur);
      }
      time += dur + gap;
    }
  }
}

// ===== STATIC TEXT GENERATOR =====
const STATIC_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function randomStatic(length) {
  let s = '';
  for (let i = 0; i < length; i++) {
    s += STATIC_CHARS[Math.floor(Math.random() * STATIC_CHARS.length)];
  }
  return s;
}

function staticLine(minLen = 40, maxLen = 70) {
  const len = minLen + Math.floor(Math.random() * (maxLen - minLen));
  return randomStatic(len);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== MAIN GAME =====
class Game {
  constructor() {
    this.state = 'BOOT';
    this.audio = new AudioEngine();
    this.currentMission = -1;
    this.completedMissions = [];
    this.capturedText = {};
    this.decodedText = {};
    this.currentFreq = 4000;
    this.signalStrength = 0;
    this.staticInterval = null;
    this.clockInterval = null;
    this.captureTimeout = null;
    this.currentWordIndex = 0;
    this.capturedWords = [];
    this.isMobile = this.detectMobile();
    this.activeInput = null; // tracks which input the CRT keyboard targets
    this.freqRepeatInterval = null;

    // DOM elements
    this.output = document.getElementById('output');
    this.commandInput = document.getElementById('command-input');
    this.captureInput = document.getElementById('capture-input');
    this.freqSlider = document.getElementById('freq-slider');
    this.freqDisplay = document.getElementById('freq-value');
    this.displayMode = document.getElementById('display-mode');
    this.displayStatus = document.getElementById('display-status');
    this.typingArea = document.getElementById('typing-area');
    this.transmissionText = document.getElementById('transmission-text');
    this.captureTimer = document.getElementById('capture-timer');
    this.signalBars = document.querySelectorAll('#signal-bars .bar');
    this.signalLabel = document.getElementById('signal-label');
    this.missionList = document.getElementById('mission-list');
    this.decodeControls = document.getElementById('decode-controls');
    this.cipherSelect = document.getElementById('cipher-select');
    this.shiftSlider = document.getElementById('shift-slider');
    this.shiftValue = document.getElementById('shift-value');
    this.decodePreview = document.getElementById('decode-preview');
    this.caesarControls = document.getElementById('caesar-controls');
    this.crtKeyboard = document.getElementById('crt-keyboard');
    this.wordButtons = document.getElementById('word-buttons');
    this.capturePrompt = document.getElementById('capture-prompt');
    this.freqInputRow = document.getElementById('freq-input-row');
    this.freqTypeInput = document.getElementById('freq-type-input');

    this.setupMobile();
    this.bindEvents();
    this.startClock();
    this.boot();
  }

  detectMobile() {
    return ('ontouchstart' in window) || window.innerWidth <= 900;
  }

  setupMobile() {
    if (this.isMobile) {
      // Prevent native keyboard on command and capture inputs
      this.commandInput.setAttribute('inputmode', 'none');
      this.commandInput.setAttribute('readonly', 'true');
      this.captureInput.setAttribute('inputmode', 'none');
      this.captureInput.setAttribute('readonly', 'true');

      // Prevent zoom on double-tap
      document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) e.preventDefault();
      }, { passive: false });
    }
  }

  bindEvents() {
    // Command input - desktop keyboard
    this.commandInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.commandInput.value.trim().toUpperCase();
        this.commandInput.value = '';
        if (cmd) this.handleCommand(cmd);
      }
    });

    // Tap on inputs to show CRT keyboard on mobile (touchstart for instant response)
    const showKeyboardFor = (input) => {
      return (e) => {
        if (!this.isMobile) return;
        if (e.type === 'touchstart') e.preventDefault();
        this.activeInput = input;
        this.showCRTKeyboard();
      };
    };

    this.commandInput.addEventListener('touchstart', showKeyboardFor(this.commandInput), { passive: false });
    this.commandInput.addEventListener('click', showKeyboardFor(this.commandInput));

    this.captureInput.addEventListener('touchstart', showKeyboardFor(this.captureInput), { passive: false });
    this.captureInput.addEventListener('click', showKeyboardFor(this.captureInput));

    this.freqTypeInput.addEventListener('touchstart', showKeyboardFor(this.freqTypeInput), { passive: false });
    this.freqTypeInput.addEventListener('click', showKeyboardFor(this.freqTypeInput));

    // Frequency slider
    this.freqSlider.addEventListener('input', () => {
      this.currentFreq = parseInt(this.freqSlider.value);
      this.updateFreqDisplay();
      this.updateSignal();
    });

    // Keyboard frequency tuning (desktop)
    document.addEventListener('keydown', (e) => {
      if (document.activeElement === this.captureInput) return;
      if (document.activeElement === this.freqTypeInput) return;
      if (document.activeElement === this.commandInput && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        this.adjustFreq(5);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        this.adjustFreq(-5);
      }
    });

    // Capture input - desktop keyboard
    this.captureInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.submitCapture();
      }
    });

    // Buttons
    document.getElementById('btn-scan').addEventListener('click', () => { this.vibrate(15); this.handleCommand('SCAN'); });
    document.getElementById('btn-lock').addEventListener('click', () => { this.vibrate(15); this.handleCommand('LOCK'); });
    document.getElementById('btn-decode').addEventListener('click', () => { this.vibrate(15); this.handleCommand('DECODE'); });
    document.getElementById('btn-log').addEventListener('click', () => { this.vibrate(15); this.handleCommand('LOG'); });
    document.getElementById('btn-help').addEventListener('click', () => { this.vibrate(15); this.handleCommand('HELP'); });

    // Frequency +/- buttons with touch-repeat
    document.querySelectorAll('.freq-btn').forEach(btn => {
      const delta = parseInt(btn.dataset.delta);

      const startRepeat = (e) => {
        e.preventDefault();
        this.audio.init();
        this.vibrate(10);
        this.adjustFreq(delta);
        this.freqRepeatInterval = setInterval(() => this.adjustFreq(delta), 120);
      };
      const stopRepeat = () => {
        if (this.freqRepeatInterval) {
          clearInterval(this.freqRepeatInterval);
          this.freqRepeatInterval = null;
        }
      };

      btn.addEventListener('mousedown', startRepeat);
      btn.addEventListener('touchstart', startRepeat, { passive: false });
      btn.addEventListener('mouseup', stopRepeat);
      btn.addEventListener('mouseleave', stopRepeat);
      btn.addEventListener('touchend', stopRepeat);
      btn.addEventListener('touchcancel', stopRepeat);
    });

    // Frequency tap-to-type
    this.freqDisplay.addEventListener('click', () => {
      this.freqInputRow.classList.toggle('hidden');
      if (!this.freqInputRow.classList.contains('hidden')) {
        this.freqTypeInput.value = (this.currentFreq / 1000).toFixed(3);
        this.freqTypeInput.focus();
        this.freqTypeInput.select();
      }
    });

    // Frequency type-in submit
    document.getElementById('freq-type-go').addEventListener('click', () => this.submitFreqInput());
    this.freqTypeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.submitFreqInput();
      }
    });

    // Decode controls
    this.shiftSlider.addEventListener('input', () => {
      this.shiftValue.textContent = this.shiftSlider.value;
      this.updateDecodePreview();
    });

    this.cipherSelect.addEventListener('change', () => {
      this.caesarControls.classList.toggle('hidden', this.cipherSelect.value !== 'caesar');
      this.updateDecodePreview();
    });

    document.getElementById('btn-apply-decode').addEventListener('click', () => this.applyDecode());

    // CRT Keyboard
    this.crtKeyboard.addEventListener('touchstart', (e) => {
      const key = e.target.closest('.kb-key');
      if (!key) return;
      e.preventDefault();
      key.classList.add('pressed');
      this.handleCRTKey(key);
    }, { passive: false });

    this.crtKeyboard.addEventListener('touchend', (e) => {
      const key = e.target.closest('.kb-key');
      if (key) key.classList.remove('pressed');
    });

    this.crtKeyboard.addEventListener('mousedown', (e) => {
      const key = e.target.closest('.kb-key');
      if (!key) return;
      e.preventDefault();
      this.handleCRTKey(key);
    });

    // Responsive
    window.addEventListener('resize', () => {
      this.isMobile = this.detectMobile();
    });

    // Orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.isMobile = this.detectMobile();
        this.scrollToActive();
      }, 100);
    });
  }

  // ===== HAPTIC FEEDBACK =====
  vibrate(ms = 10) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  // ===== CRT KEYBOARD =====
  showCRTKeyboard() {
    this.crtKeyboard.classList.remove('hidden');
    setTimeout(() => this.scrollToActive(), 50);
  }

  hideCRTKeyboard() {
    this.crtKeyboard.classList.add('hidden');
    this.activeInput = null;
  }

  handleCRTKey(key) {
    const action = key.dataset.action;
    const char = key.dataset.key;
    const target = this.activeInput;

    if (!target) return;

    this.audio.beep(800, 0.03);
    this.vibrate(10);

    if (action === 'delete') {
      target.value = target.value.slice(0, -1);
    } else if (action === 'space') {
      target.value += ' ';
    } else if (action === 'enter') {
      if (target === this.commandInput) {
        const cmd = target.value.trim().toUpperCase();
        target.value = '';
        this.hideCRTKeyboard();
        if (cmd) this.handleCommand(cmd);
      } else if (target === this.captureInput) {
        this.submitCapture();
      } else if (target === this.freqTypeInput) {
        this.submitFreqInput();
        this.hideCRTKeyboard();
      }
    } else if (action === 'shift') {
      // No-op for now — all input is uppercase
    } else if (char) {
      target.value += char;
    }
  }

  // ===== FREQUENCY =====
  adjustFreq(delta) {
    this.currentFreq = Math.max(3000, Math.min(20000, this.currentFreq + delta));
    this.freqSlider.value = this.currentFreq;
    this.updateFreqDisplay();
    this.updateSignal();
  }

  submitFreqInput() {
    const val = parseFloat(this.freqTypeInput.value);
    if (!isNaN(val) && val >= 3 && val <= 20) {
      this.currentFreq = Math.round(val * 1000);
      this.freqSlider.value = this.currentFreq;
      this.updateFreqDisplay();
      this.updateSignal();
      this.freqInputRow.classList.add('hidden');
      this.audio.init();
      this.audio.beep(600, 0.05);
    }
  }

  startClock() {
    const clockEl = document.getElementById('clock');
    let h = 23, m = 47, s = 12;
    this.clockInterval = setInterval(() => {
      s++;
      if (s >= 60) { s = 0; m++; }
      if (m >= 60) { m = 0; h++; }
      if (h >= 24) h = 0;
      clockEl.textContent = `OCT 16 1962 - ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
  }

  updateFreqDisplay() {
    const mhz = this.currentFreq / 1000;
    this.freqDisplay.textContent = mhz.toFixed(3).padStart(6, '0');
  }

  updateSignal() {
    const nextMission = this.getNextMission();
    if (!nextMission) {
      this.setSignalStrength(0);
      return;
    }

    const targetFreq = nextMission.freq;
    const distance = Math.abs(this.currentFreq - targetFreq);

    let strength = 0;
    if (distance < 200) {
      strength = Math.max(0, 1 - (distance / 200));
    }

    this.signalStrength = strength;
    this.setSignalStrength(strength);

    // Audio
    this.audio.setStaticLevel(1 - strength * 0.7);
    if (strength > 0.1) {
      if (!this.audio.toneNode) this.audio.startTone(800);
      this.audio.setToneLevel(strength);
      this.audio.setToneFreq(600 + strength * 400);
    } else {
      this.audio.stopTone();
    }

    // Enable lock button when signal is strong
    document.getElementById('btn-lock').disabled = strength < 0.85;
  }

  setSignalStrength(strength) {
    const numBars = Math.round(strength * 10);
    this.signalBars.forEach((bar, i) => {
      bar.classList.remove('active', 'strong', 'warn');
      if (i < numBars) {
        bar.classList.add('active');
        if (i >= 8) bar.classList.add('strong');
      }
    });

    if (strength === 0) this.signalLabel.textContent = 'NO SIGNAL';
    else if (strength < 0.3) this.signalLabel.textContent = 'WEAK';
    else if (strength < 0.6) this.signalLabel.textContent = 'MODERATE';
    else if (strength < 0.85) this.signalLabel.textContent = 'STRONG';
    else this.signalLabel.textContent = 'LOCKED';
  }

  getNextMission() {
    const nextId = this.completedMissions.length;
    if (nextId >= MISSIONS.length) return null;
    return MISSIONS[nextId];
  }

  // ===== OUTPUT =====
  clearOutput() {
    this.output.innerHTML = '';
  }

  print(text, className = '', delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'line' + (className ? ' ' + className : '');
        line.textContent = text;
        this.output.appendChild(line);
        this.scrollToBottom();
        resolve();
      }, delay);
    });
  }

  printHTML(html, delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = html;
        this.output.appendChild(line);
        this.scrollToBottom();
        resolve();
      }, delay);
    });
  }

  async typeText(text, className = '', charDelay = 25) {
    const line = document.createElement('div');
    line.className = 'line' + (className ? ' ' + className : '');
    this.output.appendChild(line);

    for (let i = 0; i < text.length; i++) {
      line.textContent += text[i];
      this.scrollToBottom();
      await this.sleep(charDelay);
    }
  }

  scrollToBottom() {
    const content = document.getElementById('display-content');
    content.scrollTop = content.scrollHeight;
  }

  scrollToActive() {
    if (this.isMobile) {
      const el = this.typingArea.classList.contains('hidden') ? this.output : this.typingArea;
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  setMode(mode) {
    this.displayMode.textContent = mode;
  }

  setStatus(status) {
    this.displayStatus.textContent = status;
  }

  updateMissionTracker() {
    this.missionList.innerHTML = '';
    MISSIONS.forEach((m, i) => {
      const item = document.createElement('div');
      item.className = 'mission-item';
      if (this.completedMissions.includes(i)) item.classList.add('completed');
      else if (i === this.completedMissions.length) item.classList.add('active');

      const dot = document.createElement('span');
      dot.className = 'mission-dot';
      item.appendChild(dot);

      const label = document.createElement('span');
      if (this.completedMissions.includes(i) || i === this.completedMissions.length) {
        label.textContent = `${m.freqDisplay} - ${m.title}`;
      } else {
        label.textContent = `???.??? - UNKNOWN`;
      }
      item.appendChild(label);
      this.missionList.appendChild(item);
    });
  }

  // ===== GAME STATES =====
  async boot() {
    this.state = 'BOOT';
    this.setMode('SYSTEM BOOT');
    this.clearOutput();

    const bootLines = [
      '> INITIALIZING SIGINT TERMINAL v3.7.1',
      '> LOADING CRYPTOGRAPHIC MODULES... OK',
      '> CALIBRATING RECEIVER ARRAY... OK',
      '> ESTABLISHING SECURE UPLINK... OK',
      '> FREQUENCY RANGE: 3.000 - 20.000 MHz',
      '> ANTENNA STATUS: NOMINAL',
      '',
      '  ███╗   ██╗██╗ ██████╗ ██╗  ██╗████████╗',
      '  ████╗  ██║██║██╔════╝ ██║  ██║╚══██╔══╝',
      '  ██╔██╗ ██║██║██║  ███╗███████║   ██║   ',
      '  ██║╚██╗██║██║██║   ██║██╔══██║   ██║   ',
      '  ██║ ╚████║██║╚██████╔╝██║  ██║   ██║   ',
      '  ╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ',
      '',
      '  ██╗    ██╗ █████╗ ████████╗ ██████╗██╗  ██╗',
      '  ██║    ██║██╔══██╗╚══██╔══╝██╔════╝██║  ██║',
      '  ██║ █╗ ██║███████║   ██║   ██║     ███████║',
      '  ██║███╗██║██╔══██║   ██║   ██║     ██╔══██║',
      '  ╚███╔███╔╝██║  ██║   ██║   ╚██████╗██║  ██║',
      '   ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝',
      '',
      '  STATION: NIGHTWATCH | WEST BERLIN SECTOR',
      '  OPERATOR TERMINAL ACTIVE',
    ];

    for (const line of bootLines) {
      await this.print(line, line.startsWith('>') ? 'system-text' : 'highlight-text', 60);
    }

    await this.sleep(600);
    await this.print('', '', 0);
    await this.typeText('  [PRESS ENTER OR TAP HERE TO BEGIN]', 'intro-prompt', 30);

    // Wait for any input
    const startHandler = (e) => {
      if (e.type === 'click' || e.type === 'touchstart' || e.key === 'Enter') {
        document.removeEventListener('keydown', startHandler);
        this.output.removeEventListener('click', startHandler);
        this.output.removeEventListener('touchstart', startHandler);
        this.audio.init();
        this.briefing();
      }
    };
    document.addEventListener('keydown', startHandler);
    this.output.addEventListener('click', startHandler);
    this.output.addEventListener('touchstart', startHandler);
  }

  async briefing() {
    this.state = 'BRIEFING';
    this.setMode('BRIEFING');
    this.clearOutput();

    const briefingLines = [
      '╔══════════════════════════════════════════════════╗',
      '║          CLASSIFIED MISSION BRIEFING             ║',
      '║          EYES ONLY - NIGHTWATCH OPS              ║',
      '╚══════════════════════════════════════════════════╝',
      '',
      'DATE: OCTOBER 16, 1962',
      'LOCATION: NSA LISTENING POST, WEST BERLIN',
      'ASSIGNMENT: OVERNIGHT SIGNAL INTERCEPT',
      '',
      'Intelligence has detected unusual radio traffic on',
      'shortwave frequencies tonight. Your orders:',
      '',
      '  1. SCAN frequencies for active transmissions',
      '  2. TUNE your receiver to lock onto signals',
      '  3. CAPTURE transmission content before it fades',
      '  4. DECODE any encrypted messages intercepted',
      '',
      'Use the frequency dial or arrow keys to tune.',
      'Tap the frequency display to type a value directly.',
      'Type SCAN to search for active signals.',
      '',
      'The world is on the brink. What you intercept',
      'tonight could change everything.',
      '',
    ];

    for (const line of briefingLines) {
      const cls = line.startsWith('╔') || line.startsWith('║') || line.startsWith('╚') ? 'highlight-text' :
                  line.startsWith('  ') ? 'system-text' : 'story-text';
      await this.print(line, cls, 40);
    }

    await this.typeText('[TAP SCAN OR TYPE "SCAN" TO BEGIN]', 'intro-prompt', 25);

    this.state = 'IDLE';
    this.setMode('STANDBY');
    this.updateMissionTracker();

    if (!this.isMobile) {
      this.commandInput.focus();
    }

    // Start ambient static
    this.startStaticAnimation();
  }

  startStaticAnimation() {
    if (this.staticInterval) clearInterval(this.staticInterval);
    this.staticInterval = setInterval(() => {
      if (this.state === 'IDLE' || this.state === 'SCANNING') {
        if (Math.random() < 0.3 && this.state === 'SCANNING') {
          const line = document.createElement('div');
          line.className = 'line static-text';
          line.textContent = staticLine(30, 60);
          this.output.appendChild(line);
          this.scrollToBottom();

          const statics = this.output.querySelectorAll('.static-text');
          if (statics.length > 8) {
            statics[0].remove();
          }
        }
      }
    }, 400);
  }

  // ===== COMMANDS =====
  handleCommand(cmd) {
    this.audio.init();
    this.audio.beep(600, 0.05);

    switch (cmd.split(' ')[0]) {
      case 'SCAN':
        this.startScan();
        break;
      case 'LOCK':
        this.lockSignal();
        break;
      case 'DECODE':
        this.openDecode();
        break;
      case 'LOG':
        this.showLog();
        break;
      case 'HELP':
        this.showHelp();
        break;
      case 'TUNE': {
        const freq = parseFloat(cmd.split(' ')[1]);
        if (!isNaN(freq)) {
          this.currentFreq = Math.round(freq * 1000);
          this.freqSlider.value = this.currentFreq;
          this.updateFreqDisplay();
          this.updateSignal();
          this.print(`Tuning to ${freq.toFixed(3)} MHz...`, 'system-text');
        } else {
          this.print('Usage: TUNE <frequency>', 'error-text');
        }
        break;
      }
      default:
        this.print(`Unknown command: ${cmd}. Type HELP for commands.`, 'error-text');
    }
  }

  async startScan() {
    const mission = this.getNextMission();
    if (!mission) {
      this.print('All frequencies clear. No active transmissions detected.', 'system-text');
      return;
    }

    if (this.state === 'INTERCEPTING' || this.state === 'SCANNING') return;

    this.state = 'SCANNING';
    this.setMode('SCANNING');
    this.setStatus('SEARCHING...');
    this.clearOutput();
    this.hideCRTKeyboard();

    await this.print('INITIATING FREQUENCY SCAN...', 'system-text');
    await this.print('', '', 200);

    const scanSteps = 20;
    const startFreq = 3000;
    const endFreq = 20000;

    for (let i = 0; i <= scanSteps; i++) {
      const f = startFreq + (endFreq - startFreq) * (i / scanSteps);
      const mhz = (f / 1000).toFixed(3);
      const isTarget = Math.abs(f - mission.freq) < 500;

      if (isTarget && i > scanSteps * 0.3) {
        this.audio.beep(1200, 0.1);
        await this.print(`  ${mhz.padStart(6, '0')} MHz ████████████ SIGNAL DETECTED`, 'highlight-text', 150);
        await this.sleep(300);
        await this.print('', '', 0);
        await this.print(`╔════════════════════════════════════════╗`, 'highlight-text', 100);
        await this.print(`║  TRANSMISSION DETECTED                 ║`, 'highlight-text', 100);
        await this.print(`║  FREQUENCY: ${mission.freqDisplay} MHz                ║`, 'highlight-text', 100);
        await this.print(`║  SIGNAL: ENCRYPTED                     ║`, 'highlight-text', 100);
        await this.print(`╚════════════════════════════════════════╝`, 'highlight-text', 100);
        await this.sleep(200);
        break;
      } else {
        const noise = '░'.repeat(Math.floor(Math.random() * 8) + 1);
        await this.print(`  ${mhz.padStart(6, '0')} MHz ${noise}`, 'dim-text', 80);
      }
    }

    await this.sleep(300);
    await this.print('', '', 0);
    await this.print(`Mission: ${mission.title}`, 'system-text');
    await this.print(mission.briefing, 'story-text', 100);
    await this.print('', '', 0);
    await this.print(`Tune to ${mission.freqDisplay} MHz and press LOCK when signal is strong.`, 'system-text');

    if (this.isMobile) {
      await this.print(`Tap the frequency display to type it directly, or use +/- buttons.`, 'dim-text');
    } else {
      await this.print(`Use the dial, arrow keys, or type: TUNE ${(mission.freq/1000).toFixed(3)}`, 'dim-text');
    }

    this.state = 'SIGNAL_FOUND';
    this.setStatus(`TARGET: ${mission.freqDisplay} MHz`);
    this.currentMission = mission.id;
  }

  async lockSignal() {
    if (this.signalStrength < 0.85) {
      this.print('Signal too weak to lock. Fine-tune the frequency.', 'error-text');
      return;
    }

    const mission = MISSIONS[this.currentMission];
    if (!mission) return;

    this.state = 'LOCKED';
    this.setMode('SIGNAL LOCKED');
    this.setStatus('PREPARING INTERCEPT');
    this.audio.beep(1000, 0.15);
    await this.sleep(100);
    this.audio.beep(1200, 0.15);

    await this.print('', '', 0);
    await this.print('████ SIGNAL LOCKED ████', 'highlight-text');
    await this.print('Transmission incoming... Prepare to capture.', 'system-text', 300);
    await this.print('', '', 0);

    if (this.isMobile) {
      await this.print('Tap the correct word from the choices shown.', 'system-text', 200);
    } else {
      await this.print('Type each word as it appears. Press ENTER to submit.', 'system-text', 200);
    }
    await this.print('Capture as many words as possible before the signal fades.', 'dim-text', 200);
    await this.sleep(800);

    this.startIntercept(mission);
  }

  async startIntercept(mission) {
    this.state = 'INTERCEPTING';
    this.setMode('INTERCEPTING');
    this.setStatus('LIVE TRANSMISSION');

    // Show typing area
    this.typingArea.classList.remove('hidden');

    // Setup capture state
    const words = mission.cipher === 'none' ? mission.words : mission.encodedWords;
    this.currentWordIndex = 0;
    this.capturedWords = new Array(words.length).fill(null);

    // Mobile: show word buttons, hide text input
    if (this.isMobile) {
      this.capturePrompt.classList.add('hidden');
      this.wordButtons.classList.remove('hidden');
      this.hideCRTKeyboard();
    } else {
      this.capturePrompt.classList.remove('hidden');
      this.wordButtons.classList.add('hidden');
      this.captureInput.focus();
    }

    // Display first word
    this.showTransmissionWord(mission, 0);
  }

  showTransmissionWord(mission, index) {
    const words = mission.cipher === 'none' ? mission.words : mission.encodedWords;

    if (index >= words.length) {
      this.finishIntercept(mission);
      return;
    }

    this.currentWordIndex = index;
    const word = words[index];

    // Build display showing progress
    this.renderTransmissionDisplay(words, index, word);

    if (this.isMobile) {
      // Generate word buttons: correct word + decoys
      this.generateWordButtons(word, words, index);
    } else {
      // Clear text input
      this.captureInput.value = '';
      this.captureInput.placeholder = `Word ${index + 1}/${words.length} — type what you see`;
      this.captureInput.focus();
    }

    // Static flicker effect on current word
    this.wordFlickerInterval = setInterval(() => {
      this.renderTransmissionDisplay(words, index, word);
    }, 200);

    // Timer
    const timeLimit = mission.timePerWord;
    const startTime = Date.now();
    this.captureTimer.innerHTML = '<div class="timer-fill"></div>';
    const timerFill = this.captureTimer.querySelector('.timer-fill');
    timerFill.style.width = '100%';

    this.captureTimerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1 - elapsed / timeLimit);
      timerFill.style.width = (remaining * 100) + '%';

      timerFill.classList.remove('urgent', 'critical');
      if (remaining < 0.2) timerFill.classList.add('critical');
      else if (remaining < 0.4) timerFill.classList.add('urgent');

      if (remaining <= 0) {
        this.skipWord(mission);
      }
    }, 50);

    // Morse beeps for atmosphere
    if (Math.random() < 0.5) {
      this.audio.morseBeep('.-. -.. ..');
    }

    // Auto-scroll on mobile
    setTimeout(() => this.scrollToActive(), 100);
  }

  renderTransmissionDisplay(words, currentIndex, currentWord) {
    let displayHTML = '';
    for (let i = 0; i < words.length; i++) {
      if (i < currentIndex) {
        if (this.capturedWords[i]) {
          displayHTML += `<span class="char-captured">${this.capturedWords[i]}</span> `;
        } else {
          displayHTML += `<span class="char-missed">[????]</span> `;
        }
      } else if (i === currentIndex) {
        let wordDisplay = '';
        for (let c = 0; c < currentWord.length; c++) {
          if (Math.random() < 0.75) {
            wordDisplay += `<span class="char-clear">${currentWord[c]}</span>`;
          } else {
            wordDisplay += `<span class="char-static">${STATIC_CHARS[Math.floor(Math.random() * STATIC_CHARS.length)]}</span>`;
          }
        }
        displayHTML += wordDisplay + ' ';
      } else {
        let sw = '';
        const fl = words[i].length;
        for (let c = 0; c < fl; c++) {
          sw += STATIC_CHARS[Math.floor(Math.random() * STATIC_CHARS.length)];
        }
        displayHTML += `<span class="char-static">${sw}</span> `;
      }
    }
    this.transmissionText.innerHTML = displayHTML;
  }

  generateWordButtons(correctWord, allWords, currentIndex) {
    this.wordButtons.innerHTML = '';

    // Pick 3 decoys: 1 from mission words (different index), 2 from pool
    const decoys = new Set();

    // Add some mission words as decoys (not the current word)
    const missionDecoys = allWords.filter((w, i) => i !== currentIndex && w !== correctWord);
    const shuffledMission = shuffleArray(missionDecoys);
    for (let i = 0; i < Math.min(1, shuffledMission.length); i++) {
      decoys.add(shuffledMission[i]);
    }

    // Add pool decoys of similar length
    const targetLen = correctWord.length;
    const similarPool = DECOY_POOL.filter(w =>
      w !== correctWord &&
      !decoys.has(w) &&
      Math.abs(w.length - targetLen) <= 3
    );
    const shuffledPool = shuffleArray(similarPool);
    for (let i = 0; decoys.size < 3 && i < shuffledPool.length; i++) {
      decoys.add(shuffledPool[i]);
    }

    // If still not enough, add random pool words
    const remainingPool = shuffleArray(DECOY_POOL.filter(w => w !== correctWord && !decoys.has(w)));
    for (let i = 0; decoys.size < 3 && i < remainingPool.length; i++) {
      decoys.add(remainingPool[i]);
    }

    // Combine and shuffle
    const options = shuffleArray([correctWord, ...decoys]);

    options.forEach(word => {
      const btn = document.createElement('button');
      btn.className = 'word-btn';
      btn.textContent = word;
      btn.dataset.word = word;

      const handler = (e) => {
        e.preventDefault();
        this.handleWordButtonTap(word, correctWord, btn);
      };

      btn.addEventListener('touchstart', handler, { passive: false });
      btn.addEventListener('click', handler);
      this.wordButtons.appendChild(btn);
    });
  }

  handleWordButtonTap(tapped, correct, btn) {
    // Prevent double-tap
    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
    this.vibrate(15);

    clearInterval(this.wordFlickerInterval);
    clearInterval(this.captureTimerInterval);

    const mission = MISSIONS[this.currentMission];

    if (tapped === correct) {
      btn.classList.add('correct');
      this.capturedWords[this.currentWordIndex] = tapped;
      this.audio.beep(1000, 0.08);
    } else {
      btn.classList.add('wrong');
      // Highlight correct one
      this.wordButtons.querySelectorAll('.word-btn').forEach(b => {
        if (b.dataset.word === correct) b.classList.add('correct');
      });
      this.capturedWords[this.currentWordIndex] = null;
      this.audio.beep(300, 0.15);
    }

    // Brief pause to show result, then next word
    setTimeout(() => {
      this.showTransmissionWord(mission, this.currentWordIndex + 1);
    }, 400);
  }

  submitCapture() {
    const mission = MISSIONS[this.currentMission];
    if (!mission || this.state !== 'INTERCEPTING') return;

    const words = mission.cipher === 'none' ? mission.words : mission.encodedWords;
    const typed = this.captureInput.value.trim().toUpperCase();
    const expected = words[this.currentWordIndex];

    clearInterval(this.wordFlickerInterval);
    clearInterval(this.captureTimerInterval);

    if (typed === expected) {
      this.capturedWords[this.currentWordIndex] = typed;
      this.audio.beep(1000, 0.08);
    } else if (typed.length > 0 && this.levenshtein(typed, expected) <= Math.max(1, Math.floor(expected.length * 0.3))) {
      // Close enough
      this.capturedWords[this.currentWordIndex] = expected;
      this.audio.beep(800, 0.08);
    } else {
      this.capturedWords[this.currentWordIndex] = null;
      this.audio.beep(300, 0.15);
    }

    this.showTransmissionWord(mission, this.currentWordIndex + 1);
  }

  skipWord(mission) {
    clearInterval(this.wordFlickerInterval);
    clearInterval(this.captureTimerInterval);
    this.capturedWords[this.currentWordIndex] = null;
    this.audio.beep(200, 0.2);
    this.showTransmissionWord(mission, this.currentWordIndex + 1);
  }

  async finishIntercept(mission) {
    clearInterval(this.wordFlickerInterval);
    clearInterval(this.captureTimerInterval);

    this.state = 'REVIEW';
    this.setMode('INTERCEPT COMPLETE');
    this.typingArea.classList.add('hidden');
    this.wordButtons.classList.add('hidden');
    this.capturePrompt.classList.remove('hidden');

    const words = mission.cipher === 'none' ? mission.words : mission.encodedWords;
    const captured = this.capturedWords.filter(w => w !== null).length;
    const total = words.length;
    const pct = Math.round((captured / total) * 100);

    // Stop tone
    this.audio.stopTone();
    this.audio.setStaticLevel(0.5);

    this.clearOutput();
    await this.print('TRANSMISSION ENDED', 'system-text');
    await this.print('', '', 0);
    await this.print(`CAPTURE RESULTS: ${captured}/${total} words (${pct}%)`, pct >= 60 ? 'highlight-text' : 'error-text');
    await this.print('', '', 0);

    // Show captured text
    let capturedText = '';
    for (let i = 0; i < words.length; i++) {
      if (this.capturedWords[i]) {
        capturedText += this.capturedWords[i] + ' ';
      } else {
        capturedText += '[????] ';
      }
    }

    this.capturedText[mission.id] = capturedText.trim();
    await this.print('INTERCEPTED:', 'system-text');
    await this.print(capturedText.trim(), 'highlight-text', 100);
    await this.print('', '', 0);

    if (mission.cipher === 'none') {
      await this.print('Message is in plaintext. No decoding required.', 'system-text');
      this.decodedText[mission.id] = mission.message;
      await this.sleep(500);
      await this.showDebrief(mission);
    } else {
      if (pct < 30) {
        await this.print('WARNING: Capture rate too low. Message may be unrecoverable.', 'error-text');
        await this.print('You can still attempt to DECODE with partial data.', 'dim-text');
      }
      await this.print('Message appears encrypted. Use DECODE to analyze.', 'system-text');
      if (mission.hint) {
        await this.print(`ANALYSIS: ${mission.hint}`, 'system-text', 200);
      }
      document.getElementById('btn-decode').disabled = false;
    }
  }

  openDecode() {
    const mission = MISSIONS[this.currentMission];
    if (!mission || !this.capturedText[mission.id]) {
      this.print('No captured transmission to decode.', 'error-text');
      return;
    }

    this.state = 'DECODING';
    this.setMode('DECODE');
    this.decodeControls.classList.remove('hidden');

    if (mission.cipher === 'caesar') {
      this.cipherSelect.value = 'caesar';
      this.caesarControls.classList.remove('hidden');
    }

    this.updateDecodePreview();

    // Scroll decode controls into view on mobile
    if (this.isMobile) {
      setTimeout(() => {
        this.decodeControls.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  updateDecodePreview() {
    const mission = MISSIONS[this.currentMission];
    if (!mission) return;

    const text = this.capturedText[mission.id] || '';
    const cipherType = this.cipherSelect.value;
    const shift = parseInt(this.shiftSlider.value);

    let decoded;
    if (cipherType === 'caesar') {
      decoded = Cipher.caesarDecrypt(text, shift);
    } else if (cipherType === 'atbash') {
      decoded = Cipher.atbash(text);
    } else {
      decoded = text;
    }

    this.decodePreview.textContent = decoded;
  }

  async applyDecode() {
    const mission = MISSIONS[this.currentMission];
    if (!mission) return;

    const cipherType = this.cipherSelect.value;
    const shift = parseInt(this.shiftSlider.value);

    let isCorrect = false;
    if (mission.cipher === 'caesar' && cipherType === 'caesar' && shift === mission.cipherKey) {
      isCorrect = true;
    } else if (mission.cipher === 'atbash' && cipherType === 'atbash') {
      isCorrect = true;
    }

    if (isCorrect) {
      this.audio.beep(800, 0.1);
      await this.sleep(100);
      this.audio.beep(1000, 0.1);
      await this.sleep(100);
      this.audio.beep(1200, 0.15);

      this.decodeControls.classList.add('hidden');
      this.decodedText[mission.id] = mission.message;

      this.clearOutput();
      await this.print('╔══════════════════════════════════════╗', 'highlight-text');
      await this.print('║     DECRYPTION SUCCESSFUL            ║', 'highlight-text');
      await this.print('╚══════════════════════════════════════╝', 'highlight-text');
      await this.print('', '', 200);
      await this.print('DECODED MESSAGE:', 'system-text');
      await this.print('', '', 0);

      const msgWords = mission.message.split(' ');
      let line = '';
      for (const word of msgWords) {
        line += word + ' ';
        if (word === 'STOP') {
          await this.typeText(line.trim(), 'highlight-text', 35);
          line = '';
          await this.sleep(200);
        }
      }
      if (line.trim()) {
        await this.typeText(line.trim(), 'highlight-text', 35);
      }

      await this.sleep(500);
      await this.showDebrief(mission);
    } else {
      this.audio.beep(300, 0.2);
      this.print('Decryption failed. Message remains garbled. Try different settings.', 'error-text');
    }
  }

  async showDebrief(mission) {
    await this.print('', '', 0);
    await this.print('─'.repeat(45), 'dim-text');
    await this.print('', '', 0);

    if (mission.id === 5) {
      await this.showEnding();
      return;
    }

    if (mission.debrief) {
      await this.print('INTELLIGENCE ASSESSMENT:', 'classified-text', 200);
      await this.print('', '', 0);

      const sentences = mission.debrief.split('. ');
      for (const s of sentences) {
        await this.typeText(s.endsWith('.') ? s : s + '.', 'story-text', 30);
        await this.sleep(300);
      }
    }

    this.completedMissions.push(mission.id);
    this.updateMissionTracker();

    await this.sleep(500);
    await this.print('', '', 0);

    const nextMission = this.getNextMission();
    if (nextMission) {
      await this.print(`Next signal expected on higher frequencies.`, 'system-text');
      await this.print('Press SCAN to search for the next transmission.', 'system-text');
    }

    this.state = 'IDLE';
    this.setMode('STANDBY');
    this.setStatus('');
    document.getElementById('btn-decode').disabled = true;

    if (!this.isMobile) {
      this.commandInput.focus();
    }
  }

  async showEnding() {
    this.state = 'ENDING';
    this.setMode('!!!ALERT!!!');
    this.setStatus('COMPROMISED');

    await this.sleep(1000);

    const endingLines = [
      '',
      '                    ██ ALERT ██',
      '',
      'They know.',
      '',
      'The transmission was about YOU.',
      '',
      '"THE OPERATOR MUST NOT REPORT"',
      '',
      'You look around the darkened station.',
      'The corridor outside is silent.',
      'Too silent for a manned post.',
      '',
      'Where is Commander Harlan?',
      'Where is the night security detail?',
      '',
      'The phone line is dead.',
      'The secure uplink shows DISCONNECTED.',
      '',
      'You are alone.',
      '',
      'But you have the evidence.',
      'Six decoded transmissions.',
      'The identity of CARDINAL.',
      'The extraction plan.',
      'Everything.',
      '',
      'The only question now is:',
      '',
    ];

    for (const line of endingLines) {
      const cls = line.includes('ALERT') ? 'error-text' :
                  line.includes('"') ? 'classified-text' :
                  line === '' ? '' : 'story-text';
      await this.typeText(line, cls, line.includes('ALERT') ? 15 : 35);
      if (line === '') await this.sleep(100);
      else await this.sleep(400);
    }

    await this.sleep(1000);
    await this.typeText('  Do you make it out alive?', 'highlight-text', 50);
    await this.sleep(2000);

    await this.print('', '', 0);
    await this.print('─'.repeat(45), 'dim-text');
    await this.print('', '', 0);
    await this.print('╔══════════════════════════════════════╗', 'highlight-text');
    await this.print('║        NIGHTWATCH - COMPLETE         ║', 'highlight-text');
    await this.print('║                                      ║', 'highlight-text');
    await this.print('║  All transmissions intercepted.      ║', 'highlight-text');
    await this.print('║  The conspiracy is exposed.          ║', 'highlight-text');
    await this.print('║  But the danger is far from over.    ║', 'highlight-text');
    await this.print('║                                      ║', 'highlight-text');
    await this.print('╚══════════════════════════════════════╝', 'highlight-text');
    await this.print('', '', 0);
    await this.print('Type LOG to review all intercepted intelligence.', 'dim-text');

    this.completedMissions.push(5);
    this.updateMissionTracker();
    this.state = 'COMPLETE';
    this.setMode('GAME COMPLETE');
  }

  showLog() {
    this.clearOutput();
    this.print('╔══════════════════════════════════════╗', 'highlight-text');
    this.print('║        INTELLIGENCE LOG              ║', 'highlight-text');
    this.print('╚══════════════════════════════════════╝', 'highlight-text');
    this.print('', '');

    if (this.completedMissions.length === 0) {
      this.print('No intelligence gathered yet.', 'dim-text');
      this.print('Use SCAN to find transmissions.', 'dim-text');
      return;
    }

    for (const id of this.completedMissions) {
      const m = MISSIONS[id];
      this.print(`── ${m.freqDisplay} MHz | ${m.title} ──`, 'system-text');
      if (this.decodedText[id]) {
        this.print(this.decodedText[id], 'highlight-text');
      } else if (this.capturedText[id]) {
        this.print(`[ENCODED] ${this.capturedText[id]}`, 'dim-text');
      }
      this.print('', '');
    }
  }

  showHelp() {
    this.clearOutput();
    this.print('╔══════════════════════════════════════╗', 'highlight-text');
    this.print('║        OPERATOR MANUAL               ║', 'highlight-text');
    this.print('╚══════════════════════════════════════╝', 'highlight-text');
    this.print('', '');
    this.print('COMMANDS:', 'system-text');
    this.print('  SCAN         Search for active signals', '');
    this.print('  TUNE <freq>  Tune to specific frequency', '');
    this.print('               (e.g., TUNE 6.340)', '');
    this.print('  LOCK         Lock onto current signal', '');
    this.print('  DECODE       Open cipher tools', '');
    this.print('  LOG          View intelligence log', '');
    this.print('  HELP         Show this manual', '');
    this.print('', '');
    this.print('CONTROLS:', 'system-text');
    this.print('  Arrow Keys   Fine-tune frequency', '');
    this.print('  +/- Buttons  Adjust frequency step', '');
    this.print('  Tap Freq     Type frequency directly', '');
    this.print('  Freq Slider  Coarse frequency tuning', '');
    this.print('  ENTER        Submit typed word', '');
    this.print('', '');
    this.print('INTERCEPT PROCEDURE:', 'system-text');
    this.print('  1. SCAN for signals', '');
    this.print('  2. Tune to detected frequency', '');
    this.print('  3. LOCK when signal is strong', '');

    if (this.isMobile) {
      this.print('  4. Tap correct words to capture', '');
    } else {
      this.print('  4. Type words as they appear', '');
    }
    this.print('  5. DECODE captured messages', '');
  }

  // ===== UTILITY =====
  levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = Math.min(
          dp[i-1][j] + 1,
          dp[i][j-1] + 1,
          dp[i-1][j-1] + (a[i-1] !== b[j-1] ? 1 : 0)
        );
      }
    }
    return dp[m][n];
  }
}

// ===== PRE-COMPUTE ENCODED WORDS =====
function initMissions() {
  for (const m of MISSIONS) {
    if (m.cipher === 'caesar' && m.cipherKey) {
      m.encoded = Cipher.caesarEncrypt(m.message, m.cipherKey);
      m.encodedWords = m.words.map(w => Cipher.caesarEncrypt(w, m.cipherKey));
    }
  }
}

// ===== LAUNCH =====
window.addEventListener('DOMContentLoaded', () => {
  initMissions();
  window.game = new Game();
});
