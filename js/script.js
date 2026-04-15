/* ============================================================
   ARSEA CLONE - script.js
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
      // Re-trigger hero content animations
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
        el.offsetHeight; // reflow
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

// Close mobile nav on link click
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

// ── Hero Micro Motion ──────────────────────────────────────
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

// Pause autoplay while hovering a slider
function bindAutoplayHover(containerSelector, swiperInstance) {
  const container = document.querySelector(containerSelector);
  if (!container || !swiperInstance?.autoplay) return;
  container.addEventListener('mouseenter', () => swiperInstance.autoplay.stop());
  container.addEventListener('mouseleave', () => swiperInstance.autoplay.start());
}

bindAutoplayHover('.hero-swiper', heroSwiper);
bindAutoplayHover('.review-img-swiper', reviewSwiper);

// ── FAQ Accordion ──────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isActive = item.classList.contains('active');

  // Close all
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

  // Toggle current
  if (!isActive) item.classList.add('active');
}

// ── Multi-Step Form ────────────────────────────────────────
let currentStep = 1;

function goToStep(step) {
  // Validate current step
  if (step > currentStep && !validateStep(currentStep)) return;

  // Hide current page
  document.getElementById(`step${currentStep}`).classList.remove('active');

  // Update step indicators
  document.querySelectorAll('.form-step').forEach((el, i) => {
    const num = el.querySelector('.step-num');
    const idx = i + 1;
    el.classList.remove('active');
    num.classList.remove('active-num', 'done');

    if (idx < step) { num.classList.add('done'); num.textContent = '✓'; }
    else if (idx === step) {
      el.classList.add('active');
      num.classList.add('active-num');
      num.textContent = idx;
    } else {
      num.textContent = idx;
    }
  });

  currentStep = step;
  document.getElementById(`step${currentStep}`).classList.add('active');
}

function validateStep(step) {
  const page = document.getElementById(`step${step}`);
  const required = page.querySelectorAll('input[type="text"], input[type="email"], select, textarea');
  let valid = true;

  required.forEach(el => {
    el.style.borderColor = '';
    if (el.closest('.phone-group') || el.type === 'date') return; // skip optional
    if (el.tagName === 'SELECT' && el.value === '') {
      el.style.borderColor = '#ff4444';
      valid = false;
    } else if (el.value.trim() === '' && el.placeholder !== '희망 예산을 입력해주세요') {
      // Only validate required fields
    }
  });

  // Check name field on step 1
  if (step === 1) {
    const nameInput = page.querySelector('input[type="text"]');
    if (nameInput && nameInput.value.trim() === '') {
      nameInput.style.borderColor = '#ff4444';
      nameInput.focus();
      return false;
    }
    const emailInput = page.querySelector('input[type="email"]');
    if (emailInput && emailInput.value.trim() === '') {
      emailInput.style.borderColor = '#ff4444';
      emailInput.focus();
      return false;
    }
  }

  return true;
}

function submitForm() {
  const agreeCheckbox = document.getElementById('agreePrivacy');
  if (!agreeCheckbox.checked) {
    alert('개인정보 수집 및 상담 안내에 동의해주세요.');
    return;
  }
  alert('상담 신청이 접수되었습니다!\n영업일 기준 1~2일 내에 예약 안내 연락을 드리겠습니다.');
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

// ── Scroll Reveal ──────────────────────────────────────────
const revealEls = document.querySelectorAll('.diff-card, .service-card, .process-step, .director-media, .director-card, .faq-item, .portfolio-item');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 0.1}s`;
  observer.observe(el);
});

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

window.addEventListener('scroll', updateGlobalUi, { passive: true });
updateGlobalUi();
