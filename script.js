/* ════════════════════════════════════════════════════════
   MultiTools — Vanilla JS
   21 utility tools + search + modal system
   ════════════════════════════════════════════════════════ */

// ──────────────  TOOL DEFINITIONS  ──────────────
const TOOLS = [
  { id: 'age-calculator', emoji: '🎂', title: 'Age Calculator', desc: 'Calculate your exact age in years, months, and days.' },
  { id: 'emi-calculator', emoji: '🏦', title: 'EMI Calculator', desc: 'Compute monthly EMI for any loan amount, rate & tenure.' },
  { id: 'sip-calculator', emoji: '📈', title: 'SIP Calculator', desc: 'Estimate returns on Systematic Investment Plans.' },
  { id: 'qr-code-generator', emoji: '📱', title: 'QR Code Generator', desc: 'Generate QR codes from any text or URL instantly.' },
  { id: 'password-generator', emoji: '🔐', title: 'Password Generator', desc: 'Create strong, customisable random passwords.' },
  { id: 'word-counter', emoji: '📝', title: 'Word Counter', desc: 'Count words, characters, sentences and paragraphs.' },
  { id: 'base64-encoder', emoji: '🔄', title: 'Base64 Encoder / Decoder', desc: 'Encode or decode Base64 strings with one click.' },
  { id: 'color-picker', emoji: '🎨', title: 'Color Picker', desc: 'Pick a color and get HEX, RGB & HSL values.' },
  { id: 'text-to-speech', emoji: '🔊', title: 'Text to Speech', desc: 'Listen to any text spoken aloud by the browser.' },
  { id: 'speech-to-text', emoji: '🎤', title: 'Speech to Text', desc: 'Convert your voice into text using the Web Speech API.' },
  { id: 'json-formatter', emoji: '📋', title: 'JSON Formatter & Validator', desc: 'Pretty-print and validate JSON data.' },
  { id: 'unit-converter', emoji: '📏', title: 'Unit Converter', desc: 'Convert length, weight, temperature and more.' },
  { id: 'bmi-calculator', emoji: '⚖️', title: 'BMI Calculator', desc: 'Calculate Body Mass Index and health category.' },
  { id: 'timer-stopwatch', emoji: '⏱️', title: 'Timer & Stopwatch', desc: 'A fully-featured stopwatch with lap support.' },
  { id: 'percentage-calculator', emoji: '💯', title: 'Percentage Calculator', desc: 'Quickly compute percentages, increases & decreases.' },
  { id: 'random-name-generator', emoji: '🎲', title: 'Random Name Generator', desc: 'Generate random first and last name combos.' },
  { id: 'ai-text-summarizer', emoji: '🤖', title: 'AI Text Summarizer', desc: 'Summarize long text into key sentences instantly.' },
  { id: 'pomodoro-timer', emoji: '🍅', title: 'Pomodoro Study Timer', desc: '25-min focus sessions with 5-min breaks for productivity.' },
  { id: 'image-compressor', emoji: '🗜️', title: 'Image Compressor', desc: 'Compress images in-browser to reduce file size.' },
  { id: 'url-shortener', emoji: '🔗', title: 'URL Shortener', desc: 'Shorten long URLs using is.gd — free & instant.' },
  { id: 'password-strength', emoji: '🛡️', title: 'Password Strength Checker', desc: 'Check how strong your password really is.' },
];

// ──────────────  DOM REFS  ──────────────
const $ = (sel) => document.querySelector(sel);
const toolsGrid = $('#toolsGrid');
const heroSearch = $('#heroSearch');
const noResults = $('#noResults');
const modalOverlay = $('#modalOverlay');
const modal = $('#modal');
const modalTitle = $('#modalTitle');
const modalBody = $('#modalBody');
const modalClose = $('#modalClose');
const hamburger = $('#hamburger');
const navLinks = $('#navLinks');
const toast = $('#toast');
const contactBtn = $('#contactBtn');
const themeToggle = $('#themeToggle');
const themeIcon = $('#themeIcon');

// ──────────────  THEME TOGGLE  ──────────────
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.textContent = '☀️';
  }
}
initTheme();

themeToggle?.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-theme');
  themeIcon.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  showToast(`${isLight ? 'Light' : 'Dark'} theme enabled`);
});

