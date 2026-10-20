document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Detiene la recarga de la página
    
    const fileInput = document.getElementById('evento-file');
    const feedback = form.querySelector('.form-feedback');
    const submitBtn = form.querySelector('button[type="submit"]');

    // 1. Validación real del archivo
    if (!fileInput.files || fileInput.files.length === 0) {
      feedback.style.color = 'var(--red)';
      feedback.textContent = 'Por favor, selecciona una imagen antes de enviar.';
      return;
    }

    // 2. Bloquear botón mientras sube
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Subiendo...';
    feedback.textContent = '';

    const formData = new FormData();
    formData.append('evento', fileInput.files[0]);

    try {
      // 3. Enviar a Cloudflare
      const response = await fetch('/api-upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        feedback.style.color = 'green';
        feedback.textContent = '¡Afiche subido con éxito!';
        form.reset();
      } else {
        throw new Error(result.error || 'Error al subir');
      }
    } catch (error) {
      feedback.style.color = 'var(--red)';
      feedback.textContent = 'Error: ' + error.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar';
    }
  });
});