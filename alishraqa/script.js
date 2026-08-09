// قائمة الجوال
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// تفاعل الخلفية والعناصر مع حركة الماوس
const blobs = document.querySelectorAll('.blob');
const waveLayer = document.querySelector('.wave-layer');
const glow = document.querySelector('.cursor-glow');
const tiltEls = document.querySelectorAll('.hero-photo, .service-card, .map-visual');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetX = mouseX, targetY = mouseY;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (glow) {
    glow.style.left = mouseX + 'px';
    glow.style.top = mouseY + 'px';
    glow.style.opacity = '1';
  }
});

window.addEventListener('mouseleave', () => {
  if (glow) glow.style.opacity = '0';
});

function animateBackground() {
  targetX += (mouseX - targetX) * 0.06;
  targetY += (mouseY - targetY) * 0.06;

  const nx = (targetX / window.innerWidth - 0.5); // -0.5 .. 0.5
  const ny = (targetY / window.innerHeight - 0.5);

  blobs.forEach((b, i) => {
    const depth = (i + 1) * 22;
    b.style.transform = `translate(${nx * depth}px, ${ny * depth}px)`;
  });

  if (waveLayer) {
    waveLayer.style.transform = `translate(${nx * 14}px, ${ny * 10}px) scale(1.03)`;
  }

  requestAnimationFrame(animateBackground);
}
requestAnimationFrame(animateBackground);

// تأثير الميل ثلاثي الأبعاد عند مرور الماوس فوق البطاقات والصور
tiltEls.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--tiltY', (px * 10).toFixed(2) + 'deg');
    el.style.setProperty('--tiltX', (-py * 10).toFixed(2) + 'deg');
  });
  el.addEventListener('mouseleave', () => {
    el.style.setProperty('--tiltY', '0deg');
    el.style.setProperty('--tiltX', '0deg');
  });
});

// تلاشي ظهور الأقسام أثناء التمرير
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('section, .coverage, .contact').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});