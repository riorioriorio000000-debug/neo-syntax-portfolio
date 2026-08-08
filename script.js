const USER = 'riorioriorio000000-debug';
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

function animateCount(el) {
  const target = parseInt(el.dataset.target || el.textContent, 10) || 0;
  let cur = 0; const dur = 1400; const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

async function api(path) {
  const r = await fetch('https://api.github.com' + path, { headers: { 'Accept': 'application/vnd.github+json' } });
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

async function loadProfile() {
  try {
    const u = await api('/users/' + USER);
    const stars = await api('/users/' + USER + '/repos?per_page=100').then(rs => rs.reduce((s, r) => s + (r.stargazers_count || 0), 0)).catch(() => 0);
    document.getElementById('heroName').textContent = u.name || USER;
    const bio = u.bio || 'مهندس برمجيات ومطور — ابناء الأنظمة والتجارب الرقمية.';
    document.getElementById('heroBio').textContent = bio;
    document.getElementById('heroStats').textContent = (u.public_repos || 0) + '+' + (u.followers || 0);
    const setM = (id, v) => { const el = document.getElementById(id); el.dataset.target = v; animateCount(el); };
    setM('mRepos', u.public_repos || 0);
    setM('mFollowers', u.followers || 0);
    setM('mFollowing', u.following || 0);
    setM('mStars', stars);
  } catch (e) {
    document.getElementById('heroBio').textContent = 'تعذّر تحميل البيانات المباشرة من GitHub.';
  }
}

const LANG_COLORS = { JavaScript:'#F7DF1E', TypeScript:'#3178C6', Python:'#3776AB', HTML:'#E34F26', CSS:'#563D7C', Java:'#ED8B00', 'C++':'#00599C', C:'#555555', 'C#':'#239120', Go:'#00ADD8', Rust:'#DEA584', Ruby:'#CC342D', PHP:'#777BB4', Swift:'#F05138', Kotlin:'#7F52FF', Dart:'#00B4AB', Shell:'#89E051', Vue:'#41B883', Svelte:'#FF3E00', Astro:'#FF5D01', 'Jupyter Notebook':'DA5B0B' };

async function loadRepos() {
  const gallery = document.getElementById('repoGallery');
  try {
    let repos = await api('/users/' + USER + '/repos?sort=updated&per_page=100');
    repos = repos.filter(r => !r.fork).sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 24);
    if (!repos.length) { gallery.innerHTML = '<div class="loading-dot">no_public_repos_found</div>'; return; }
    gallery.innerHTML = repos.map(r => {
      const lang = r.language || '—';
      const color = LANG_COLORS[lang] || '#A1A1AA';
      const updated = new Date(r.updated_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
      return '<article class="repo-card"><a href="' + r.html_url + '" target="_blank" rel="noopener" style="display:block"><h3 class="repo-name">' + r.name + '</h3><p class="repo-desc">' + (r.description || 'No description provided.') + '</p><div class="repo-lang-row"><span class="lang-dot" style="background:' + color + '"></span><span class="repo-lang">' + lang + '</span></div><div class="repo-meta"><span class="star">★ ' + (r.stargazers_count || 0) + '</span><span>⑂ ' + (r.forks_count || 0) + '</span><span>updated ' + updated + '</span></div></a></article>';
    }).join('');
  } catch (e) {
    gallery.innerHTML = '<div class="loading-dot">error_fetching_repos</div>';
  }
}

async function loadActivity() {
  const track = document.getElementById('activityTrack');
  try {
    const events = await api('/users/' + USER + '/events/public?per_page=30');
    if (!events.length) { track.innerHTML = '<div class="activity-item">no_recent_activity</div>'; return; }
    track.innerHTML = events.slice(0, 20).map(ev => {
      const t = ev.type.replace('Event','').replace(/([A-Z])/g, ' $1').trim().toLowerCase();
      const repo = ev.repo.name.split('/').pop();
      return '<div class="activity-item"><span class="ev-type">' + t + '</span> → ' + repo + '</div>';
    }).join('');
  } catch {
    track.innerHTML = '<div class="activity-item">activity_unavailable</div>';
  }
}

const COMMANDS = {
  whoami: 'Abdullah — Digital Architect.\nCrafting code into cinematic visual experiences.\nGitHub: @riorioriorio000000-debug',
  social: '<span class="link">github.com/riorioriorio000000-debug</span>\nMore channels coming soon.',
  contact: 'Open a conversation via GitHub issues/discussions.\n<span class="link">https://github.com/riorioriorio000000-debug</span>',
  help: 'Available commands: whoami, social, contact, help'
};
function typeText(el, text, done) {
  let i = 0; el.textContent = '';
  (function step() { if (i <= text.length) { el.textContent = text.slice(0, i); i++; setTimeout(step, 28); } else { done && done(); } })();
}
function runCommand(cmd) {
  const typed = document.getElementById('typedCmd');
  const out = document.getElementById('termOutput');
  typeText(typed, cmd, () => {
    const res = COMMANDS[cmd] || ('command not found: ' + cmd + '\ntype: whoami, social, contact, help');
    out.innerHTML = '<span class="' + (cmd==='help'?'':'ok') + '">' + res + '</span>';
  });
}
document.querySelectorAll('.cmd-btn').forEach(b => b.addEventListener('click', () => runCommand(b.dataset.cmd)));

loadProfile(); loadRepos(); loadActivity();
setTimeout(() => runCommand('whoami'), 1800);