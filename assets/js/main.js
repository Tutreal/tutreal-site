document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .gallery figure, .steps li, .strip-item, .hero-figure').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

window.dataLayer = window.dataLayer || [];
document.addEventListener('click', e => {
  const link = e.target.closest('a[href*="wa.me"]');
  if (!link) return;
  window.dataLayer.push({
    event: 'clique_whatsapp',
    origem_clique: link.dataset.waOrigem || 'nao-identificado'
  });
});
