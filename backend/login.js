require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET_NAME = 'vault';

let lastSearchResults = [];

// ========== DOCTOR SEARCH ==========
app.post('/input/search', async (req, res) => {
  const { specialty, location } = req.body;

  try {
    let query = supabase.from('doctors').select('*');

    if (specialty) {
      query = query.ilike('specialization', `%${specialty}%`);
    }
    if (location) {
      query = query.or(`address.ilike.%${location}%,clinic_address.ilike.%${location}%`);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    lastSearchResults = data;
    res.json({ message: 'Search successful' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/output/search', (req, res) => {
  res.json({ doctors: lastSearchResults });
});

// ========== APPOINTMENT BOOKING ==========
app.post('/appointments/book', async (req, res) => {
  const {
    doctor_id, patient_id, appointment_date, appointment_time,
    status, reason, notes
  } = req.body;

  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ doctor_id, patient_id, appointment_date, appointment_time, status, reason, notes }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({ message: 'Appointment booked', appointment: data });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== VAULT FILE UPLOAD ==========
app.post('/upload', upload.single('file'), async (req, res) => {
  const { type, prescribedAt } = req.body;
  const file = req.file;

  if (!file || !prescribedAt) return res.status(400).json({ error: 'Missing file or timestamp' });

  const extension = path.extname(file.originalname);
  const storagePath = `${uuidv4()}${extension}`;
  const buffer = fs.readFileSync(file.path);

  const { error: uploadError } = await supabase
    .storage
    .from(BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (uploadError) return res.status(500).json({ error: 'Upload failed' });
  console.log(uploadError)
  const { error: dbError } = await supabase
    .from('vault')
    .insert([{
      name: file.originalname,
      type,
      file_path: storagePath,
      prescribed_at: new Date(prescribedAt).toISOString()
    }]);

  fs.unlinkSync(file.path);
  if (dbError) return res.status(500).json({ error: 'Metadata insert failed' });

  res.json({ message: 'Uploaded successfully' });
});

// ========== VAULT FILE LIST ==========
app.get('/files', async (req, res) => {
  const { data, error } = await supabase
    .from('vault')
    .select('*')
    .order('prescribed_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Fetch failed' });

  const signedUrls = await Promise.all(
    data.map(async (file) => {
      const { data: signed } = await supabase
        .storage
        .from(BUCKET_NAME)
        .createSignedUrl(file.file_path, 3600);

      return { ...file, url: signed?.signedUrl || '' };
    })
  );

  res.json({ files: signedUrls });
});

// ========== VAULT FILE DELETE ==========
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error: fetchError } = await supabase
    .from('vault')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !data) return res.status(404).json({ error: 'File not found' });

  await supabase.storage.from(BUCKET_NAME).remove([data.file_path]);
  await supabase.from('vault').delete().eq('id', id);

  res.json({ message: 'Deleted successfully' });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
