import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create uploads directory if it doesn't exist
    const publicDir = fileURLToPath(new URL('../../public', import.meta.url));
    const uploadsDir = join(publicDir, 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const filepath = join(uploadsDir, filename);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filepath, buffer);

    // Return the URL to the uploaded file
    return new Response(
      JSON.stringify({ 
        url: `/uploads/${filename}`,
        title: file.name
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to upload file' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
