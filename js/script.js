/* ============================================================
   ARSEA CLONE - script.js  (Enhanced Motion Edition)
   ============================================================ */

// ── Hero Swiper ────────────────────────────────────────────
const heroSwiper = new Swiper('.hero-swiper', {
  loop: true,
  autoplay: { delay: 5000, disableOnInteraction: false },
  speed: 800,
  effect: 'fade',
  fadeEffect: { crossFade: true },
  pagination: {
    el: '.hero-swiper .swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  on: {
    slideChangeTransitionStart() {
      const slide = this.slides[this.activeIndex];
      const badge = slide.querySelector('.hero-badge');
      const title = slide.querySelector('.hero-title');
      const desc  = slide.querySelector('.hero-desc');
      document.querySelectorAll('.hero-content').forEach(content => {
        content.style.transform = '';
      });
      [badge, title, desc].forEach(el => {
        if (!el) return;
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = '';
      });
    }
  }
});

// ── Review Image Swiper ────────────────────────────────────
const reviewSwiper = new Swiper('.review-img-swiper', {
  loop: true,
  autoplay: { delay: 3500, disableOnInteraction: false },
  speed: 600,
  slidesPerView: 1,
  spaceBetween: 20,
  effect: 'fade',
  fadeEffect: { crossFade: true },
});

// ── Global UI State ────────────────────────────────────────
const header = document.getElementById('header');
const root = document.documentElement;
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  root.style.setProperty('--scroll-progress', `${Math.max(0, Math.min(progress, 100))}%`);
}

function updateActiveNav() {
  let current = sections[0]?.id || '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - header.offsetHeight - 140) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
  });
}

function updateGlobalUi() {
  header.classList.toggle('scrolled', window.scrollY > 20);
  updateScrollProgress();
  updateActiveNav();
}

// ── Floating Buttons Scroll Reveal ─────────────────────────
const floatBtns = document.querySelector('.float-btns');
function updateFloatBtns() {
  if (!floatBtns) return;
  floatBtns.classList.toggle('visible', window.scrollY > 300);
}

// ── Mobile Menu ────────────────────────────────────────────
const menuBtn  = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

function setMobileMenuState(isOpen) {
  mobileNav.classList.toggle('open', isOpen);
  menuBtn.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
}

menuBtn.addEventListener('click', () => {
  setMobileMenuState(!mobileNav.classList.contains('open'));
});

mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    setMobileMenuState(false);
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mobileNav.classList.contains('open')) {
    setMobileMenuState(false);
  }
});

// ── Hero Micro Motion (Parallax) ───────────────────────────
const heroSection = document.getElementById('hero');
let heroFrame = null;
let heroOffsetX = 0;
let heroOffsetY = 0;

function applyHeroParallax() {
  heroFrame = null;
  const activeContent = document.querySelector('.hero-swiper .swiper-slide-active .hero-content');
  document.querySelectorAll('.hero-content').forEach(content => {
    if (content !== activeContent) content.style.transform = '';
  });
  if (activeContent) {
    activeContent.style.transform = `translate3d(${heroOffsetX}px, ${heroOffsetY}px, 0)`;
  }
}

if (heroSection) {
  heroSection.addEventListener('pointermove', event => {
    if (window.innerWidth <= 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = heroSection.getBoundingClientRect();
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
    heroOffsetX = normalizedX * 22;
    heroOffsetY = normalizedY * 18;
    if (!heroFrame) heroFrame = requestAnimationFrame(applyHeroParallax);
  });

  heroSection.addEventListener('pointerleave', () => {
    heroOffsetX = 0;
    heroOffsetY = 0;
    if (!heroFrame) heroFrame = requestAnimationFrame(applyHeroParallax);
  });
}

// ── Hero Particles ─────────────────────────────────────────
function createHeroParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container || window.innerWidth <= 768) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${8 + Math.random() * 12}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.width = particle.style.height = `${3 + Math.random() * 5}px`;
    container.appendChild(particle);
  }
}

// Pause autoplay while hovering a slider
function bindAutoplayHover(containerSelector, swiperInstance) {
  const container = document.querySelector(containerSelector);
  if (!container || !swiperInstance?.autoplay) return;
  container.addEventListener('mouseenter', () => swiperInstance.autoplay.stop());
  container.addEventListener('mouseleave', () => swiperInstance.autoplay.start());
}

