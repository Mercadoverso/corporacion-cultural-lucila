document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  if (!uploadForm) return;

  uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('evento-file');
    const feedback = uploadForm.querySelector('.form-feedback');
    const submitBtn = uploadForm.querySelector('button[type="submit"]');

    if (!fileInput.files.length) {
      feedback.style.color = 'var(--red)';
      feedback.textContent = 'Por favor, selecciona una imagen antes de enviar.';
      return;
    }

    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo...';
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
        feedback.textContent = '¡Afiche subido con éxito! Esperando aprobación.';
        uploadForm.reset();
        console.log("Imagen subida a:", result.url); 
      } else {
        throw new Error(result.error || 'Error al subir');
      }
    } catch (error) {
      feedback.style.color = 'var(--red)';
      feedback.textContent = 'Hubo un error al subir la imagen.';
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
});
