require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

let lastSearchResults = [];

// POST /input/search — triggers the query
app.post('/input/search', async (req, res) => {
  const { specialty, location } = req.body;

  try {
    let query = supabase.from('doctors').select('*');

    if (specialty) query = query.ilike('specialty', `%${specialty}%`);
    if (location) query = query.ilike('location', `%${location}%`);

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: 'Database query failed' });
    }

    lastSearchResults = data;
    return res.json({ message: 'Search data stored successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /output/search — returns the last result
app.get('/output/search', (req, res) => {
  res.json({ doctors: lastSearchResults });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
