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
