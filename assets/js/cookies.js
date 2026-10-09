/**
 * CORPORACIÓN CULTURAL LUCILA — cookies.js
 * v3.0 · Manejo correcto del dialog con showModal + delegación captura
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'cc_lucila_consent_v1';
  const MAX_DAYS = 365;

  const banner = document.getElementById('cookie-banner');
  const modal = document.getElementById('cookie-modal');

  console.log('[Cookies] Banner:', !!banner, '| Modal:', !!modal);
  console.log('[Cookies] Soporte showModal:', modal && typeof modal.showModal === 'function');

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
    document.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: existing }));
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
    closeModal();
  };

  const openModal = () => {
    if (!modal) return;
    const cur = read();
    modal.querySelectorAll('input[data-cookie-category]').forEach((cb) => {
      cb.checked = cur ? !!cur[cb.dataset.cookieCategory] : false;
    });

    // 🔑 CLAVE: usar showModal(), no show()
    try {
      modal.showModal();
      console.log('[Cookies] showModal() ejecutado');
    } catch (err) {
      console.error('[Cookies] showModal falló:', err);
      modal.setAttribute('open', '');
    }

    // Verificar que realmente quedó abierto en modo modal
    setTimeout(() => {
      console.log('[Cookies] modal.open =', modal.open);
      console.log('[Cookies] ::backdrop activo =', !!(modal.matches && modal.matches(':modal')));
    }, 50);
  };

  const closeModal = () => {
    if (!modal) return;
    if (modal.open) {
      modal.close();
      console.log('[Cookies] close() ejecutado');
    } else {
      modal.removeAttribute('open');
    }
  };

  // ---- Delegación de eventos en captura ----
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-cookie-action]');
    if (!trigger) return;

    const action = trigger.dataset.cookieAction;
    console.log('[Cookies] Acción:', action);

    switch (action) {
      case 'accept': e.preventDefault(); apply({ analytics: true,  preferences: true,  marketing: true  }); break;
      case 'reject': e.preventDefault(); apply({ analytics: false, preferences: false, marketing: false }); break;
      case 'config': e.preventDefault(); openModal(); break;
      case 'save':   e.preventDefault(); apply(getSelected()); break;
      case 'close':  e.preventDefault(); closeModal(); break;
    }
  }, true);

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.open) {
      closeModal();
    }
  });

  // Cerrar al hacer clic en el backdrop (fuera del contenido)
  if (modal) {
    modal.addEventListener('click', (e) => {
      // Si el click fue directamente en el dialog (no en un hijo), cerrar
      if (e.target === modal) {
        closeModal();
      }
    });
  }
})();