/**
 * CORPORACIÓN CULTURAL LUCILA — Manejo de formularios
 * Validación cliente + honeypot + mensajes accesibles
 * @license MIT
 */
(() => {
  'use strict';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const showFeedback = (form, message, type = 'success') => {
    const el = form.querySelector('.form-feedback');
    if (!el) return;
    el.textContent = message;
    el.classList.remove('success', 'error');
    el.classList.add(type);
  };

  const isHoneypotFilled = (form) => {
    const hp = form.querySelector('input[name="website"]');
    return hp && hp.value.trim() !== '';
  };

  // -------- Formulario de contacto --------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (isHoneypotFilled(contactForm)) return; // bot detectado

      const nombre = contactForm.nombre.value.trim();
      const correo = contactForm.correo.value.trim();
      const mensaje = contactForm.mensaje.value.trim();
      const privacidad = contactForm.privacidad.checked;

      if (nombre.length < 2) {
        return showFeedback(contactForm, 'Por favor ingresa tu nombre completo.', 'error');
      }
      if (!EMAIL_RE.test(correo)) {
        return showFeedback(contactForm, 'Ingresa un correo electrónico válido.', 'error');
      }
      if (mensaje.length < 10) {
        return showFeedback(contactForm, 'El mensaje debe tener al menos 10 caracteres.', 'error');
      }
      if (!privacidad) {
        return showFeedback(contactForm, 'Debes aceptar la Política de Privacidad.', 'error');
      }

      // NOTA: en producción reemplazar por fetch() a un backend real con CSRF token.
      showFeedback(
        contactForm,
        '✓ Mensaje enviado. Nos pondremos en contacto a la brevedad.',
        'success'
      );
      contactForm.reset();
    });
  }

  // -------- Formulario de subida de flyer --------
  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    const ALLOWED = ['image/png', 'image/jpeg', 'image/webp'];

    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const file = uploadForm.querySelector('input[type="file"]').files[0];

      if (!file) {
        return showFeedback(uploadForm, 'Selecciona un archivo para continuar.', 'error');
      }
      if (!ALLOWED.includes(file.type)) {
        return showFeedback(uploadForm, 'Formato no permitido. Usa JPG, PNG o WebP.', 'error');
      }
      if (file.size > MAX_SIZE) {
        return showFeedback(uploadForm, 'El archivo excede los 5 MB.', 'error');
      }

      showFeedback(
        uploadForm,
        '✓ Archivo cargado con éxito. El comité de difusión lo revisará.',
        'success'
      );
      uploadForm.reset();
    });
  }
})();