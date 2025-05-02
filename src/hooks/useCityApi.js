// frontend/hooks/useCityApi.js
import { useEffect } from "react";

// export function useCityImages(cityArray, cityName, setCitySrc, setCityArray, setDataCount) {
//   useEffect(() => {
//     async function fetchImages() {
//       try {
//         const res = await fetch(`http://localhost:5001/city/images?cityName=${encodeURIComponent(cityName)}`);
//         const data = await res.json();

//         if (data?.imageUrls?.length > 0) {
//           setCitySrc(data.imageUrls[0]);
//           setCityArray(data.imageUrls.slice(1, 4));
//           setDataCount(2);
//         }
//       } catch (err) {
//         console.error("CityImages Error:", err);
//       }
//     }

//     if (cityName) fetchImages();
//   }, [cityName]);
// }
// frontend/hooks/useCityApi.js
export function useCityImages(cityArray, cityName, setCitySrc, setCityArray, setDataCount) {
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`http://localhost:5001/city/images?cityName=${encodeURIComponent(cityName)}`);
        const data = await res.json();

        if (data?.imageUrls?.length > 0) {
          setCitySrc(data.imageUrls[0]);                      // ✅ Main image
          setCityArray(data.imageUrls.slice(1));              // ✅ Remaining images (for to-do places, etc.)
          setDataCount(2);
        }
      } catch (err) {
        console.error("CityImages Error:", err.message || err);
      }
    }

    if (cityName) fetchImages();
  }, [cityName]);
}


// export function useThingsToDo(city, setThingsToDo, setLoadedCount, setDataCount) {
//   useEffect(() => {
//     async function fetchThingsToDo() {
//       try {
//         // const res = await fetch(`http://localhost:5001/city/thingsToDo?q=things to do in ${city}`);
//         const res = await fetch(`http://localhost:5001/city/thingsToDo?q=${city}`);
//         const json = await res.json();
//         const items = json.results.slice(0, 4);
//         // setThingsToDo(items);
//         setThingsToDo(items.results.slice(0, 4));
//         setLoadedCount(items.length);
//         setDataCount(1);
//       } catch (err) {
//         console.error("ThingsToDo Error:", err);
//       }
//     }
//     if (city) fetchThingsToDo();
//   }, [city]);
// }
export function useThingsToDo(city, setThingsToDo, setLoadedCount, setDataCount) {
    useEffect(() => {
      async function fetchThingsToDo() {
        try {
          const res = await fetch(`http://localhost:5001/city/thingsToDo?q=${city}`);
          const json = await res.json();
          const items = json.results.slice(0, 4);
          setThingsToDo(items);                  
          setLoadedCount(items.length);          
          setDataCount(1);
        } catch (err) {
          console.error("ThingsToDo Error:", err);
        }
      }
  
      if (city) fetchThingsToDo();
    }, [city]);
  }
  
export function useFlag(country, setCityFlag, setDataCount, unitedKingdomFlag, unitedStatesFlag) {
  useEffect(() => {
    async function fetchFlag() {
      try {
        const response = await fetch(`http://localhost:5001/city/flag/${country}`);
        const result = await response.json();

        if (country === "United Kingdom") {
          setCityFlag(unitedKingdomFlag);
        } else if (country === "United States") {
          setCityFlag(unitedStatesFlag);
        } else if (result[0]?.flag?.officialflag?.svg) {
          setCityFlag(result[0].flag.officialflag.svg);
        }
        setDataCount(3);
      } catch (err) {
        console.error("Flag Error:", err);
      }
    }

    fetchFlag();
  }, [country]);
}

export function useCityData(country, setCityData, setDataCount) {
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:5001/city/country-info/${country}`);
        const data = await response.json();
        setCityData(data.location);
        setDataCount(4);
      } catch (err) {
        console.error("CityData Error:", err);
      }
    }

    fetchData();
  }, [country]);
}

export function useWeather(city, countryCode, setWeatherData, setWeatherCodeImg, setWeatherType, setDataCount) {
  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(`http://localhost:5001/city/weather?city=${city}&countryCode=${countryCode}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch weather');
        }

        setWeatherData(data);
        setWeatherCodeImg(data.weather?.[0]?.icon || "");
        setWeatherType(data.weather?.[0]?.main || "");
        setDataCount(5);  // Optional: used for tracking steps
      } catch (err) {
        console.error("Weather Error:", err.message || err);
      }
    }

    if (city && countryCode) fetchWeather();
  }, [city, countryCode]);
}

