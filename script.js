/* =====================================================
   ChocoBeth — script.js
===================================================== */

/* ─── Navbar scroll state ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── Mobile hamburger ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  // Animate spans
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ─── Scroll Reveal ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children in a grid
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Stagger cards inside grids
function applyStagger(selector, parentSelector) {
  document.querySelectorAll(parentSelector).forEach(parent => {
    parent.querySelectorAll(selector).forEach((el, i) => {
      el.dataset.delay = i * 100;
    });
  });
}
applyStagger('.produto-card', '.produtos-grid');
applyStagger('.dep-card',     '.dep-grid');
applyStagger('.pillar',       '.sobre-pillars');

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Filtro de produtos ─── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const prodCards   = document.querySelectorAll('.produto-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    prodCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      if (match) {
        card.classList.remove('hidden');
        // Re-trigger micro-animation
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ─── Carrossel ─── */
const track     = document.getElementById('carouselTrack');
const items     = track.querySelectorAll('.carousel-item');
const btnPrev   = document.getElementById('carouselPrev');
const btnNext   = document.getElementById('carouselNext');
const dotsWrap  = document.getElementById('carouselDots');
let current     = 0;
let autoTimer;

// Build dots
items.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

function goTo(idx) {
  current = (idx + items.length) % items.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(current + 1), 5000);
}
resetAuto();

// Touch/swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) { dx < 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
}, { passive: true });

/* ─── Modal ─── */
const overlay    = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

