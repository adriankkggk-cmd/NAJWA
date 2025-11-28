/* main.js - handles dark mode, quiz storage, animations, utils */

/* ---------- Dark mode toggle & persist ---------- */
const THEME_KEY = "site-theme";
const root = document.documentElement;

function applyTheme(theme){
  if(theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
}

function initTheme(){
  const saved = localStorage.getItem(THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);
  const toggle = document.getElementById('themeToggle');
  if(toggle) toggle.checked = (saved === 'dark');
}
function toggleTheme(checked){
  const theme = checked ? 'dark' : 'light';
  applyTheme(theme);
  localStorage.setItem(THEME_KEY, theme);
}

/* ---------- Simple fade-in animation for cards ---------- */
document.addEventListener('DOMContentLoaded',() => {
  initTheme();
  document.querySelectorAll('.card').forEach((el,i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(12px)';
    setTimeout(()=> {
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 120 + i*80);
  });
});

/* ---------- QUIZ LOGIC for kuis.html ---------- */
function evaluateQuiz(questions){
  // questions: array of {id: 'q1', answer: 'b'}
  let score = 0;
  questions.forEach(q => {
    const selected = document.querySelector(`input[name="${q.id}"]:checked`);
    if(selected && selected.value === q.answer) score++;
  });
  return score;
}

/* store result in localStorage for Evaluasi page */
function submitQuiz(questions){
  const score = evaluateQuiz(questions);
  const total = questions.length;
  const percent = Math.round((score/total)*100);
  const record = {score, total, percent, timestamp: new Date().toISOString()};
  // save
  localStorage.setItem('fotosintesis-quiz-result', JSON.stringify(record));
  return record;
}

function getLastQuizResult(){
  const raw = localStorage.getItem('fotosintesis-quiz-result');
  if(!raw) return null;
  try { return JSON.parse(raw); } catch(e){ return null; }
}

/* helper to show message area */
function showMessage(el, text, ok=true){
  if(!el) return;
  el.innerText = text;
  el.style.color = ok ? 'var(--accent)' : 'crimson';
}

/* smooth scroll to top when navigating home links (for SPA feel) */
function scrollToTop(){
  window.scrollTo({top:0, behavior:'smooth'});
}

/* export to global */
window.site = {
  toggleTheme, submitQuiz, getLastQuizResult, showMessage, scrollToTop
};
