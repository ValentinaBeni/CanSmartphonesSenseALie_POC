const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    const closeMenu = () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Apri il menu');
        menuToggle.textContent = '\u2630';
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');

        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Chiudi il menu' : 'Apri il menu');
        menuToggle.textContent = isOpen ? '\u2715' : '\u2630';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            menuToggle.focus();
        }
    });
}
