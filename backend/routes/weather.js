import express from 'express';
import supabase from '../supabaseClient.js';
import fetch from 'node-fetch';

const router = express.Router();
const WEATHER_API_KEY = process.env.WEATHER_KEY;

router.get('/saveWeather', async (req, res) => {
    const { city, countryCode } = req.query;
    
    console.log("this the save of :", city, countryCode )
  if (!city || !countryCode) {
    return res.status(400).json({ error: "Missing city or countryCode" });
  }

  try {
    // 1. Check cache
    const { data: cached, error: cacheError } = await supabase
      .from('weather_cache')
      .select('*')
      .eq('city_name', city)
      .eq('country_code', countryCode)
      .single();

    const now = new Date();
    const twelveHoursMs = 12 * 60 * 60 * 1000;

    if (cached && new Date(cached.fetched_at).getTime() + twelveHoursMs > now.getTime()) {
      console.log('🟢 Returning cached weather');
      return res.json(cached.data);
    }

    // 2. Fetch fresh weather
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&units=metric&appid=${WEATHER_API_KEY}`;
    const weatherRes = await fetch(url);
    const weatherData = await weatherRes.json();

    // 3. Save to cache
    const { data: upserted, error: upsertError } = await supabase
  .from('weather_cache')
  .upsert({
    city_name: city,
    country_code: countryCode,
    data: weatherData,
    fetched_at: now.toISOString()
  }, { onConflict: ['city_name', 'country_code'] });

if (upsertError) {
  console.error("❌ Failed to upsert weather:", upsertError.message);
} else {
  console.log("✅ Weather upserted:", upserted);
}


    console.log('🔄 Fetched & cached new weather');
    return res.json(weatherData);

  } catch (err) {
    console.error('❌ Weather error:', err);
    res.status(500).json({ error: 'Failed to get weather' });
  }
});

export default router;