bindAutoplayHover('.hero-swiper', heroSwiper);
bindAutoplayHover('.review-img-swiper', reviewSwiper);

// ── FAQ Accordion (smooth) ─────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isActive = item.classList.contains('active');

  // Close all with animation
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('active');
  });

  // Toggle current
  if (!isActive) {
    item.classList.add('active');
  }
}

// ── Multi-Step Form ────────────────────────────────────────
let currentStep = 1;

function goToStep(step) {
  if (step > currentStep && !validateStep(currentStep)) return;

  document.getElementById(`step${currentStep}`).classList.remove('active');

  // Update step indicators with animation
  document.querySelectorAll('.form-step').forEach((el, i) => {
    const num = el.querySelector('.step-num');
    const idx = i + 1;
    el.classList.remove('active');
    num.classList.remove('active-num', 'done');

    if (idx < step) { num.classList.add('done'); num.textContent = '\u2713'; }
    else if (idx === step) {
      el.classList.add('active');
      num.classList.add('active-num');
      num.textContent = idx;
    } else {
      num.textContent = idx;
    }
  });

  // Animate step dividers
  document.querySelectorAll('.step-divider').forEach((div, i) => {
    const after = div.querySelector('::after') || div;
    if (i < step - 1) {
      div.style.setProperty('--fill', '1');
      div.classList.add('filled');
    } else {
      div.style.setProperty('--fill', '0');
      div.classList.remove('filled');
    }
  });

  currentStep = step;
  document.getElementById(`step${currentStep}`).classList.add('active');
}

function validateStep(step) {
  const page = document.getElementById(`step${step}`);

  if (step === 1) {
    const nameInput = page.querySelector('input[type="text"]');
    if (nameInput && nameInput.value.trim() === '') {
      nameInput.style.borderColor = '#ff4444';
      nameInput.style.boxShadow = '0 0 0 3px rgba(255,68,68,0.08)';
      nameInput.focus();
      // Shake animation
      nameInput.style.animation = 'none';
      nameInput.offsetHeight;
      nameInput.style.animation = 'shake 0.4s ease';
      return false;
    }
    const emailInput = page.querySelector('input[type="email"]');
    if (emailInput && emailInput.value.trim() === '') {
      emailInput.style.borderColor = '#ff4444';
      emailInput.style.boxShadow = '0 0 0 3px rgba(255,68,68,0.08)';
      emailInput.focus();
      emailInput.style.animation = 'none';
      emailInput.offsetHeight;
      emailInput.style.animation = 'shake 0.4s ease';
      return false;
    }
  }

  return true;
}

// Add shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

// Reset border on focus
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
  el.addEventListener('focus', () => {
    el.style.borderColor = '#0063ff';
    el.style.boxShadow = '0 0 0 3px rgba(0,99,255,0.08)';
    el.style.animation = '';
  });
  el.addEventListener('blur', () => {
    if (el.style.borderColor === 'rgb(255, 68, 68)') return;
    el.style.borderColor = '#e0e0e0';
    el.style.boxShadow = '';
  });
});

// ── Google Sheets 연동 ─────────────────────────────────────
const SHEET_URL = 'https://script.google.com/macros/s/AKfycby3D3E2aOjmI5Z5LzcwAoe0MDxA0yQ6G7Opjd0viqlbLr_ICQ-0r6f2pIi0ZPmGZ1EA6g/exec';

function collectFormData() {
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');

  const nameVal = step1.querySelector('input[type="text"]')?.value.trim() || '';
  const emailVal = step1.querySelector('input[type="email"]')?.value.trim() || '';

  const phoneInputs = step1.querySelectorAll('.phone-group input');
  const phoneVal = Array.from(phoneInputs).map(i => i.value.trim()).filter(Boolean).join('-');

  const concernVal = step2.querySelector('select')?.value || '';
  const budgetVal = step2.querySelector('input[type="text"]')?.value.trim() || '';
  const dateVal = step2.querySelector('input[type="date"]')?.value || '';
  const detailsVal = step2.querySelector('textarea')?.value.trim() || '';

  return {
    name: nameVal,
    phone: phoneVal,
    email: emailVal,
    concern: concernVal,
    budget: budgetVal,
    date: dateVal,
    details: detailsVal
  };
}

