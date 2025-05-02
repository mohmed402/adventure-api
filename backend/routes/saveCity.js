// backend/routes/saveCity.js

import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

router.post('/saveCity', async (req, res) => {
  const { name, mainImage, images, places, raw } = req.body;


  console.log("✅ Running saveCity with:", { name });

  if (!name || !mainImage || images.length === 0 || places.length === 0) {
    return res.status(400).json({ error: 'Missing required fields (name, mainImage, images, places)' });
  }

  try {
    // 1. Save city
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .insert([
        {
          name,
          raw,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (cityError) throw cityError;

    const cityId = cityData.id;
    console.log("📌 City inserted with ID:", cityId);

    // 2. Save images (main + others)
    const imageInserts = [
      {
        city_id: cityId,
        image_url: mainImage,
        index: 0,
        is_main: true
      },
      ...images.map((url, i) => ({
        city_id: cityId,
        image_url: url,
        index: i + 1,
        is_main: false
      }))
    ];

    const { error: imageError } = await supabase
      .from('city_images')
      .insert(imageInserts);

    if (imageError) throw imageError;

    // 3. Save places (things to do)
    const now = new Date().toISOString();
    const placeInserts = places.map((p, index) => ({
      city_id: cityId,
      title: p.title,
      address: p.address,
      thumbnail: p.thumbnail,
      index,
      created_at: now
    }));

    const { error: placeError } = await supabase
      .from('city_places')
      .insert(placeInserts);

    if (placeError) throw placeError;

    res.status(201).json({ message: '✅ City and related data saved successfully' });
  } catch (err) {
    console.error('❌ SaveCity Error:', err);
    res.status(500).json({ error: err.message || 'Failed to save city' });
  }
});

export default router;

