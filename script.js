// ===== Mobile Nav =====
const burger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
burger?.addEventListener('click', () => {
  burger.classList.toggle('active');
  const expanded = burger.classList.contains('active');
  burger.setAttribute('aria-expanded', String(expanded));
  navLinks.classList.toggle('show');
});

// Close nav on link click (mobile)
navLinks?.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && navLinks.classList.contains('show')) {
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('show');
  }
});

// ===== Filters =====
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    cards.forEach(card => {
      const cats = (card.dataset.cat || '').split(' ');
      card.style.display = (f === 'all' || cats.includes(f)) ? '' : 'none';
    });
  });
});

// ===== Reveal on Scroll =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Tilt Effect on Cards (subtle 3D) =====
const tilts = document.querySelectorAll('.tilt');
tilts.forEach(el => {
  let rx = 0, ry = 0;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const px = (x / r.width) - 0.5;     // -0.5..0.5
    const py = (y / r.height) - 0.5;
    rx = (-py * 8); ry = (px * 10);     // rotate range
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    // pass mouse to CSS shine
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
  });
});

// ===== Lightbox (for images + explicit button video) =====
const lightbox = document.getElementById('lightbox');
const lbImg = document.querySelector('.lightbox__img');
const lbVid = document.querySelector('.lightbox__video');
const lbClose = document.querySelector('.lightbox__close');

function openLightbox({imgSrc=null, videoSrc=null}){
  if (imgSrc){
    lbVid.pause(); lbVid.removeAttribute('src'); lbVid.style.display = 'none';
    lbImg.src = imgSrc; lbImg.style.display = 'block';
  } else if (videoSrc){
    lbImg.removeAttribute('src'); lbImg.style.display = 'none';
    lbVid.src = videoSrc; lbVid.style.display = 'block'; lbVid.play();
  }
  lightbox.style.display = 'grid';
  lightbox.setAttribute('aria-hidden','false');
}

function closeLightbox(){
  lightbox.style.display = 'none';
  lightbox.setAttribute('aria-hidden','true');
  lbVid.pause();
}

lbClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e)=> { if(e.target === lightbox) closeLightbox(); });

// Image cards -> lightbox
document.querySelectorAll('.card__media img').forEach(img => {
  img.addEventListener('click', () => openLightbox({imgSrc: img.src}));
});

// Showreel button -> lightbox video
document.querySelectorAll('[data-open="#lightbox"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.getAttribute('data-video');
    openLightbox({videoSrc: src});
  });
});

// ===== Contact (demo handler) =====
function handleContact(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const msg = document.getElementById('formMsg');
  // TODO: integrate API or email service
  msg.textContent = `Thanks ${data.name}! We’ll reach out at ${data.email} shortly.`;
  form.reset();
  return false;
}
window.handleContact = handleContact;