function submitForm() {
  const agreeCheckbox = document.getElementById('agreePrivacy');
  if (!agreeCheckbox.checked) {
    alert('개인정보 수집 및 상담 안내에 동의해주세요.');
    return;
  }

  const submitBtn = document.querySelector('.btn-submit');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = '접수 중...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  const data = collectFormData();

  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(() => {
    alert('상담 신청이 접수되었습니다!\n영업일 기준 1~2일 내에 예약 안내 연락을 드리겠습니다.');
    // 폼 초기화
    document.querySelectorAll('.form-page input, .form-page select, .form-page textarea').forEach(el => {
      if (el.type === 'checkbox') el.checked = false;
      else el.value = '';
    });
    goToStep(1);
  })
  .catch(() => {
    alert('접수 중 오류가 발생했습니다. 전화(02-558-5058)로 문의 부탁드립니다.');
  })
  .finally(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
  });
}

// ── Portfolio Horizontal Drag Scroll ──────────────────────
const portfolioScroll = document.querySelector('.portfolio-scroll-wrap');
if (portfolioScroll) {
  let isDown = false, startX, scrollLeft;

  portfolioScroll.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - portfolioScroll.offsetLeft;
    scrollLeft = portfolioScroll.scrollLeft;
  });
  portfolioScroll.addEventListener('mouseleave', () => isDown = false);
  portfolioScroll.addEventListener('mouseup', () => isDown = false);
  portfolioScroll.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - portfolioScroll.offsetLeft;
    const walk = (x - startX) * 1.5;
    portfolioScroll.scrollLeft = scrollLeft - walk;
  });

  portfolioScroll.addEventListener('wheel', e => {
    if (window.innerWidth <= 768 || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    portfolioScroll.scrollLeft += e.deltaY;
  }, { passive: false });
}

// ── Enhanced Scroll Reveal ─────────────────────────────────
const revealEls = document.querySelectorAll('.diff-card, .service-card, .process-step, .director-media, .director-card, .faq-item, .portfolio-item');
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Stagger based on sibling index within parent
revealEls.forEach(el => {
  const parent = el.parentElement;
  const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = `${idx * 0.08}s`;
  revealObserver.observe(el);
});

// ── Section-level reveal for headers ───────────────────────
const sectionRevealEls = document.querySelectorAll('.section-reveal');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

sectionRevealEls.forEach(el => sectionObserver.observe(el));

// ── Card Mouse Tracking (radial glow) ─────────────────────
document.querySelectorAll('.diff-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

// ── Magnetic Button Effect ─────────────────────────────────
function initMagneticButtons() {
  if (window.innerWidth <= 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const magneticBtns = document.querySelectorAll('.btn-cta, .btn-kakao, .btn-director, .btn-portfolio, .btn-review-more');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
}

// ── Parallax on scroll for sections ────────────────────────
function initScrollParallax() {
  if (window.innerWidth <= 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const parallaxElements = [
    { selector: '.float-tags', speed: 0.04 },
    { selector: '.contact-emblem', speed: 0.06 },
    { selector: '.director-photo-wrap', speed: 0.03 },
  ];

  let ticking = false;

  function updateParallax() {
    ticking = false;
    const scrollY = window.scrollY;

    parallaxElements.forEach(({ selector, speed }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// ── Smooth scroll for nav links ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 20;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ── Typed text effect for hero (subtle) ────────────────────
function initHeroTextEffect() {
  const badges = document.querySelectorAll('.hero-badge');
  badges.forEach(badge => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(10px) scale(0.95)';
  });

  setTimeout(() => {
    const activeBadge = document.querySelector('.swiper-slide-active .hero-badge');
    if (activeBadge) {
      activeBadge.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)';
      activeBadge.style.opacity = '1';
      activeBadge.style.transform = 'translateY(0) scale(1)';
    }
  }, 300);
}

// ── Init ───────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  updateGlobalUi();
  updateFloatBtns();
}, { passive: true });

updateGlobalUi();
updateFloatBtns();
createHeroParticles();
initMagneticButtons();
initScrollParallax();
initHeroTextEffect();
