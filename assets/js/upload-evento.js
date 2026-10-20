document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const fileInput = document.getElementById('evento-file');
    const feedback = form.querySelector('.form-feedback');
    // Buscamos el botón por su ID para evitar conflictos
    const submitBtn = document.getElementById('btn-submit'); 

    // Validación del archivo
    if (!fileInput.files || fileInput.files.length === 0) {
      feedback.style.color = 'red';
      feedback.textContent = 'Por favor, selecciona una imagen antes de enviar.';
      return;
    }

    // Bloquear botón
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Subiendo...';
    feedback.textContent = '';

    const formData = new FormData();
    formData.append('evento', fileInput.files[0]);

    try {
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
      feedback.style.color = 'red';
      feedback.textContent = 'Error: ' + error.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});