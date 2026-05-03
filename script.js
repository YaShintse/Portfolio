// Language Toggle Functionality
let currentLang = 'en';

const langToggle = document.getElementById('langToggle');

langToggle.addEventListener('click', () => {
    // Toggle between languages
    currentLang = currentLang === 'en' ? 'fr' : 'en';
    
    // Update button text
    langToggle.textContent = currentLang === 'en' ? 'FR' : 'EN';
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'fr';
    
    // Update all elements with translation data
    const elementsToTranslate = document.querySelectorAll('[data-en][data-fr]');
    
    elementsToTranslate.forEach(element => {
        const translation = element.getAttribute(`data-${currentLang}`);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Save preference to localStorage
    localStorage.setItem('preferredLang', currentLang);
});

// Load saved language preference on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang');
    
    if (savedLang && savedLang !== currentLang) {
        // Simulate button click to apply saved language
        langToggle.click();
    }
});

// Smooth scrolling for navigation links — with header offset
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 70;
            const offset = 24; // extra breathing room
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── PARTICLE CANVAS PREVIEW ──
(function() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], raf;
    const N = 120;
    const SHAPES = ['heart', 'galaxy', 'dna', 'torus'];
    let shapeIdx = 0, t = 0, morphT = 0, morphing = false, nextTargets = [];

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        W = canvas.width  = rect.width  || 320;
        H = canvas.height = rect.height || 200;
    }
    function heartPos(i, n) {
        const a = (i / n) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(a), 3);
        const y = -(13 * Math.cos(a) - 5 * Math.cos(2*a) - 2 * Math.cos(3*a) - Math.cos(4*a));
        return { x: W/2 + x * (W * 0.028), y: H/2 + y * (H * 0.028) };
    }
    function galaxyPos(i, n) {
        const r = (i / n) * (Math.min(W,H) * 0.38);
        const a = (i / n) * Math.PI * 8;
        return { x: W/2 + Math.cos(a) * r, y: H/2 + Math.sin(a) * r * 0.5 };
    }
    function dnaPos(i, n) {
        const tt = (i / n) * Math.PI * 4;
        const strand = i % 2 === 0 ? 1 : -1;
        return { x: W/2 + Math.cos(tt) * strand * (W * 0.22), y: H * 0.12 + (i / n) * H * 0.76 };
    }
    function torusPos(i, n) {
        const a = (i / n) * Math.PI * 2;
        const R = Math.min(W,H) * 0.26, r2 = Math.min(W,H) * 0.1;
        const b = (i / n) * Math.PI * 14;
        return { x: W/2 + (R + r2 * Math.cos(b)) * Math.cos(a), y: H/2 + (R + r2 * Math.cos(b)) * Math.sin(a) * 0.5 };
    }
    function getTarget(i, shape) {
        switch(shape) {
            case 'heart':  return heartPos(i, N);
            case 'galaxy': return galaxyPos(i, N);
            case 'dna':    return dnaPos(i, N);
            case 'torus':  return torusPos(i, N);
            default:       return heartPos(i, N);
        }
    }
    function init() {
        resize();
        particles = [];
        for (let i = 0; i < N; i++) {
            const p = getTarget(i, SHAPES[shapeIdx]);
            particles.push({ x: p.x, y: p.y, tx: p.x, ty: p.y,
                hue: 260 + (i / N) * 80, size: 1.2 + Math.random() * 1.2,
                phase: Math.random() * Math.PI * 2 });
        }
    }
    function ease(x) { return x < 0.5 ? 2*x*x : 1 - Math.pow(-2*x+2,2)/2; }
    let shapeTimer = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        t += 0.016; shapeTimer += 0.016;
        if (!morphing && shapeTimer > 2.5) {
            shapeTimer = 0; morphing = true; morphT = 0;
            shapeIdx = (shapeIdx + 1) % SHAPES.length;
            nextTargets = particles.map((_, i) => getTarget(i, SHAPES[shapeIdx]));
        }
        if (morphing) {
            morphT = Math.min(morphT + 0.022, 1);
            const e = ease(morphT);
            particles.forEach((p, i) => {
                p.tx = nextTargets[i].x; p.ty = nextTargets[i].y;
                p.x += (p.tx - p.x) * e * 0.12;
                p.y += (p.ty - p.y) * e * 0.12;
            });
            if (morphT >= 1) morphing = false;
        } else {
            particles.forEach(p => { p.x += (p.tx - p.x) * 0.04; p.y += (p.ty - p.y) * 0.04; });
        }
        particles.forEach(p => {
            const pulse = Math.sin(t * 1.5 + p.phase) * 0.3 + 0.7;
            const alpha = 0.6 + pulse * 0.4;
            const size  = p.size * (0.8 + pulse * 0.4);
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${alpha})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = `hsla(${p.hue}, 90%, 70%, 0.6)`;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        raf = requestAnimationFrame(draw);
    }
    const card = canvas.closest('.project-card');
    if (!card) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { if (!raf) { init(); draw(); } }
            else { cancelAnimationFrame(raf); raf = null; }
        });
    }, { threshold: 0.1 });
    observer.observe(card);
    window.addEventListener('resize', () => { resize(); init(); });
})();
