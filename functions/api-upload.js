export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    
    // Obtenemos el archivo desde el formulario
    const formData = await request.formData();
    const file = formData.get('evento');
    
    if (!file) {
      return new Response(JSON.stringify({ error: "No se envió ningún archivo" }), { status: 400 });
    }

    // Nombre único para el archivo
    const extension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`;
    
    // Preparamos la conexión segura a R2 usando las variables de entorno
    const { AwsClient } = await import('https://esm.sh/aws4fetch');
    const r2 = new AwsClient({
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    });

    const url = `${env.R2_ENDPOINT}/lucila-eventos/${fileName}`;

    // Subimos el archivo al bucket
    const response = await r2.fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      }
    });

    if (!response.ok) throw new Error("Error al subir a R2");

    // Devolvemos la URL pública de la imagen
    const publicUrl = `https://pub-d182bdd53c7046c4b6ea9c329c2381a4.r2.dev/${fileName}`;
    
    return new Response(JSON.stringify({ success: true, url: publicUrl }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
