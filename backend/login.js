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
  const { type, prescribedAt, userId } = req.body;
  const file = req.file;

  if (!file || !prescribedAt || !userId) {
    return res.status(400).json({ error: 'Missing file, timestamp, or userId' });
  }

  try {
    const extension = path.extname(file.originalname);
    const storagePath = `${uuidv4()}${extension}`;
    const buffer = fs.readFileSync(file.path);

    // Upload file to storage
    const { error: uploadError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      fs.unlinkSync(file.path);
      return res.status(500).json({ error: `Upload failed: ${uploadError.message}` });
    }

    // Insert metadata into database
    const { error: dbError } = await supabase
      .from('vault')
      .insert([{
        name: file.originalname,
        type,
        file_path: storagePath,
        prescribed_at: new Date(prescribedAt).toISOString(),
        user_id: userId
      }]);

    // Clean up temp file
    fs.unlinkSync(file.path);

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Try to clean up the uploaded file if database insert fails
      await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
      return res.status(500).json({ error: `Metadata insert failed: ${dbError.message}` });
    }

    res.json({ message: 'Uploaded successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    // Clean up temp file if it exists
    if (file && file.path) {
      try {
        fs.unlinkSync(file.path);
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }
    }
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// ========== VAULT FILES BY USER (FOR DOCTOR ACCESS) ==========
app.get('/files/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data, error } = await supabase
      .from('vault')
      .select('*')
      .eq('user_id', userId)
      .order('prescribed_at', { ascending: false });

    if (error) {
      console.error('Database fetch error:', error);
      return res.status(500).json({ error: `Fetch failed: ${error.message}` });
    }

    // Generate signed URLs for each file
    const signedUrls = await Promise.all(
      data.map(async (file) => {
        try {
          const { data: signed, error: signedError } = await supabase
            .storage
            .from(BUCKET_NAME)
            .createSignedUrl(file.file_path, 3600);

          if (signedError) {
            console.error('Signed URL error for file:', file.id, signedError);
            return { ...file, url: '' };
          }

          return { ...file, url: signed?.signedUrl || '' };
        } catch (err) {
          console.error('Signed URL generation error for file:', file.id, err);
          return { ...file, url: '' };
        }
      })
    );

    res.json({ files: signedUrls });
  } catch (err) {
    console.error('Files fetch error:', err);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// ========== VAULT FILE LIST ==========
app.get('/files', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vault')
      .select('*')
      .order('prescribed_at', { ascending: false });

    if (error) {
      console.error('Database fetch error:', error);
      return res.status(500).json({ error: `Fetch failed: ${error.message}` });
    }

    // Generate signed URLs for each file
    const signedUrls = await Promise.all(
      data.map(async (file) => {
        try {
          const { data: signed, error: signedError } = await supabase
            .storage
            .from(BUCKET_NAME)
            .createSignedUrl(file.file_path, 3600);

          if (signedError) {
            console.error('Signed URL error for file:', file.id, signedError);
            return { ...file, url: '' };
          }

          return { ...file, url: signed?.signedUrl || '' };
        } catch (err) {
          console.error('Signed URL generation error for file:', file.id, err);
          return { ...file, url: '' };
        }
      })
    );

    res.json({ files: signedUrls });
  } catch (err) {
    console.error('Files fetch error:', err);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// ========== VAULT FILE DELETE ==========
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Get file info from database
    const { data, error: fetchError } = await supabase
      .from('vault')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !data) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove([data.file_path]);
    if (storageError) {
      console.error('Storage delete error:', storageError);
    }

    // Delete from database
    const { error: deleteError } = await supabase.from('vault').delete().eq('id', id);
    if (deleteError) {
      console.error('Database delete error:', deleteError);
      return res.status(500).json({ error: `Delete failed: ${deleteError.message}` });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
