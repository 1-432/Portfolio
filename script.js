// DOM Selectors
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.panel');
const order = ['about', 'skills', 'projects', 'education', 'experience', 'contact'];

let currentIndex = 0;
let cycleTimer = null;
let userHasInteracted = false; // Stops auto-switching once user starts manually exploring

// Form state
let formInProgress = false;
let idleResumeTimer = null;

/**
 * Activates a given panel tab
 */
function activateTab(target, { instant = false } = {}) {
  if (target !== 'contact') {
    formInProgress = false;
    clearTimeout(idleResumeTimer);
  }

  currentIndex = order.indexOf(target);
  if (currentIndex === -1) currentIndex = 0;

  // Update tabs
  tabBtns.forEach(btn => {
    const isActive = btn.dataset.target === target;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update panels
  panels.forEach(panel => {
    panel.classList.remove('panel-out');
    panel.classList.toggle('active', panel.id === `panel-${target}`);
  });

  if (!instant && !userHasInteracted) {
    restartCycle();
  }

  staggerReveal(target);
}

/**
 * Staggers entrance animations on panel items
 */
function staggerReveal(target) {
  const panel = document.getElementById(`panel-${target}`);
  if (!panel) return;

  const items = panel.querySelectorAll('.fact, .skill-card, .tag, .project-card, .timeline-item, .contact-card');
  items.forEach((item, i) => {
    item.style.animation = 'none';
    void item.offsetWidth; // Trigger DOM reflow
    item.style.animationDelay = `${i * 0.06}s`;
    item.style.animation = '';
  });

  // Replay mockup intro header animations if present
  const intros = panel.querySelectorAll('.mockup-intro');
  intros.forEach(intro => {
    intro.style.animation = 'none';
    intro.style.visibility = 'visible';
    intro.style.opacity = '1';
    void intro.offsetWidth;
    intro.style.animation = '';
  });
}

/**
 * Advance to next tab during idle auto-cycle
 */
function goToNext() {
  if (formInProgress || userHasInteracted) return;

  const currentPanel = document.getElementById(`panel-${order[currentIndex]}`);
  if (currentPanel) {
    currentPanel.classList.add('panel-out');
  }

  setTimeout(() => {
    if (formInProgress || userHasInteracted) {
      if (currentPanel) currentPanel.classList.remove('panel-out');
      return;
    }
    const nextIndex = (currentIndex + 1) % order.length;
    activateTab(order[nextIndex], { instant: true });
  }, 400);
}

function restartCycle() {
  clearInterval(cycleTimer);
  if (formInProgress || userHasInteracted) return;
  cycleTimer = setInterval(goToNext, 14000); // 14 seconds per slide
}

function pauseForForm() {
  formInProgress = true;
  clearInterval(cycleTimer);
  clearTimeout(idleResumeTimer);
  idleResumeTimer = setTimeout(resumeCycle, 90000);
}

function resumeCycle() {
  formInProgress = false;
  clearTimeout(idleResumeTimer);
  if (!userHasInteracted) restartCycle();
}

// User tab button clicks
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    userHasInteracted = true; // User took control; disable auto-carousel
    clearInterval(cycleTimer);
    activateTab(btn.dataset.target);
  });
});

// Arrow key navigation between tabs
document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  if (e.key === 'ArrowRight') {
    userHasInteracted = true;
    clearInterval(cycleTimer);
    const nextIndex = (currentIndex + 1) % order.length;
    activateTab(order[nextIndex]);
  } else if (e.key === 'ArrowLeft') {
    userHasInteracted = true;
    clearInterval(cycleTimer);
    const prevIndex = (currentIndex - 1 + order.length) % order.length;
    activateTab(order[prevIndex]);
  }
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('focus', pauseForForm);
    field.addEventListener('input', pauseForForm);
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cfName')?.value.trim() || 'Anonymous';
    const email = document.getElementById('cfEmail')?.value.trim() || '';
    const message = document.getElementById('cfMessage')?.value.trim() || '';

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`);

    window.location.href = `mailto:dominicoyugi1@gmail.com?subject=${subject}&body=${body}`;
    resumeCycle();
  });
}

// Initial boot
activateTab('about', { instant: true });
restartCycle();