// ──────────────  RENDER TOOL CARDS  ──────────────
function renderCards(filter = '') {
  const term = filter.toLowerCase();
  let visible = 0;
  toolsGrid.innerHTML = '';

  TOOLS.forEach((t) => {
    const match = t.title.toLowerCase().includes(term) || t.desc.toLowerCase().includes(term);
    if (!match) return;
    visible++;
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <span class="tool-emoji">${t.emoji}</span>
      <h3 class="tool-title">${t.title}</h3>
      <p class="tool-desc">${t.desc}</p>
      <button class="btn btn-launch" data-tool="${t.id}">Launch Tool →</button>
    `;
    toolsGrid.appendChild(card);
  });

  noResults.style.display = visible === 0 ? 'block' : 'none';
}
renderCards();

// ──────────────  SEARCH FUNCTIONALITY  ──────────────
heroSearch.addEventListener('input', (e) => renderCards(e.target.value));

// ──────────────  NAVBAR HAMBURGER  ──────────────
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

// close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// active link highlight
const sections = document.querySelectorAll('section[id], header[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ──────────────  MODAL SYSTEM  ──────────────
function openTool(toolId) {
  const tool = TOOLS.find((t) => t.id === toolId);
  if (!tool) return;
  modalTitle.textContent = tool.title;
  modalBody.innerHTML = getToolHTML(toolId);
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  initTool(toolId);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  // stop any running timers
  if (window._swInterval) { clearInterval(window._swInterval); window._swInterval = null; }
  if (window._pomInterval) { clearInterval(window._pomInterval); window._pomInterval = null; }
  if (window._speechSynth) { speechSynthesis.cancel(); }
  if (window._recognition) { window._recognition.stop(); window._recognition = null; }
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// delegate launch buttons
toolsGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-launch');
  if (btn) openTool(btn.dataset.tool);
});

// ──────────────  TOAST  ──────────────
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ──────────────  COPY TO CLIPBOARD  ──────────────
function copyResult(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => showToast('Copied to clipboard!'));
}

// ──────────────  CONTACT FORM  ──────────────
const CONTACT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw0NNCFfjJMUICwVL3_2eZDOBjjVowjLx4ecK3Wogq5e82M1cgS9SeZjg1lfp4SYuXI/exec';

$('#contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!CONTACT_SCRIPT_URL || CONTACT_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL')) {
    showToast('⚠️ Contact URL not configured properly.');
    return;
  }

  const form = e.target;
  const btn = $('#contactBtn');
  const originalBtnText = btn.textContent;

  btn.disabled = true;
  btn.textContent = '⏳ Sending…';

  try {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    // Using fetch with no-cors is best for Google Apps Script to avoid CORS preflight issues
    // We send as a query-string-like body which Apps Script's doPost(e) parses into e.parameter
    await fetch(CONTACT_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    });

    // In no-cors, we can't see the response status, so we assume success if no network error
    showToast('Thanks for your message! 🎉');
    form.reset();
  } catch (error) {
    console.error('Submission error:', error);
    showToast('❌ Error. Check your connection.');
  } finally {
    btn.disabled = false;
    btn.textContent = originalBtnText;
  }
});

// ══════════════════════════════════════════════
//   TOOL HTML GENERATORS
// ══════════════════════════════════════════════

function getToolHTML(id) {
  switch (id) {

    // 1 — Age Calculator
    case 'age-calculator': return `
      <label for="ageDob">Date of Birth</label>
      <input type="date" id="ageDob" />
      <button class="btn btn-primary" onclick="calcAge()">Calculate Age</button>
      <div class="result-box" id="ageResult"><button class="copy-btn" onclick="copyResult('ageResult')">Copy</button></div>`;

    // 2 — EMI Calculator
    case 'emi-calculator': return `
      <label>Loan Amount (₹)</label>
      <input type="number" id="emiAmount" placeholder="e.g. 500000" />
      <label>Annual Interest Rate (%)</label>
      <input type="number" id="emiRate" placeholder="e.g. 8.5" step="0.1" />
      <label>Tenure (months)</label>
      <input type="number" id="emiTenure" placeholder="e.g. 60" />
      <button class="btn btn-primary" onclick="calcEMI()">Calculate EMI</button>
      <div class="result-box" id="emiResult"><button class="copy-btn" onclick="copyResult('emiResult')">Copy</button></div>`;

    // 3 — SIP Calculator
    case 'sip-calculator': return `
      <label>Monthly Investment (₹)</label>
      <input type="number" id="sipAmount" placeholder="e.g. 5000" />
      <label>Expected Annual Return (%)</label>
      <input type="number" id="sipRate" placeholder="e.g. 12" step="0.1" />
      <label>Investment Period (years)</label>
      <input type="number" id="sipYears" placeholder="e.g. 10" />
      <button class="btn btn-primary" onclick="calcSIP()">Calculate Returns</button>
      <div class="result-box" id="sipResult"><button class="copy-btn" onclick="copyResult('sipResult')">Copy</button></div>`;

    // 4 — QR Code Generator
    case 'qr-code-generator': return `
      <label>Text or URL</label>
      <input type="text" id="qrInput" placeholder="https://example.com" />
      <button class="btn btn-primary" onclick="generateQR()">Generate QR Code</button>
      <div id="qrOutput"></div>`;

    // 5 — Password Generator
    case 'password-generator': return `
      <label>Password Length: <strong id="pwLenVal">16</strong></label>
      <input type="range" id="pwLen" min="6" max="64" value="16" oninput="document.getElementById('pwLenVal').textContent=this.value" />
      <div class="checkbox-row"><input type="checkbox" id="pwUpper" checked /><label for="pwUpper">Uppercase (A-Z)</label></div>
      <div class="checkbox-row"><input type="checkbox" id="pwLower" checked /><label for="pwLower">Lowercase (a-z)</label></div>
      <div class="checkbox-row"><input type="checkbox" id="pwDigits" checked /><label for="pwDigits">Digits (0-9)</label></div>
      <div class="checkbox-row"><input type="checkbox" id="pwSymbols" checked /><label for="pwSymbols">Symbols (!@#$…)</label></div>
      <button class="btn btn-primary" onclick="genPassword()">Generate Password</button>
      <div class="result-box" id="pwResult"><button class="copy-btn" onclick="copyResult('pwResult')">Copy</button></div>`;

    // 6 — Word Counter
    case 'word-counter': return `
      <label>Enter or paste text</label>
      <textarea id="wcInput" rows="6" placeholder="Type something…"></textarea>
      <button class="btn btn-primary" onclick="countWords()">Count</button>
      <div class="result-box" id="wcResult"><button class="copy-btn" onclick="copyResult('wcResult')">Copy</button></div>`;

    // 7 — Base64 Encoder / Decoder
    case 'base64-encoder': return `
      <label>Input</label>
      <textarea id="b64Input" rows="4" placeholder="Paste text here…"></textarea>
      <div class="modal-row">
        <button class="btn btn-primary" onclick="b64Encode()">Encode</button>
        <button class="btn btn-secondary" onclick="b64Decode()">Decode</button>
      </div>
      <div class="result-box" id="b64Result"><button class="copy-btn" onclick="copyResult('b64Result')">Copy</button></div>`;

    // 8 — Color Picker
    case 'color-picker': return `
      <label>Pick a Color</label>
      <input type="color" id="cpInput" value="#e74c5a" style="width:100%;height:50px;border:none;cursor:pointer;margin-bottom:16px;border-radius:8px;" />
      <div class="color-preview" id="cpPreview" style="background:#e74c5a;"></div>
      <div class="result-box" id="cpResult"><button class="copy-btn" onclick="copyResult('cpResult')">Copy</button>HEX: #e74c5a
RGB: rgb(231, 76, 90)
HSL: hsl(354, 76%, 60%)</div>`;

    // 9 — Text to Speech
    case 'text-to-speech': return `
      <label>Text to Speak</label>
      <textarea id="ttsInput" rows="4" placeholder="Hello, welcome to MultiTools!"></textarea>
      <label>Voice</label>
      <select id="ttsVoice"></select>
      <div class="modal-row">
        <button class="btn btn-primary" onclick="speakText()">🔊 Speak</button>
        <button class="btn btn-secondary" onclick="speechSynthesis.cancel()">⏹ Stop</button>
      </div>`;

    // 10 — Speech to Text
    case 'speech-to-text': return `
      <p style="color:var(--text-muted);font-size:.9rem;margin-bottom:16px;">Click the button and start speaking. Requires browser permission.</p>
      <button class="btn btn-primary" id="sttBtn" onclick="toggleSTT()">🎤 Start Listening</button>
      <div class="result-box" id="sttResult"><button class="copy-btn" onclick="copyResult('sttResult')">Copy</button></div>`;

    // 11 — JSON Formatter
    case 'json-formatter': return `
      <label>Paste JSON</label>
      <textarea id="jsonInput" rows="6" placeholder='{"key": "value"}'></textarea>
      <div class="modal-row">
        <button class="btn btn-primary" onclick="formatJSON()">Format</button>
        <button class="btn btn-secondary" onclick="minifyJSON()">Minify</button>
      </div>
      <div class="result-box" id="jsonResult"><button class="copy-btn" onclick="copyResult('jsonResult')">Copy</button></div>`;

    // 12 — Unit Converter
    case 'unit-converter': return `
      <label>Category</label>
      <select id="ucCat" onchange="updateUnits()">
        <option value="length">Length</option>
        <option value="weight">Weight</option>
        <option value="temperature">Temperature</option>
      </select>
      <div class="modal-row">
        <div><label>From</label><select id="ucFrom"></select></div>
        <div><label>To</label><select id="ucTo"></select></div>
      </div>
      <label>Value</label>
      <input type="number" id="ucVal" placeholder="Enter value" />
      <button class="btn btn-primary" onclick="convertUnit()">Convert</button>
      <div class="result-box" id="ucResult"><button class="copy-btn" onclick="copyResult('ucResult')">Copy</button></div>`;

    // 13 — BMI Calculator
    case 'bmi-calculator': return `
      <label>Weight (kg)</label>
      <input type="number" id="bmiWeight" placeholder="e.g. 70" />
      <label>Height (cm)</label>
      <input type="number" id="bmiHeight" placeholder="e.g. 175" />
      <button class="btn btn-primary" onclick="calcBMI()">Calculate BMI</button>
      <div class="result-box" id="bmiResult"><button class="copy-btn" onclick="copyResult('bmiResult')">Copy</button></div>`;

    // 14 — Timer & Stopwatch
    case 'timer-stopwatch': return `
      <div class="stopwatch-display" id="swDisplay">00:00:00.000</div>
      <div class="sw-btns">
        <button class="btn btn-primary" id="swStartBtn" onclick="swStart()">▶ Start</button>
        <button class="btn btn-secondary" onclick="swReset()">↺ Reset</button>
      </div>
      <div class="result-box" id="swLaps" style="max-height:180px;overflow-y:auto;"></div>`;

    // 15 — Percentage Calculator
    case 'percentage-calculator': return `
      <label>What is</label>
      <div class="modal-row">
        <input type="number" id="pcVal" placeholder="e.g. 25" />
        <span style="display:flex;align-items:center;font-size:1.4rem;color:var(--text-muted)">%</span>
        <span style="display:flex;align-items:center;color:var(--text-muted)">of</span>
        <input type="number" id="pcOf" placeholder="e.g. 200" />
      </div>
      <button class="btn btn-primary" onclick="calcPercent()">Calculate</button>
      <div class="result-box" id="pcResult"><button class="copy-btn" onclick="copyResult('pcResult')">Copy</button></div>`;

    // 16 — Random Name Generator
    case 'random-name-generator': return `
      <label>Number of Names</label>
      <input type="number" id="rnCount" value="5" min="1" max="50" />
      <label>Gender</label>
      <select id="rnGender">
        <option value="any">Any</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <button class="btn btn-primary" onclick="genNames()">Generate Names</button>
      <div class="result-box" id="rnResult"><button class="copy-btn" onclick="copyResult('rnResult')">Copy</button></div>`;

    // 17 — AI Text Summarizer
    case 'ai-text-summarizer': return `
      <label>Paste your text</label>
      <textarea id="aiInput" rows="7" placeholder="Paste a long article, essay, or paragraph here…"></textarea>
      <label>Number of sentences</label>
      <input type="number" id="aiSentences" value="3" min="1" max="20" />
      <button class="btn btn-primary" onclick="summarizeText()">Summarize</button>
      <div class="result-box" id="aiResult"><button class="copy-btn" onclick="copyResult('aiResult')">Copy</button></div>`;

    // 18 — Pomodoro Study Timer
    case 'pomodoro-timer': return `
      <div class="stopwatch-display" id="pomDisplay">25:00</div>
      <p style="text-align:center;color:var(--text-muted);margin-bottom:16px;" id="pomPhase">🍅 Focus Session</p>
      <div class="sw-btns">
        <button class="btn btn-primary" id="pomStartBtn" onclick="pomToggle()">▶ Start</button>
        <button class="btn btn-secondary" onclick="pomReset()">↺ Reset</button>
      </div>
      <div class="modal-row" style="margin-top:16px;">
        <div><label>Focus (min)</label><input type="number" id="pomFocus" value="25" min="1" max="120" /></div>
        <div><label>Break (min)</label><input type="number" id="pomBreak" value="5" min="1" max="30" /></div>
      </div>
      <div class="result-box" id="pomResult"></div>`;

    // 19 — Image Compressor
    case 'image-compressor': return `
      <label>Select Image</label>
      <input type="file" id="imgFile" accept="image/*" style="margin-bottom:16px;" />
      <label>Quality: <strong id="imgQVal">70</strong>%</label>
      <input type="range" id="imgQuality" min="10" max="100" value="70" oninput="document.getElementById('imgQVal').textContent=this.value" />
      <button class="btn btn-primary" onclick="compressImage()">Compress</button>
      <div class="result-box" id="imgResult"></div>
      <canvas id="imgCanvas" style="display:none;"></canvas>`;

    // 20 — URL Shortener
    case 'url-shortener': return `
      <label>Long URL</label>
      <input type="text" id="urlInput" placeholder="https://example.com/very/long/path" />
      <button class="btn btn-primary" onclick="shortenURL()">Shorten URL</button>
      <div class="result-box" id="urlResult"><button class="copy-btn" onclick="copyResult('urlResult')">Copy</button></div>`;

    // 21 — Password Strength Checker
    case 'password-strength': return `
      <label>Enter password to check</label>
      <input type="text" id="psInput" placeholder="Type a password…" oninput="checkPasswordStrength()" />
      <div class="strength-bar-container" style="height:8px;background:var(--surface);border-radius:4px;margin-bottom:16px;overflow:hidden;"><div id="psBar" style="height:100%;width:0%;border-radius:4px;transition:width .3s,background .3s;"></div></div>
      <div class="result-box" id="psResult"><button class="copy-btn" onclick="copyResult('psResult')">Copy</button></div>`;

    default: return '<p>Tool not found.</p>';
  }
}

// ══════════════════════════════════════════════
//   TOOL INITIALISERS (post-render hooks)
// ══════════════════════════════════════════════

function initTool(id) {
  if (id === 'color-picker') initColorPicker();
  if (id === 'text-to-speech') loadVoices();
  if (id === 'unit-converter') updateUnits();
  if (id === 'pomodoro-timer') pomReset();
}

// ══════════════════════════════════════════════
//   TOOL LOGIC
// ══════════════════════════════════════════════

// ── 1. Age Calculator ──
function calcAge() {
  const dob = new Date($('#ageDob').value);
  if (isNaN(dob)) return showToast('Please select a valid date.');
  const now = new Date();
  if (dob > now) return showToast('Date of birth cannot be in the future.');

  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }

  const totalDays = Math.floor((now - dob) / 86400000);

  setResult('ageResult', `🎂  ${years} years, ${months} months, ${days} days\n📅  Total: ${totalDays.toLocaleString()} days`);
}

// ── 2. EMI Calculator ──
function calcEMI() {
  const P = +$('#emiAmount').value;
  const annualRate = +$('#emiRate').value;
  const N = +$('#emiTenure').value;
  if (!P || !annualRate || !N) return showToast('Please fill all fields.');

  const r = annualRate / 12 / 100;
  const emi = P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
  const totalPayment = emi * N;
  const totalInterest = totalPayment - P;

  setResult('emiResult', `📌 Monthly EMI: ₹${emi.toFixed(2)}\n💰 Total Payment: ₹${totalPayment.toFixed(2)}\n📊 Total Interest: ₹${totalInterest.toFixed(2)}`);
}

// ── 3. SIP Calculator ──
function calcSIP() {
  const P = +$('#sipAmount').value;
  const annualRate = +$('#sipRate').value;
  const years = +$('#sipYears').value;
  if (!P || !annualRate || !years) return showToast('Please fill all fields.');

  const n = years * 12;
  const r = annualRate / 12 / 100;
  const fv = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = P * n;

  setResult('sipResult', `💵 Invested: ₹${invested.toLocaleString()}\n📈 Est. Returns: ₹${(fv - invested).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n🏦 Total Value: ₹${fv.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
}

// ── 4. QR Code Generator ──
function generateQR() {
  const text = $('#qrInput').value.trim();
  if (!text) return showToast('Please enter text or a URL.');
  const container = $('#qrOutput');
  container.innerHTML = '';
  new QRCode(container, { text, width: 200, height: 200, colorDark: '#ffffff', colorLight: '#131b2e' });
}

// ── 5. Password Generator ──
function genPassword() {
  const len = +$('#pwLen').value;
  const upper = $('#pwUpper').checked;
  const lower = $('#pwLower').checked;
  const digits = $('#pwDigits').checked;
  const symbols = $('#pwSymbols').checked;

  let chars = '';
  if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (digits) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) return showToast('Select at least one character type.');

  let pw = '';
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) pw += chars[arr[i] % chars.length];

  setResult('pwResult', pw);
}

// ── 6. Word Counter ──
function countWords() {
  const text = $('#wcInput').value;
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\n+/).filter(Boolean).length : 0;

  setResult('wcResult', `📝 Words: ${words}\n🔤 Characters: ${chars}\n🔡 Characters (no spaces): ${charsNoSpace}\n📄 Sentences: ${sentences}\n📃 Paragraphs: ${paragraphs}`);
}

// ── 7. Base64 Encode / Decode ──
function b64Encode() {
  const input = $('#b64Input').value;
  if (!input) return showToast('Enter some text first.');
  try { setResult('b64Result', btoa(unescape(encodeURIComponent(input)))); }
  catch { showToast('Encoding failed.'); }
}
function b64Decode() {
  const input = $('#b64Input').value;
  if (!input) return showToast('Enter a Base64 string first.');
  try { setResult('b64Result', decodeURIComponent(escape(atob(input)))); }
  catch { setResult('b64Result', '❌ Invalid Base64 string.'); }
}

// ── 8. Color Picker ──
function initColorPicker() {
  const input = $('#cpInput');
  input.addEventListener('input', () => {
    const hex = input.value;
    $('#cpPreview').style.background = hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const [h, s, l] = rgbToHsl(r, g, b);
    setResult('cpResult', `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${h}, ${s}%, ${l}%)`);
  });
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// ── 9. Text to Speech ──
function loadVoices() {
  const sel = $('#ttsVoice');
  function populate() {
    const voices = speechSynthesis.getVoices();
    sel.innerHTML = '';
    voices.forEach((v, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${v.name} (${v.lang})`;
      sel.appendChild(opt);
    });
  }
  populate();
  speechSynthesis.onvoiceschanged = populate;
}
function speakText() {
  const text = $('#ttsInput').value.trim();
  if (!text) return showToast('Enter some text first.');
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  const idx = +$('#ttsVoice').value;
  if (voices[idx]) utter.voice = voices[idx];
  window._speechSynth = utter;
  speechSynthesis.speak(utter);
}

// ── 10. Speech to Text ──
function toggleSTT() {
  if (window._recognition) {
    window._recognition.stop();
    window._recognition = null;
    $('#sttBtn').textContent = '🎤 Start Listening';
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return showToast('Speech recognition not supported in this browser.');
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  let finalTranscript = '';
  recognition.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) finalTranscript += e.results[i][0].transcript + ' ';
      else interim += e.results[i][0].transcript;
    }
    setResult('sttResult', finalTranscript + interim);
  };
  recognition.onerror = (e) => showToast('Speech error: ' + e.error);
  recognition.onend = () => { $('#sttBtn').textContent = '🎤 Start Listening'; window._recognition = null; };
  recognition.start();
  window._recognition = recognition;
  $('#sttBtn').textContent = '⏹ Stop Listening';
}

// ── 11. JSON Formatter ──
function formatJSON() {
  const raw = $('#jsonInput').value.trim();
  if (!raw) return showToast('Paste some JSON first.');
  try { setResult('jsonResult', JSON.stringify(JSON.parse(raw), null, 2)); }
  catch (err) { setResult('jsonResult', '❌ Invalid JSON:\n' + err.message); }
}
function minifyJSON() {
  const raw = $('#jsonInput').value.trim();
  if (!raw) return showToast('Paste some JSON first.');
  try { setResult('jsonResult', JSON.stringify(JSON.parse(raw))); }
  catch (err) { setResult('jsonResult', '❌ Invalid JSON:\n' + err.message); }
}

// ── 12. Unit Converter ──
const UNITS = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000 },
  temperature: ['°C', '°F', 'K'],
};
function updateUnits() {
  const cat = $('#ucCat').value;
  const from = $('#ucFrom');
  const to = $('#ucTo');
  from.innerHTML = '';
  to.innerHTML = '';
  const opts = cat === 'temperature' ? UNITS.temperature : Object.keys(UNITS[cat]);
  opts.forEach((u) => {
    from.innerHTML += `<option value="${u}">${u}</option>`;
    to.innerHTML += `<option value="${u}">${u}</option>`;
  });
  if (opts.length > 1) to.selectedIndex = 1;
}
function convertUnit() {
  const cat = $('#ucCat').value;
  const fromU = $('#ucFrom').value;
  const toU = $('#ucTo').value;
  const val = +$('#ucVal').value;
  if (isNaN(val)) return showToast('Enter a valid number.');

  let result;
  if (cat === 'temperature') {
    result = convertTemp(val, fromU, toU);
  } else {
    const base = val * UNITS[cat][fromU];
    result = base / UNITS[cat][toU];
  }
  setResult('ucResult', `${val} ${fromU}  =  ${parseFloat(result.toFixed(8))} ${toU}`);
}
function convertTemp(v, from, to) {
  // to Celsius first
  let c;
  if (from === '°C') c = v;
  else if (from === '°F') c = (v - 32) * 5 / 9;
  else c = v - 273.15;
  // from Celsius
  if (to === '°C') return c;
  if (to === '°F') return c * 9 / 5 + 32;
  return c + 273.15;
}

// ── 13. BMI Calculator ──
function calcBMI() {
  const w = +$('#bmiWeight').value;
  const h = +$('#bmiHeight').value;
  if (!w || !h) return showToast('Fill in both weight and height.');
  const bmi = w / ((h / 100) ** 2);
  let cat = '';
  if (bmi < 18.5) cat = 'Underweight';
  else if (bmi < 25) cat = 'Normal weight ✅';
  else if (bmi < 30) cat = 'Overweight';
  else cat = 'Obese';
  setResult('bmiResult', `⚖️ BMI: ${bmi.toFixed(1)}\n📋 Category: ${cat}`);
}

// ── 14. Timer & Stopwatch ──
let swRunning = false, swStart_ms = 0, swElapsed = 0, swLapCount = 0;
function swStart() {
  const btn = $('#swStartBtn');
  if (!swRunning) {
    swRunning = true;
    swStart_ms = Date.now() - swElapsed;
    btn.textContent = '⏸ Pause';
    window._swInterval = setInterval(swTick, 31);
  } else {
    swRunning = false;
    swElapsed = Date.now() - swStart_ms;
    clearInterval(window._swInterval);
    btn.textContent = '▶ Resume';
  }
}
function swTick() {
  swElapsed = Date.now() - swStart_ms;
  $('#swDisplay').textContent = fmtTime(swElapsed);
}
function swReset() {
  swRunning = false;
  swElapsed = 0;
  swLapCount = 0;
  if (window._swInterval) clearInterval(window._swInterval);
  $('#swDisplay').textContent = '00:00:00.000';
  $('#swStartBtn').textContent = '▶ Start';
  const laps = $('#swLaps');
  if (laps) laps.textContent = '';
}
function fmtTime(ms) {
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const mil = String(ms % 1000).padStart(3, '0');
  return `${h}:${m}:${s}.${mil}`;
}

// ── 15. Percentage Calculator ──
function calcPercent() {
  const val = +$('#pcVal').value;
  const of_ = +$('#pcOf').value;
  if (isNaN(val) || isNaN(of_)) return showToast('Enter valid numbers.');
  setResult('pcResult', `${val}% of ${of_} = ${(val / 100 * of_).toFixed(4)}`);
}

// ── 16. Random Name Generator ──
const FIRST_M = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen'];
const FIRST_F = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Dorothy', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Kathleen', 'Amy', 'Angela', 'Shirley'];
const LAST = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson'];

function genNames() {
  const count = Math.min(Math.max(+$('#rnCount').value || 5, 1), 50);
  const gender = $('#rnGender').value;
  let pool;
  if (gender === 'male') pool = FIRST_M;
  else if (gender === 'female') pool = FIRST_F;
  else pool = [...FIRST_M, ...FIRST_F];

  const names = [];
  for (let i = 0; i < count; i++) {
    const first = pool[Math.floor(Math.random() * pool.length)];
    const last = LAST[Math.floor(Math.random() * LAST.length)];
    names.push(`${i + 1}. ${first} ${last}`);
  }
  setResult('rnResult', names.join('\n'));
}

// ── 17. AI Text Summarizer (extractive) ──
function summarizeText() {
  const text = $('#aiInput').value.trim();
  const numSentences = Math.max(1, +$('#aiSentences').value || 3);
  if (!text) return showToast('Paste some text first.');

  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length === 0) return setResult('aiResult', text);

  // Score sentences by word frequency
  const wordFreq = {};
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
  words.forEach(w => wordFreq[w] = (wordFreq[w] || 0) + 1);

  const scored = sentences.map((s, i) => {
    const sWords = s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    const score = sWords.reduce((sum, w) => sum + (wordFreq[w] || 0), 0) / (sWords.length || 1);
    return { text: s.trim(), score, index: i };
  });

  // Pick top N by score, then re-order by original position
  const top = scored.sort((a, b) => b.score - a.score).slice(0, numSentences);
  top.sort((a, b) => a.index - b.index);

  setResult('aiResult', `📝 Summary (${top.length} sentences):\n\n${top.map(s => s.text).join(' ')}`);
}

// ── 18. Pomodoro Study Timer ──
let pomRunning = false, pomSeconds = 0, pomTotal = 25 * 60, pomOnBreak = false, pomCycles = 0;

function pomToggle() {
  const btn = $('#pomStartBtn');
  if (!pomRunning) {
    pomRunning = true;
    btn.textContent = '⏸ Pause';
    window._pomInterval = setInterval(pomTick, 1000);
  } else {
    pomRunning = false;
    clearInterval(window._pomInterval);
    btn.textContent = '▶ Resume';
  }
}

function pomTick() {
  pomSeconds++;
  const remaining = pomTotal - pomSeconds;
  if (remaining <= 0) {
    clearInterval(window._pomInterval);
    pomRunning = false;
    if (!pomOnBreak) {
      pomCycles++;
      pomOnBreak = true;
      pomTotal = (+($('#pomBreak')?.value) || 5) * 60;
      pomSeconds = 0;
      $('#pomPhase').textContent = '☕ Break Time!';
      $('#pomDisplay').textContent = fmtPom(pomTotal);
      setResult('pomResult', `✅ Focus session #${pomCycles} complete! Take a break.`);
    } else {
      pomOnBreak = false;
      pomTotal = (+($('#pomFocus')?.value) || 25) * 60;
      pomSeconds = 0;
      $('#pomPhase').textContent = '🍅 Focus Session';
      $('#pomDisplay').textContent = fmtPom(pomTotal);
      setResult('pomResult', `Break over! Starting focus session #${pomCycles + 1}.`);
    }
    $('#pomStartBtn').textContent = '▶ Start';
    showToast(pomOnBreak ? 'Time for a break! ☕' : 'Back to focus! 🍅');
    return;
  }
  const display = $('#pomDisplay');
  if (display) display.textContent = fmtPom(remaining);
}

function pomReset() {
  pomRunning = false;
  pomOnBreak = false;
  pomSeconds = 0;
  pomCycles = 0;
  if (window._pomInterval) clearInterval(window._pomInterval);
  pomTotal = (+($('#pomFocus')?.value) || 25) * 60;
  const d = $('#pomDisplay');
  if (d) d.textContent = fmtPom(pomTotal);
  const p = $('#pomPhase');
  if (p) p.textContent = '🍅 Focus Session';
  const b = $('#pomStartBtn');
  if (b) b.textContent = '▶ Start';
  const r = $('#pomResult');
  if (r) r.textContent = '';
}

function fmtPom(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// ── 19. Image Compressor ──
function compressImage() {
  const fileInput = $('#imgFile');
  if (!fileInput.files.length) return showToast('Select an image first.');

  const file = fileInput.files[0];
  const quality = (+$('#imgQuality').value) / 100;
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = $('#imgCanvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        const origSize = (file.size / 1024).toFixed(1);
        const newSize = (blob.size / 1024).toFixed(1);
        const savings = (100 - (blob.size / file.size) * 100).toFixed(1);

        // create download link
        const url = URL.createObjectURL(blob);
        setResult('imgResult',
          `📁 Original: ${origSize} KB\n🗜️ Compressed: ${newSize} KB\n💾 Saved: ${savings}%`);

        // add download button
        const dlBtn = document.createElement('a');
        dlBtn.href = url;
        dlBtn.download = 'compressed_' + file.name.replace(/\.[^.]+$/, '.jpg');
        dlBtn.className = 'btn btn-primary';
        dlBtn.textContent = '⬇ Download';
        dlBtn.style.marginTop = '12px';
        dlBtn.style.display = 'inline-flex';
        $('#imgResult').appendChild(dlBtn);
      }, 'image/jpeg', quality);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ── 20. URL Shortener (via is.gd) ──
async function shortenURL() {
  const url = $('#urlInput').value.trim();
  if (!url) return showToast('Enter a URL first.');
  if (!/^https?:\/\/.+/i.test(url)) return showToast('Please enter a valid URL starting with http(s)://');

  setResult('urlResult', '⏳ Shortening…');
  try {
    const resp = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
    const data = await resp.json();
    if (data.shorturl) {
      setResult('urlResult', data.shorturl);
    } else {
      setResult('urlResult', '❌ ' + (data.errormessage || 'Could not shorten URL.'));
    }
  } catch {
    setResult('urlResult', '❌ Network error. Check your connection.');
  }
}

// ── 21. Password Strength Checker ──
function checkPasswordStrength() {
  const pw = $('#psInput').value;
  const bar = $('#psBar');
  if (!pw) {
    bar.style.width = '0%';
    setResult('psResult', '');
    return;
  }

  let score = 0;
  const checks = [];

  // length
  if (pw.length >= 8) { score += 1; checks.push('✅ At least 8 characters'); }
  else checks.push('❌ Less than 8 characters');
  if (pw.length >= 12) { score += 1; checks.push('✅ 12+ characters (great!)'); }
  if (pw.length >= 16) score += 1;

  // character variety
  if (/[a-z]/.test(pw)) { score += 1; checks.push('✅ Lowercase letters'); } else checks.push('❌ No lowercase letters');
  if (/[A-Z]/.test(pw)) { score += 1; checks.push('✅ Uppercase letters'); } else checks.push('❌ No uppercase letters');
  if (/[0-9]/.test(pw)) { score += 1; checks.push('✅ Numbers'); } else checks.push('❌ No numbers');
  if (/[^a-zA-Z0-9]/.test(pw)) { score += 1; checks.push('✅ Special characters'); } else checks.push('❌ No special characters');

  // common patterns (penalty)
  if (/^(123|password|qwerty|abc|111|000)/i.test(pw)) { score = Math.max(0, score - 2); checks.push('⚠️ Common pattern detected'); }
  if (/(.)(\1{2,})/.test(pw)) { score = Math.max(0, score - 1); checks.push('⚠️ Repeated characters'); }

  // entropy estimate
  let poolSize = 0;
  if (/[a-z]/.test(pw)) poolSize += 26;
  if (/[A-Z]/.test(pw)) poolSize += 26;
  if (/[0-9]/.test(pw)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) poolSize += 32;
  const entropy = Math.round(pw.length * Math.log2(poolSize || 1));

  const maxScore = 7;
  const pct = Math.min(100, (score / maxScore) * 100);
  let label, color;
  if (pct <= 25) { label = '🔴 Very Weak'; color = '#ef4444'; }
  else if (pct <= 45) { label = '🟠 Weak'; color = '#f97316'; }
  else if (pct <= 65) { label = '🟡 Fair'; color = '#eab308'; }
  else if (pct <= 85) { label = '🟢 Strong'; color = '#22c55e'; }
  else { label = '🟢 Very Strong'; color = '#10b981'; }

  bar.style.width = pct + '%';
  bar.style.background = color;

  setResult('psResult', `Strength: ${label}\nEntropy: ~${entropy} bits\n\n${checks.join('\n')}`);
}

// ══════════════════════════════════════════════
//   HELPERS
// ══════════════════════════════════════════════

/** Set text content of a result box while preserving the copy button */
function setResult(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  // keep copy button
  const copyBtn = el.querySelector('.copy-btn');
  el.textContent = text;
  if (copyBtn) el.prepend(copyBtn);
  el.style.display = 'block';
}

// expose openTool globally (used in footer links)
window.openTool = openTool;
