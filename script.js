// قائمة الجوال
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

/* ========= ميل ثلاثي الأبعاد للبطاقات والصور عند تحريك الماوس ========= */
if (!reduceMotion && !isCoarsePointer) {
  document.querySelectorAll('.tilt').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -8;
      const ry = (px - 0.5) * 10;
      el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ========= أزرار مغناطيسية تنجذب قليلاً نحو المؤشر ========= */
  document.querySelectorAll('.btn, .nav-cta, .float-btn').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${relX * 0.15}px, ${relY * 0.25}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = 'translate(0,0)';
    });
  });
}

/* ========= اسم الموقع/الشعار يتطاير كأنه ذرات تراب عند مرور الماوس ========= */
if (!reduceMotion && !isCoarsePointer) {
  const dustColors = ['#d8b479', '#c8963e', '#8fd6e6', '#2f8fa0'];
  let lastSpawn = 0;

  document.querySelectorAll('.dust-hover').forEach((el) => {
    el.style.position = el.style.position || 'relative';

    el.addEventListener('pointermove', (e) => {
      const now = performance.now();
      if (now - lastSpawn < 24) return; // تحكم بمعدل ظهور الذرات
      lastSpawn = now;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < 2; i++) {
        const p = document.createElement('span');
        p.className = 'dust-particle';
        const dx = (Math.random() - 0.5) * 26;
        const size = 3 + Math.random() * 4;
        p.style.left = x + (Math.random() - 0.5) * 10 + 'px';
        p.style.top = y + (Math.random() - 0.5) * 10 + 'px';
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.setProperty('--dx', dx + 'px');
        p.style.background = `radial-gradient(circle, ${dustColors[Math.floor(Math.random() * dustColors.length)]}, transparent 70%)`;
        el.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
        setTimeout(() => p.remove(), 900); // شبكة أمان في حال لم يُطلق animationend
      }
    });
  });
}

/* ========= وهج خفيف يتبع المؤشر في قسم البطل (Hero) ========= */
if (!reduceMotion && !isCoarsePointer) {
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.setProperty('--mx', '.5');
    hero.style.setProperty('--my', '.5');
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width).toFixed(3));
      hero.style.setProperty('--my', ((e.clientY - rect.top) / rect.height).toFixed(3));
    });
  }
}
