let currentSlide = 0;
let isTransitioning = false;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const progressFill = document.getElementById('progressFill');
const slideCounter = document.getElementById('slideCounter');
const projNav = document.getElementById('projNav');
const projNavItems = document.querySelectorAll('.proj-nav-item');

// Mapa: slide index -> qual projeto pertence (0=capa, 1-2=proj1, ..., 15-16=proj8, 17=final)
function getProjectFromSlide(slideIdx) {
  if (slideIdx === 0 || slideIdx >= totalSlides - 1) return -1; // capa ou final
  return Math.ceil(slideIdx / 2); // 1-8
}

updateProgress();
updateProjNav();

function goToSlide(index, direction = null) {
  if (isTransitioning || index < 0 || index >= totalSlides || index === currentSlide) return;
  isTransitioning = true;

  const dir = direction || (index > currentSlide ? 'next' : 'prev');
  const currentEl = slides[currentSlide];
  const nextEl = slides[index];

  slides.forEach(s => s.classList.remove('entering-from-right','entering-from-left','exiting-to-left','exiting-to-right'));

  if (dir === 'next') {
    currentEl.classList.add('exiting-to-left');
    nextEl.classList.add('entering-from-right');
  } else {
    currentEl.classList.add('exiting-to-right');
    nextEl.classList.add('entering-from-left');
  }

  nextEl.classList.add('active');
  nextEl.style.visibility = 'visible';
  nextEl.style.opacity = '1';

  setTimeout(() => {
    currentEl.classList.remove('active','exiting-to-left','exiting-to-right');
    currentEl.style.visibility = 'hidden';
    currentEl.style.opacity = '0';
    nextEl.classList.remove('entering-from-right','entering-from-left');
    currentSlide = index;
    updateProgress();
    updateProjNav();
    animateCounters(nextEl);
    isTransitioning = false;
  }, 500);
}
window.goToSlide = goToSlide;

function nextSlide() { if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1, 'next'); }
function prevSlide() { if (currentSlide > 0) goToSlide(currentSlide - 1, 'prev'); }

function updateProgress() {
  progressFill.style.width = ((currentSlide) / (totalSlides - 1) * 100) + '%';
  slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

function updateProjNav() {
  const proj = getProjectFromSlide(currentSlide);

  // Esconder na capa e slide final
  if (proj === -1) {
    projNav.classList.add('hidden');
  } else {
    projNav.classList.remove('hidden');
  }

  // Marcar projeto ativo
  projNavItems.forEach(item => {
    const itemProj = parseInt(item.dataset.proj);
    if (itemProj === proj) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Click nos itens do rodape
projNavItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = parseInt(item.dataset.goto);
    goToSlide(target);
  });
});

// Keyboard
document.addEventListener('keydown', (e) => {
  if (['ArrowRight','ArrowDown',' ','PageDown'].includes(e.key)) { e.preventDefault(); nextSlide(); }
  else if (['ArrowLeft','ArrowUp','PageUp'].includes(e.key)) { e.preventDefault(); prevSlide(); }
  else if (e.key === 'Home') { e.preventDefault(); goToSlide(0); }
  else if (e.key === 'End') { e.preventDefault(); goToSlide(totalSlides - 1); }
});

// Buttons
document.getElementById('prevBtn').addEventListener('click', prevSlide);
document.getElementById('nextBtn').addEventListener('click', nextSlide);

// Touch
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) { dx < 0 ? nextSlide() : prevSlide(); }
}, { passive: true });

// Wheel
let wheelLock = null;
document.addEventListener('wheel', (e) => {
  const body = e.target.closest('.slide-body');
  if (body && body.scrollHeight > body.clientHeight) {
    const atTop = body.scrollTop <= 0;
    const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 5;
    if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
  }
  if (wheelLock) return;
  wheelLock = setTimeout(() => { wheelLock = null; }, 800);
  e.deltaY > 0 ? nextSlide() : prevSlide();
}, { passive: true });

// Counter animation
function animateCounters(el) {
  el.querySelectorAll('[data-count]').forEach(c => {
    c.textContent = '0';
    const target = parseInt(c.dataset.count);
    const start = performance.now();
    (function update(now) {
      const p = Math.min((now - start) / 1500, 1);
      c.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(update);
    })(start);
  });
}
