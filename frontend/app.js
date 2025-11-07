// ========================== CONFIG ==========================
const API_BASE = 'https://virtual-lab-kebangsaan.vercel.app/api'; // Ganti sesuai URL backend-mu

document.addEventListener('DOMContentLoaded', init);

// ========================== STATE ==========================
const state = {
  questions: [],
  current: 0,
  answers: {},
  total: 0
};

// ========================== INIT ==========================
function init() {
  // sembunyikan splash
  setTimeout(() => document.getElementById('splash').classList.add('hidden'), 1200);
  document.getElementById('year').innerText = new Date().getFullYear();

  // navigasi
  document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', navClick));
  document.getElementById('start-quiz').addEventListener('click', () => showPage('quiz'));

  // kontrol quiz
  document.getElementById('next').addEventListener('click', nextQ);
  document.getElementById('prev').addEventListener('click', prevQ);
  document.getElementById('submit-quiz').addEventListener('click', submitQuiz);
  document.getElementById('retake').addEventListener('click', retake);

  // halaman latihan
  document.getElementById('btn-practice').addEventListener('click', () => showPage('practice'));

  // ambil data soal dari server
  fetchQuestions();

  // siapkan halaman latihan
  setupPractice();
}

// ========================== NAVIGASI ==========================
function navClick(e) {
  const id = e.target.id;
  if (id === 'btn-home') showPage('home');
  if (id === 'btn-about') showPage('about');
  if (id === 'btn-quiz') showPage('quiz');
  if (id === 'btn-practice') showPage('practice');
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => {
    p.hidden = true;
    p.classList.remove('active');
  });
  const page = document.getElementById(name);
  page.hidden = false;
  page.classList.add('active');

  if (name === 'practice') setupPractice();
}

