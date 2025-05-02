// frontend/hooks/useSaveWeather.js
export async function saveWeatherData(city, countryCode) {
    console.log("⬆️ Sending to backend:", city, countryCode);

    try {
      const res = await fetch(
        `http://localhost:5001/weather/saveWeather?city=${encodeURIComponent(city)}&countryCode=${countryCode}`,
        {
          method: 'GET'
        }
      );
  
      if (!res.ok) throw new Error("Weather not saved");
  
      console.log("✅ Weather saved to cache");
    } catch (err) {
      console.error("❌ Error saving weather:", err.message);
    }
  }
  
  