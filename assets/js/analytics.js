/**
 * CORPORACIÓN CULTURAL LUCILA — Carga condicional de analytics
 * Solo se activa si el usuario otorgó consentimiento de análisis.
 * @license MIT
 */
(() => {
  'use strict';

  const loadAnalytics = () => {
    // Aquí va el snippet real de Google Analytics / Plausible / Umami
    // Ejemplo (no ejecutado hasta tener consentimiento):
    //
    // const s = document.createElement('script');
    // s.async = true;
    // s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
    // document.head.appendChild(s);
    //
    console.info('[Analytics] Consentimiento otorgado — cargando métricas.');
  };

  document.addEventListener('cookieConsentChanged', (e) => {
    if (e.detail && e.detail.analytics === true) {
      loadAnalytics();
    }
  });
})();