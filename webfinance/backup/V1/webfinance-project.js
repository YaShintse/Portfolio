/* =====================================================
   PROJET R — Project Page · JS
   ===================================================== */

// ─── LIGHTBOX ───
function openLightbox(el) {
    const img = el.querySelector('img');
    if (!img) return;
    document.getElementById('lightboxImg').src = img.src;
    document.getElementById('lightbox').classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
});

// ─── LANGUAGE TOGGLE ───
let currentLang = 'en';
const langToggle = document.getElementById('langToggle');

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'fr' : 'en';
    langToggle.textContent = currentLang === 'en' ? 'FR' : 'EN';
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-en][data-fr]').forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });
    localStorage.setItem('preferredLang', currentLang);
});

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('preferredLang');
    if (saved && saved !== currentLang) langToggle.click();
});

// ─── SCROLL REVEAL ───
(function () {
    const els = document.querySelectorAll('.fade-up');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
            else e.target.classList.remove('visible');
        });
    }, { threshold: 0.08 });
    els.forEach(el => io.observe(el));
})();

// ─── 3D CUBE — drag to rotate ───
(function () {
    const scene = document.getElementById('scene3d');
    const cube  = document.getElementById('cube');
    if (!scene || !cube) return;

    let rotX = -20, rotY = 30;
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let velX = 0, velY = 0;
    let rafId = null;

    // Auto-rotate when idle
    let idleTimer = null;
    let autoRotate = true;

    function applyTransform() {
        cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }

    function autoLoop() {
        if (autoRotate) {
            rotY += 0.4;
            applyTransform();
        }
        rafId = requestAnimationFrame(autoLoop);
    }

    function resetIdleTimer() {
        autoRotate = false;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => { autoRotate = true; }, 3000);
    }

    // Momentum decay after drag
    function applyMomentum() {
        if (!isDragging && (Math.abs(velX) > 0.05 || Math.abs(velY) > 0.05)) {
            rotY += velX;
            rotX -= velY;
            rotX = Math.max(-80, Math.min(80, rotX));
            velX *= 0.92;
            velY *= 0.92;
            applyTransform();
        }
    }

    // Merge momentum into auto loop
    cancelAnimationFrame(rafId);
    function loop() {
        if (autoRotate) {
            rotY += 0.35;
        } else {
            applyMomentum();
        }
        applyTransform();
        requestAnimationFrame(loop);
    }
    loop();

    // Mouse
    scene.addEventListener('mousedown', e => {
        isDragging = true;
        autoRotate = false;
        clearTimeout(idleTimer);
        lastX = e.clientX;
        lastY = e.clientY;
        velX = velY = 0;
        e.preventDefault();
    });

    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        velX = dx * 0.5;
        velY = dy * 0.5;
        rotY += dx * 0.5;
        rotX -= dy * 0.5;
        rotX = Math.max(-80, Math.min(80, rotX));
        lastX = e.clientX;
        lastY = e.clientY;
        applyTransform();
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        resetIdleTimer();
    });

    // Touch
    scene.addEventListener('touchstart', e => {
        isDragging = true;
        autoRotate = false;
        clearTimeout(idleTimer);
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        velX = velY = 0;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - lastX;
        const dy = e.touches[0].clientY - lastY;
        velX = dx * 0.5;
        velY = dy * 0.5;
        rotY += dx * 0.5;
        rotX -= dy * 0.5;
        rotX = Math.max(-80, Math.min(80, rotX));
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        applyTransform();
    }, { passive: true });

    window.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        resetIdleTimer();
    });
})();