// ========================== FETCH API ==========================
async function fetchQuestions() {
  try {
    const res = await fetch(`${API_BASE}/questions`, { method: 'GET' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // pastikan formatnya benar
    if (!data.questions || !Array.isArray(data.questions))
      throw new Error('Format response tidak sesuai');

    state.questions = data.questions;
    state.total = state.questions.length;
    document.getElementById('q-total').innerText = state.total;

    renderQuestion();
  } catch (err) {
    console.error('Gagal memuat soal:', err);
    document.getElementById('question').innerText =
      'Tidak dapat memuat soal. Pastikan server API berjalan dan mengizinkan CORS.';
  }
}

async function sendScore(scoreData) {
  try {
    const res = await fetch(`${API_BASE}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('Skor berhasil dikirim:', data);
  } catch (e) {
    console.warn('Tidak dapat mengirim skor ke server:', e.message);
  }
}

// ========================== QUIZ ==========================
function renderQuestion() {
  const idx = state.current;
  const q = state.questions[idx];
  if (!q) {
    document.getElementById('question').innerText = 'Tidak ada soal.';
    return;
  }

  document.getElementById('q-index').innerText = idx + 1;
  document.getElementById('question').innerText = q.question;

  const choices = document.getElementById('choices');
  choices.innerHTML = '';

  q.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.dataset.choice = i;
    btn.innerText = c;
    btn.addEventListener('click', () => selectAnswer(idx, i, btn));
    if (state.answers[idx] === i) btn.classList.add('selected');
    choices.appendChild(btn);
  });

  toggleControls();
}

function selectAnswer(qIdx, choiceIdx, el) {
  state.answers[qIdx] = choiceIdx;
  document.querySelectorAll('.choice').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function nextQ() {
  if (state.current < state.total - 1) {
    state.current++;
    renderQuestion();
  }
  toggleControls();
}

function prevQ() {
  if (state.current > 0) {
    state.current--;
    renderQuestion();
  }
  toggleControls();
}

function toggleControls() {
  document.getElementById('prev').disabled = (state.current === 0);
  document.getElementById('next').disabled = (state.current === state.total - 1);
  const submit = document.getElementById('submit-quiz');
  submit.classList.toggle('hidden', state.current !== state.total - 1);
}

async function submitQuiz() {
  const total = state.total;
  let correct = 0;
  const answers = [];

  state.questions.forEach((q, i) => {
    const chosen = state.answers[i];
    answers.push({ id: q.id, chosen });
    if (typeof chosen !== 'undefined' && q.answer === chosen) correct++;
  });

  const pct = Math.round((correct / total) * 100);

  // tampilkan hasil
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('score-summary').innerHTML =
    `<p>Skor: <strong>${correct}/${total}</strong> (${pct}%)</p>`;
  drawChart(pct);

  // kirim ke API
  await sendScore({
    score: pct,
    correct,
    total,
    answers,
    timestamp: new Date().toISOString()
  });
}

function retake() {
  state.answers = {};
  state.current = 0;
  document.getElementById('result').classList.add('hidden');
  renderQuestion();
}

function drawChart(pct) {
  const canvas = document.getElementById('score-chart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const w = canvas.width, h = canvas.height;
  ctx.lineWidth = 18;
  ctx.strokeStyle = '#e6eefb';
  ctx.beginPath();
  ctx.arc(w / 2, h / 1.2, 70, Math.PI, 2 * Math.PI);
  ctx.stroke();

  const end = Math.PI + (pct / 100) * Math.PI;
  ctx.strokeStyle = '#0b6cf7';
  ctx.beginPath();
  ctx.arc(w / 2, h / 1.2, 70, Math.PI, end);
  ctx.stroke();

  ctx.font = '20px Inter, Arial';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.fillText(`${pct}%`, w / 2, h / 1.2 + 8);
}

// ========================== PRACTICE ==========================
function setupPractice() {
  const items = [
    { text: 'Bantu tetangga kirim makanan setelah banjir', target: 'gotong-royong' },
    { text: 'Menghargai teman yang berbeda agama', target: 'toleransi' },
    { text: 'Mengibarkan bendera saat peringatan nasional', target: 'nasionalisme' },
    { text: 'Bergotong-royong membersihkan lingkungan', target: 'gotong-royong' },
    { text: 'Menghormati simbol-simbol negara', target: 'nasionalisme' }
  ];

  const draggables = document.getElementById('draggables');
  const zones = document.querySelectorAll('.dropzone');
  const feedback = document.getElementById('practice-feedback');

  draggables.innerHTML = '';
  zones.forEach(z => z.innerHTML = `<h4>${z.querySelector('h4').innerText}</h4>`);
  feedback.innerText = '';

  items.sort(() => Math.random() - 0.5).forEach((it, idx) => {
    const el = document.createElement('div');
    el.className = 'draggable';
    el.draggable = true;
    el.id = `item-${idx}`;
    el.dataset.target = it.target;
    el.innerText = it.text;
    el.addEventListener('dragstart', dragStart);
    draggables.appendChild(el);
  });

  zones.forEach(dz => {
    dz.addEventListener('dragover', dragOver);
    dz.addEventListener('dragleave', dragLeave);
    dz.addEventListener('drop', dropHandler);
  });

  document.getElementById('check-practice').onclick = checkPractice;
}

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('over');
}

function dragLeave(e) {
  e.currentTarget.classList.remove('over');
}

function dropHandler(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('over');
  const id = e.dataTransfer.getData('text/plain');
  const el = document.getElementById(id);
  if (el) e.currentTarget.appendChild(el);
}

function checkPractice() {
  const zones = document.querySelectorAll('.dropzone');
  let correct = 0, total = 0;

  zones.forEach(z => {
    const target = z.dataset.target;
    Array.from(z.children).forEach(child => {
      if (child.classList.contains('draggable')) {
        total++;
        const isCorrect = child.dataset.target === target;
        child.style.border = isCorrect ? '1px solid #22c55e' : '2px solid #ef4444';
        if (isCorrect) correct++;
        child.draggable = false;
      }
    });
  });

  const feedback = document.getElementById('practice-feedback');
  feedback.innerText = `Jawaban benar: ${correct}/${total}`;
}
