import "../styles/city.css";
import { saveCityData } from "../hooks/useSaveCity";
import { useRef, useEffect, useState } from "react";
import WeatherElement from "../components/WeatherElement";
import Logo from "../components/Logo";
import unitedKingdomFlag from "../media/ukFlag.png";
import unitedStatesFlag from "../media/usFlag.png";
import tripoli from "../media/tripoli.jpg";
import {
  useCityImages,
  useFlag,
  useCityData,
  useWeather,
  useThingsToDo,
} from "../hooks/useCityApi";

import { getCheckedCity } from "../hooks/useCheckedCity";
import { saveWeatherData } from "../hooks/useSaveWeather";
import Header from "../components/Header";
import AuthForm from "../components/AuthForm";


function City({ cityName, countryCode, isLoader, setDataCount, onImagesLoaded, setCity, setName, name, isLoggedin, setIsLoggedin, setIsProfile, setIsCity }) {
  const [citySrc, setCitySrc] = useState("");
  const [cityArray, setCityArray] = useState([]);
  const [cityFlag, setCityFlag] = useState("");
  const [thingsToDo, setThingsToDo] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [weatherCodeImg, setWeatherCodeImg] = useState("");
  const [weatherType, setWeatherType] = useState("");
  const [loadedCount, setLoadedCount] = useState(0);
  const [isAuth, setIsAuth] = useState(false);
  const totalImages = thingsToDo.length;
  const weatherSaved = useRef(false);
  const [city, country] = cityName.split(", ").map((part) => part.trim());

  useEffect(() => {
    async function fetchCheckedCity() {
      try {
        const { data, source } = await getCheckedCity(cityName);
        const places = data?.raw?.places || [];
  
        setDataCount(1); // Optional, for debugging/progress
  
        if (source === 'api') {
          await saveCityData({
            name: cityName,
            mainImage: citySrc,
            images: cityArray,
            places,
            raw: data.raw
          });          
        }
      } catch (err) {
        console.error("Checked city fetch error:", err.message || err);
      }
    }
  
    if (cityName && citySrc) fetchCheckedCity();
  }, [cityName, citySrc]);



// make sure these are passed:
useEffect(() => {
  if (
    weatherData?.weather && 
    weatherData?.main && 
    !weatherSaved.current
  ) {
    console.log("📦 Saving weather for:", city, countryCode); // ✅ Debug line
    saveWeatherData(city, countryCode); // <--- city should be e.g. "Liverpool"
    weatherSaved.current = true;
  }
}, [weatherData]);
  
  

  useCityImages(cityArray, cityName, setCitySrc, setCityArray, setDataCount);
  useThingsToDo(city, setThingsToDo, setLoadedCount, setDataCount);
  useFlag(country, setCityFlag, setDataCount, unitedKingdomFlag, unitedStatesFlag);
  useCityData(country, setCityData, setDataCount);
  useWeather(city, countryCode, setWeatherData, setWeatherCodeImg, setWeatherType, setDataCount);

  
  useEffect(() => {
    if (totalImages > 0 && loadedCount === totalImages) {
      onImagesLoaded();
    }

    const timeout = setTimeout(() => {
      console.warn("⚠️ Image load fallback triggered");
      onImagesLoaded();
    }, 7000);

    return () => clearTimeout(timeout);
  }, [loadedCount, totalImages]);

  return (
    <>
      <header className={isLoader ? "load" : "cityHeader"}>
      <Header setIsCity={setIsCity} toggleAuth={() => setIsAuth(!isAuth)} isLoggedin={isLoggedin} name={name} setIsProfile={setIsProfile} />
        {/* <section className="header-city">
          <Logo />
        </section> */}
        <img src={city === "Tripoli" ? tripoli : citySrc} alt="city" className="backgroundImg" />
        <h1 className="cityName">{cityName}</h1>
        <div className="header-overlay">
          <img src={cityFlag} alt="flag" className="flag" />
        </div>
      </header>
      {isAuth &&  <AuthForm onClose={() => setIsAuth(false)} loggedIn={setIsLoggedin} setName={setName} />}
      <div className={
        isLoader
          ? "load"
          : weatherType === "Rain" || weatherType === "Snow"
            ? "weather-phone-size rain"
            : "weather-phone-size"
      }></div>

      <main className={isLoader ? "load" : ""}>
        <section className="cityBackground">
          <CityInfo cityData={cityData} />
          {weatherData.main && (
            <WeatherElement
              weatherData={weatherData}
              city={city}
              weatherCodeImg={weatherCodeImg}
            />
          )}
        </section>

        <section className="city-description">
          <p className="city-text-info"></p>
        </section>

        <section>
          <h1 className="header-city-text">
            Things to do in <span className="highlited">{city}</span>
          </h1>
          <section className="todo-container">
            {thingsToDo.map((place, index) => (
              <TodoPlace
                key={index}
                place={place}
                onImageLoad={() => setLoadedCount((prev) => prev + 1)}
              />
            ))}
          </section>
        </section>
      </main>
    </>
  );
}

export default City;

function TodoPlace({ place, onImageLoad }) {
  const isValidImage = typeof place.thumbnail === 'string' && place.thumbnail.startsWith('http');
  const hasAddress = place.address && place.address.trim().length > 0;

  return (
    <div className="todo-sec">
      {isValidImage && (
        <img src={place.thumbnail} alt={place.title} className="to-do-image" onLoad={onImageLoad} />
      )}
      <h2 className="todo-title">{place.title}</h2>
      <p>{hasAddress ? place.address : "No address provided"}</p>
    </div>
  );
}

function CityInfo({ cityData }) {
  if (cityData) {
    return (
      <ul className="country-info">
        <li>Population: {cityData?.population?.toLocaleString()}</li>
        <li>Currency: {cityData.currencies && cityData.currencies[0]}</li>
        <li>Capital: {cityData.capital}</li>
        <li>Continent: {cityData.subregion}</li>
        <li>Languages: {cityData.languages && cityData.languages[0]}</li>
      </ul>
    );
  }
}