const products = {
  brigadeiro: {
    name:   'Brigadeiro Gourmet',
    badge:  'Clássico · Mais Pedido',
    img:    'https://storage.googleapis.com/runable-templates/cli-uploads%2FHj5H0xeHR7muk4oAt3jaNMfeFfhhA20e%2F9WXJYFzAXKiwm0yP2Usnq%2Ftrufas-artesanais-bombons-premium-photography-chocolate_0.jpg',
    desc:   'Ganache de chocolate ao leite belga com acabamento em granulado crocante artesanal. Uma releitura premium do clássico brasileiro.',
    details:'🍫 Chocolate 70% cacau · 🌾 Granulado belga importado · 🥛 Leite condensado artesanal · ✦ Sem conservantes',
    preco:  'R$ 6,50',
    wa:     'Ol%C3%A1%2C+gostaria+de+pedir+Brigadeiro+Gourmet!'
  },
  ninho: {
    name:   'Ninho com Nutella',
    badge:  'Especial · Favorita das clientes',
    img:    'https://storage.googleapis.com/runable-templates/cli-uploads%2FHj5H0xeHR7muk4oAt3jaNMfeFfhhA20e%2FHj5H0xeHR7muk4oAt3jaNMfeFfhhA20e%2Fv7LcGN2QC5MpYzuoippuY%2Ftrufas-artesanais-bombons-premium-photography-chocolate_2.jpg',
    desc:   'Cobertura de chocolate branco com leite Ninho e recheio de Nutella. Uma combinação irresistível de cremosidade e avelã.',
    details:'🥛 Leite Ninho premium · 🌰 Nutella original · 🍫 Cobertura de chocolate branco belga · ✦ Feita sob encomenda',
    preco:  'R$ 7,50',
    wa:     'Ol%C3%A1%2C+gostaria+de+pedir+Ninho+com+Nutella!'
  },
  maracuja: {
    name:   'Maracujá',
    badge:  'Frutas · Refrescante',
    img:    'https://storage.googleapis.com/runable-templates/cli-uploads%2FHj5H0xeHR7muk4oAt3jaNMfeFfhhA20e%2FnKYq7YZPN9xIsYIHDdCzj%2Fartisan-chocolate-bonbon-close-up-photography-premium_1.jpg',
    desc:   'Cobertura de chocolate branco com recheio aveludado de maracujá natural. O equilíbrio perfeito entre o doce e o azedinho.',
    details:'🍋 Polpa de maracujá natural · 🍫 Chocolate branco belga · 🌿 Sem essências artificiais · ✦ Colheita sazonal',
    preco:  'R$ 6,50',
    wa:     'Ol%C3%A1%2C+gostaria+de+pedir+Trufa+de+Maracuj%C3%A1!'
  },
  prestigio: {
    name:   'Prestígio',
    badge:  'Clássico · Novo sabor',
    img:    'https://storage.googleapis.com/runable-templates/cli-uploads%2FHj5H0xeHR7muk4oAt3jaNMfeFfhhA20e%2FWSm3rJq36SEOryTGQDbf3%2Fartisan-chocolate-bonbon-close-up-photography-premium_7.jpg',
    desc:   'Cobertura de chocolate amargo 54% cacau com recheio de coco fresco levemente adocicado. Sofisticação em cada mordida.',
    details:'🥥 Coco fresco ralado · 🍫 Chocolate amargo 54% cacau · 🌾 Açúcar demerara · ✦ Receita exclusiva',
    preco:  'R$ 6,50',
    wa:     'Ol%C3%A1%2C+gostaria+de+pedir+Trufa+Prest%C3%ADgio!'
  },
  limao: {
    name:   'Limão Siciliano',
    badge:  'Frutas · Refrescante',
    img:    'https://storage.googleapis.com/runable-templates/cli-uploads%2FHj5H0xeHR7muk4oAt3jaNMfeFfhhA20e%2FtU7uqcGeCcMFr8jkhaUMk%2Ftrufas-artesanais-bombons-premium-photography-chocolate_8.jpg',
    desc:   'Cobertura de chocolate branco com ganache cremosa de limão siciliano. Refrescante, elegante e perfumada.',
    details:'🍋 Limão Siciliano orgânico · 🍫 Chocolate branco belga · 🥛 Creme de leite fresco · ✦ Aroma natural',
    preco:  'R$ 6,50',
    wa:     'Ol%C3%A1%2C+gostaria+de+pedir+Trufa+de+Lim%C3%A3o!'
  },
  ferrero: {
    name:   'Ferrero Especial',
    badge:  'Premium · Coleção especial',
    img:    'https://storage.googleapis.com/runable-templates/cli-uploads%2FHj5H0xeHR7muk4oAt3jaNMfeFfhhA20e%2Fv4rYDF2w8R-W3Ac8Ey2Ee%2Fartisan-chocolate-bonbon-close-up-photography-premium_4.jpg',
    desc:   'Trufa de chocolate ao leite com avelã inteira no centro, coberta de granulado crocante. Inspirada no clássico italiano — porém artesanal.',
    details:'🌰 Avelã torrada inteira · 🍫 Chocolate ao leite 45% cacau · 🌾 Granulado crocante importado · ✦ Edição especial',
    preco:  'R$ 8,50',
    wa:     'Ol%C3%A1%2C+gostaria+de+pedir+Trufa+Ferrero+Especial!'
  }
};

function openModal(key) {
  const p = products[key];
  if (!p) return;
  document.getElementById('modalImg').src  = p.img;
  document.getElementById('modalImg').alt  = p.name;
  document.getElementById('modalBadge').textContent  = p.badge;
  document.getElementById('modalTitle').textContent  = p.name;
  document.getElementById('modalDesc').textContent   = p.desc;
  document.getElementById('modalDetails').textContent = p.details;
  document.getElementById('modalPreco').innerHTML    = p.preco + ' <small>/un</small>';
  document.getElementById('modalWA').href = `https://wa.me/5500000000000?text=${p.wa}`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Expose openModal globally (called from inline onclick)
window.openModal = openModal;

/* ─── Smooth parallax on hero image ─── */
const heroImg = document.querySelector('.hero-img');
if (heroImg && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroImg.style.transform = `scale(1.05) translateY(${scrollY * 0.22}px)`;
  }, { passive: true });
}

/* ─── Active nav link on scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── Micro-animation: product cards hover tilt ─── */
document.querySelectorAll('.produto-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── Number counter animation (hero badges) ─── */
function animateValue(el, start, end, duration) {
  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    el.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
