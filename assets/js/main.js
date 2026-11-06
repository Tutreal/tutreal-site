document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Reveal ao rolar (com stagger) ===== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.card, .gallery figure, .steps li, .strip-item, .section .eyebrow, .section h2, .section-note, .about-single p, .quotes blockquote, .contact-card'
).forEach(el => { el.classList.add('reveal'); observer.observe(el); });

// escalona a entrada dentro de cada grupo
document.querySelectorAll('.gallery, .strip-grid, .contact-grid, .steps').forEach(group => {
  [...group.children].forEach((c, i) => c.style.setProperty('--i', i));
});

/* ===== Rastreamento WhatsApp/e-mail (GTM) — inalterado ===== */
window.dataLayer = window.dataLayer || [];
document.addEventListener('click', e => {
  const link = e.target.closest('a[href*="wa.me"], a[href^="mailto:"]');
  if (!link) return;
  window.dataLayer.push({
    event: link.href.startsWith('mailto:') ? 'clique_email' : 'clique_whatsapp',
    origem_clique: link.dataset.origem || 'nao-identificado'
  });
});

/* ===== Tilt 3D nas peças e botões magnéticos ===== */
if (!reduce) {
  document.querySelectorAll('.gallery figure').forEach(fig => {
    fig.addEventListener('pointermove', ev => {
      const r = fig.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width - .5, py = (ev.clientY - r.top) / r.height - .5;
      fig.style.transform = `perspective(700px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-5px)`;
    });
    fig.addEventListener('pointerleave', () => { fig.style.transform = ''; });
  });
  document.querySelectorAll('.btn-accent').forEach(b => {
    b.addEventListener('pointermove', ev => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(ev.clientX - r.left - r.width / 2) * .2}px, ${(ev.clientY - r.top - r.height / 2) * .3}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
}

/* ===== Partículas (constelação verde) no "Sobre Nós" ===== */
(function () {
  const cv = document.getElementById('sobreFx');
  if (!cv) return;
  const ctx = cv.getContext('2d'), host = cv.parentElement;
  const DPR = Math.min(2, devicePixelRatio || 1);
  let W = 0, H = 0, run = true;
  const dots = [];
  function resize() { const r = host.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  resize(); addEventListener('resize', resize);
  for (let i = 0; i < 90; i++) dots.push({ x: Math.random(), y: Math.random(), s: .7 + Math.random() * 2.2, vx: (Math.random() - .5) * .0016, vy: (Math.random() - .5) * .0016, tw: Math.random() * 6.28 });
  function frame(now) {
    const t = (now || 0) * 0.001, pts = [];
    ctx.clearRect(0, 0, W, H);
    for (const p of dots) {
      if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x += 1; if (p.x > 1) p.x -= 1; if (p.y < 0) p.y += 1; if (p.y > 1) p.y -= 1; }
      pts.push({ x: p.x * W, y: p.y * H, s: p.s, a: .55 + .4 * Math.sin(t * 2 + p.tw) });
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, dd = dx * dx + dy * dy;
        if (dd < 15000) { ctx.strokeStyle = 'rgba(140,198,63,' + (0.22 * (1 - dd / 15000)) + ')'; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
      }
    }
    ctx.shadowColor = 'rgba(156,200,74,.85)';
    for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.2832); ctx.fillStyle = 'rgba(176,214,96,' + Math.max(.3, p.a) + ')'; ctx.shadowBlur = 6; ctx.fill(); }
    ctx.shadowBlur = 0;
    window.__pfFrames = (window.__pfFrames || 0) + 1;
    if (!reduce) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
