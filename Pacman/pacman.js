// ─── LIGHTBOX ───
function openLightbox(el) {
    const img = el.querySelector('img');
    if (!img) return; // placeholder mode — pas d'action
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

// Charger la langue sauvegardée au démarrage
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('preferredLang');
    if (saved && saved !== currentLang) langToggle.click();
});
