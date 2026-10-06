/**
 * CORPORACIÓN CULTURAL LUCILA — Script principal
 * Menú móvil, navbar dinámico, año del footer
 * @license MIT
 */
(() => {
  'use strict';

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // -------- Menú hamburguesa --------
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
    });

    // Cierra el menú al hacer click en cualquier enlace
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Cierra con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  // -------- Sombra del navbar al hacer scroll --------
  if (navbar) {
    const onScroll = () => {
      navbar.style.boxShadow =
        window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.06)' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // -------- Año dinámico en el footer --------
  const yearEl = document.querySelector('.footer-bottom [data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();