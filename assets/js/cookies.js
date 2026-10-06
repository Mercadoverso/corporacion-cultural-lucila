/**
 * CORPORACIÓN CULTURAL LUCILA — cookies.js
 * Gestión de consentimiento con banner + modal configurable.
 * @license MIT
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'cc_lucila_consent_v1';
  const MAX_DAYS = 365;

  const banner = document.getElementById('cookie-banner');
  const modal = document.getElementById('cookie-modal');

  // ---- DIAGNÓSTICO ----
  if (!banner) {
    console.warn('[Cookies] No se encontró #cookie-banner en el HTML.');
    return;
  }
  if (!modal) {
    console.warn('[Cookies] No se encontró #cookie-modal en el HTML.');
  }

  // ---- Persistencia ----
  const setCookie = (name, value, days) => {
    const d = new Date(Date.now() + days * 864e5);
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax${secure}`;
  };

  const save = (c) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch (_) {}
    setCookie('cookie_consent', JSON.stringify(c), MAX_DAYS);
    document.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: c }));
  };

  const read = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
    catch (_) { return null; }
  };

  // ---- Mostrar / ocultar banner ----
  const showBanner = () => {
    banner.hidden = false;
    banner.removeAttribute('hidden');       // redundancia por si acaso
    banner.style.display = '';              // limpia cualquier display previo
  };
  const hideBanner = () => {
    banner.hidden = true;
    banner.style.display = 'none';
  };

  // ---- Estado inicial ----
  const existing = read();
  if (!existing) {
    showBanner();
  } else {
    hideBanner();
    document.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: existing }));
  }

  // ---- Helpers del modal ----
  const getSelected = () => {
    const c = { essential: true };
    if (!modal) return c;
    modal.querySelectorAll('input[data-cookie-category]').forEach((cb) => {
      c[cb.dataset.cookieCategory] = cb.checked;
    });
    return c;
  };

  const apply = (c) => {
    save({
      essential: true,
      analytics: !!c.analytics,
      preferences: !!c.preferences,
      marketing: !!c.marketing,
      timestamp: new Date().toISOString(),
      version: 1
    });
    hideBanner();
    if (modal && modal.open) modal.close();
  };

  const openModal = () => {
    if (!modal) return;
    const cur = read();
    modal.querySelectorAll('input[data-cookie-category]').forEach((cb) => {
      cb.checked = cur ? !!cur[cb.dataset.cookieCategory] : false;
    });
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  };

  const closeModal = () => {
    if (modal && modal.open) modal.close();
    else if (modal) modal.removeAttribute('open');
  };

  // ---- Delegación de eventos ----
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-cookie-action]');
    if (!trigger) return;

    const action = trigger.dataset.cookieAction;
    switch (action) {
      case 'accept':
        apply({ analytics: true, preferences: true, marketing: true });
        break;
      case 'reject':
        apply({ analytics: false, preferences: false, marketing: false });
        break;
      case 'config':
        openModal();
        break;
      case 'save':
        apply(getSelected());
        break;
      case 'close':
        closeModal();
        break;
    }
  });

  // Cerrar modal al hacer click en el backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      const r = modal.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) closeModal();
    });
  }

  // ---- Fallback de seguridad: si por alguna razón el banner está oculto con CSS ----
  window.addEventListener('load', () => {
    if (!read() && banner.hidden) {
      showBanner();
    }
  });
})();