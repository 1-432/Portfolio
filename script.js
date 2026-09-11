// Generate a soft field of twinkling stars
const sky = document.getElementById('sky');
const STAR_COUNT = 80;
for (let i = 0; i < STAR_COUNT; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  const size = Math.random() * 2 + 0.6;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;
  star.style.animationDuration = `${Math.random() * 4 + 2.5}s`;
  star.style.animationDelay = `${Math.random() * 4}s`;
  sky.appendChild(star);
}

// Tab switching + auto-cycle, all within one window
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.panel');
const order = ['about', 'skills', 'projects', 'education', 'contact'];
let currentIndex = 0;
let cycleTimer = null;

function activateTab(target, { instant } = {}) {
  currentIndex = order.indexOf(target);
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.target === target));
  panels.forEach(p => {
    p.classList.remove('panel-out');
    p.classList.toggle('active', p.id === 'panel-' + target);
  });
  if (!instant) restartCycle();
}

function goToNext() {
  const currentPanel = document.getElementById('panel-' + order[currentIndex]);
  currentPanel.classList.add('panel-out');
  setTimeout(() => {
    const nextIndex = (currentIndex + 1) % order.length;
    activateTab(order[nextIndex], { instant: true });
  }, 700);
}

function restartCycle() {
  clearInterval(cycleTimer);
  cycleTimer = setInterval(goToNext, 15000);
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.target));
});

activateTab('about', { instant: true });
restartCycle();