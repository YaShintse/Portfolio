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