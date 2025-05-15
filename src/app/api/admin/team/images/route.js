// /app/api/admin/team/images/route.js
import supabaseAdmin from '@/lib/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const body = await req.json();
    const { file, fileName, fileType } = body;

    if (!file || !fileName) {
      return new Response(JSON.stringify({ error: 'Missing file or filename' }), { status: 400 });
    }

    const buffer = Buffer.from(file, 'base64');
    const uniqueName = `${Date.now()}-${uuidv4()}-${fileName}`;

    const { error } = await supabaseAdmin.storage
      .from('team-media')
      .upload(uniqueName, buffer, {
        contentType: fileType || 'image/jpeg',
      });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const publicUrl = supabaseAdmin
      .storage
      .from('team-media')
      .getPublicUrl(uniqueName).data.publicUrl;

    return new Response(JSON.stringify({ publicUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Upload error:', err);
    return new Response(JSON.stringify({ error: 'Unexpected server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
