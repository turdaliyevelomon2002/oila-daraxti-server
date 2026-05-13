const { createClient } = require('@supabase/supabase-js');

let client = null;

function getClient() {
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return client;
}

async function uploadFile(buffer, originalName, mimetype) {
  const ext = originalName.split('.').pop().toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

  const { error } = await getClient().storage
    .from('uploads')
    .upload(filename, buffer, { contentType: mimetype, upsert: false });

  if (error) throw new Error('Storage xatosi: ' + error.message);

  const { data } = getClient().storage.from('uploads').getPublicUrl(filename);
  return data.publicUrl;
}

module.exports = { uploadFile };
