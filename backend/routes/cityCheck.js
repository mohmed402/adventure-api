import express from 'express';
import supabase from '../supabaseClient.js';
import { getJson } from 'serpapi';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const SERPAPI_KEY = process.env.SERPAPI_KEY;

router.get('/check/:cityName', async (req, res) => {
  const cityName = req.params.cityName;

  try {
    // Check if the city exists in Supabase
    const { data: city, error } = await supabase
      .from('cities')
      .select('*')
      .eq('name', cityName)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: 'Failed to query city database' });
    }

    if (city) {
      return res.json({ source: 'database', data: city });
    }

    // Fetch city data via SerpAPI
    getJson({
      engine: 'google_local',
      api_key: SERPAPI_KEY,
      q: `things to do in ${cityName}`,
      location: cityName,
    }, (data) => {
      if (data.error) {
        console.error('SerpAPI error:', data.error);
        return res.status(500).json({ error: data.error });
      }

      const results = data.local_results || [];
      const imageUrls = results
        .filter(p => typeof p.thumbnail === 'string' && p.thumbnail.startsWith('http'))
        .map(p => p.thumbnail);

      const responsePayload = {
        location_id: null,
        raw: {
          places: results,
          imageUrls,
        }
      };

      return res.json({ source: 'api', data: responsePayload });
    });

  } catch (err) {
    console.error('City check error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
