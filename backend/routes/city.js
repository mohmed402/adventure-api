// backend/routes/city.js
import express from 'express';
import fetch from 'node-fetch';
import { getJson } from 'serpapi';

import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// const TRIPADVISOR_KEY = process.env.TRIPADVISOR_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const WEATHER_KEY = process.env.WEATHER_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  },
};


router.get('/country-info/:country', async (req, res) => {
  const { country } = req.params;
  try {
    const url = `https://country-location-api.p.rapidapi.com/location?country=${country}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'country-location-api.p.rapidapi.com',
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching country info' });
  }
});

router.get('/flag/:country', async (req, res) => {
  const { country } = req.params;
  try {
    const url = `https://rest-countries10.p.rapidapi.com/country/${country}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'rest-countries10.p.rapidapi.com',
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching country flag' });
  }
});

router.get('/weather', async (req, res) => {
  const { city, countryCode } = req.query;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&units=metric&appid=${WEATHER_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});


router.get('/thingsToDo', (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing query' });
  
    getJson({
        engine: "google_local",
        api_key: process.env.SERPAPI_KEY,
        q: `things to do in ${q}`,
        location: q,
      }, (data) => {
        if (data.error) {
          console.error("SerpAPI error:", data.error);  // ✅ log or handle
          return res.status(500).json({ error: data.error });
        }
      
        res.json({ results: data.local_results || [] });
      });
      
      
});

  router.get('/images', (req, res) => {
    const { cityName } = req.query;

    if (!cityName) {
      return res.status(400).json({ error: 'Missing cityName query parameter.' });
    }
  
    getJson({
      engine: "google_images",
      api_key: process.env.SERPAPI_KEY,
      q: cityName,
      location: cityName,
    }, (data) => {
      if (data.error) {
        return res.status(500).json({ error: data.error });
      }

      const imageUrls = data.images_results
      ?.filter(img => typeof img.original === 'string' && img.original.startsWith('http'))
      .slice(0, 5) // ✅ limit to 5 images
      .map(img => img.original) || [];

    res.json({ imageUrls });
    });
  });
  

export default router;