/**
 * CORPORACIÓN CULTURAL LUCILA — cookies.js
 * v4.0 · Cierre explícito del modal garantizado
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'cc_lucila_consent_v1';
  const MAX_DAYS = 365;

  const banner = document.getElementById('cookie-banner');
  const modal = document.getElementById('cookie-modal');

  console.log('[Cookies] Banner:', !!banner, '| Modal:', !!modal);

  if (!banner) {
    console.warn('[Cookies] No se encontró #cookie-banner.');
    return;
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
    console.log('[Cookies] Guardado:', c);
  };

  const read = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
    catch (_) { return null; }
  };

  // ---- Banner ----
  const showBanner = () => {
    banner.hidden = false;
    banner.removeAttribute('hidden');
    banner.style.display = '';
  };

  const hideBanner = () => {
    banner.hidden = true;
    banner.style.display = 'none';
  };

  const existing = read();
  if (!existing) {
    showBanner();
  } else {
    hideBanner();
  }

  // ---- Modal ----
  const getSelected = () => {
    const c = { essential: true };
    if (!modal) return c;
    modal.querySelectorAll('input[data-cookie-category]').forEach((cb) => {
      c[cb.dataset.cookieCategory] = cb.checked;
    });
    return c;
  };

  const closeModal = () => {
    if (!modal) return;
    try {
      if (modal.open) {
        modal.close('closed-by-user');
        console.log('[Cookies] close() ejecutado');
      } else {
        modal.removeAttribute('open');
        console.log('[Cookies] removeAttribute(open) ejecutado');
      }
    } catch (err) {
      console.error('[Cookies] error al cerrar:', err);
    }
  };

  const openModal = () => {
    if (!modal) return;
    const cur = read();
    modal.querySelectorAll('input[data-cookie-category]').forEach((cb) => {
      cb.checked = cur ? !!cur[cb.dataset.cookieCategory] : false;
    });
    try {
      modal.showModal();
      console.log('[Cookies] showModal() ejecutado');
    } catch (err) {
      console.error('[Cookies] showModal falló:', err);
      modal.setAttribute('open', '');
    }
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
    closeModal();   // ← 🔑 CIERRE EXPLÍCITO
  };

  // ---- Delegación de eventos ----
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-cookie-action]');
    if (!trigger) return;

    const action = trigger.dataset.cookieAction;
    console.log('[Cookies] Acción:', action);

    // Prevenir el comportamiento por defecto del botón (por si acaso)
    e.preventDefault();
    e.stopPropagation();

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
  }, true);

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.open) {
      closeModal();
    }
  });

  // Cerrar al hacer clic en el backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
})();