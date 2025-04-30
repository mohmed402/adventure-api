import cityBackground from "../media/ciryBackground.png";
import scratsh from "../media/scratsh.png";
import tripoli from "../media/tripoli.jpg";
import unitedKingdomFlag from "../media/ukFlag.png";
import unitedStatesFlag from "../media/usFlag.png";

import "../styles/city.css";

import { useEffect, useState } from "react";
import { API_KEYS } from "../config/config";
import WeatherElement from "../components/WeatherElement";
import DashboardHeader from "../components/DashboardHeader";
import Logo from "../components/Logo";

function City({ cityName, countryCode, isLoader, setDataCount }) {
  const [citySrc, setCitySrc] = useState("");
  const [cityArray, setCityArray] = useState([]);
  const [cityId, setCityId] = useState("");
  const [cityFlag, setCityFlag] = useState("");
  const [toDoCityData, setToDoCityData] = useState();
  const [cityData, setCityData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [weatherCodeImg, setWeatherCodeImg] = useState("");
  const [weatherType, setWeatherType] = useState("");
  const [data, setData] = useState({});

  const [city, country] = cityName.split(", ").map((part) => part.trim());

  const options = {
    method: "GET",
    headers: { accept: "application/json" },
  };

  const RAPIDAPIKEY = API_KEYS.rapidapi;
  const TRIPADVISORKEY = API_KEYS.tripAdvisor;
  const WEATHERKEY = API_KEYS.weather;

  useEffect(() => {
    async function getCityId() {
      try {
        const response = await fetch(
          `https://api.content.tripadvisor.com/api/v1/location/search?key=${TRIPADVISORKEY}&searchQuery=${encodeURIComponent(
            cityName
          )}&language=en`,
          options
        );
        const data = await response.json();

        // Check if data is returned properly
        if (data && data.data && data.data.length > 0) {
          const updatedCityArray = [];
          data.data.forEach((cityId, index) => {
            index < 4 && updatedCityArray.push(cityId.location_id);
          });
          setCityArray((array) => [...updatedCityArray]); // Merge old with new
          setToDoCityData(data);

          setCityId(data.data[0].location_id); // Assuming location_id is needed
          setDataCount(1)
        }
      } catch (err) {
        console.error("Error fetching city ID:", err);
      }
    }

    if (cityName) {
      getCityId();
    }
  }, [cityName]);

  useEffect(() => {
    async function getCityImage(id, index) {
      if (id) {
        try {
          const response = await fetch(
            `https://api.content.tripadvisor.com/api/v1/location/${id}/photos?key=${TRIPADVISORKEY}&language=en`,
            options
          );
          const data = await response.json();

          // Check if data is returned properly
          if (data && data.data && data.data.length > 0) {
            if (index === 0) {
              setCitySrc(data.data[0].images.original.url);
            } else {
              const updatedCityArray = [];
              data.data.forEach((cityId) => {
                updatedCityArray.push(cityId.images.original.url); // Fix typo
              });
              setCityArray((array) => [...updatedCityArray]); // Merge
              setDataCount(2)

            }
          }
        } catch (err) {
          console.error("Error fetching city image:", err);
        }
      }
    }

    cityArray?.forEach((cityId, index) => {
      getCityImage(cityId, index);
    });
  }, [cityId]);

  useEffect(() => {
    async function getFlag() {
      const url = `https://rest-countries10.p.rapidapi.com/country/${country}`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": RAPIDAPIKEY,
          "x-rapidapi-host": "rest-countries10.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (country === "United Kingdom") {
          setCityFlag(unitedKingdomFlag);
          setDataCount(3)
        } else if (country === "United States") {
          setCityFlag(unitedStatesFlag);
          setDataCount(3)
        }

        if (result[0].flag?.officialflag.svg.length > 0) {
          setCityFlag(result[0].flag.officialflag?.svg);
          setDataCount(3)
        }
      } catch (error) {
        console.error(error);
      }
    }
    getFlag();
  }, [country]);

  useEffect(() => {
    async function getCityData() {
      const url = `https://country-location-api.p.rapidapi.com/location?country=${country}`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "82e1f8169dmshcad00c402757b4ep1aa4eejsnd85fbe51d418",
          "x-rapidapi-host": "country-location-api.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setCityData(result.location);
        setDataCount(4)

      } catch (error) {
        console.error(error);
      }
    }
    getCityData();
  }, [country]);

  useEffect(() => {
    async function getWeather() {
      // const url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${"manchester"}&appid=${WEATHERKEY}`;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&units=metric&appid=${WEATHERKEY}`;
      //api.openweathermap.org/data/2.5/weather?q={city name},{country code}&appid={API key}

      try {
        const response = await fetch(url);
        const result = await response.json();
        console.log(result);
        setWeatherData(result);
        setWeatherCodeImg(result.weather[0].icon);
        setWeatherType(result.weather[0].main);
        setDataCount(5)
    
      } catch (error) {
        console.error(error);
      }
    }
    getWeather();
  }, [city, countryCode]);

  return (
    <>
    <header className={isLoader ? "load" : "cityHeader"}>
      <section className="header-city">
        <Logo />
      </section>
      <img src={city === "Tripoli" ? tripoli : citySrc} alt="city" className="backgroundImg" />
  
        <h1 className="cityName">{cityName}</h1>
      <div className="header-overlay">
        <img src={cityFlag} alt="flag" className="flag" />
        
      </div>
        </header>
  
    <div
      className={
        isLoader
          ? "load"
          : weatherType === "Rain" || weatherType === "Snow"
          ? "weather-phone-size rain"
          : "weather-phone-size"
      }
    ></div>
  
    <main className={isLoader ? "load" : ""}>
      {/* <img src={cityBackground} alt="city background" className="cityBackground" /> */}
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
        <p className="city-text-info">
          {/* your paragraph here */}
        </p>
      </section>
  
      <section>
        <h1 className="header-city-text">
          Things to do in <span className="highlited">{city}</span>
        </h1>
        <section className="todo-container">
          {toDoCityData?.data?.map(
            (todo, index) =>
              index < 4 && (
                <TodoPlace
                  key={todo.id || index} // Important: Add a unique key
                  todo={todo}
                  index={index + 1}
                  cityArray={cityArray}
                />
              )
          )}
        </section>
      </section>
    </main>
  </>
  
  );
}

export default City;

function TodoPlace({ todo, index, cityArray }) {
  return (
    <div key={todo.location_id} className="todo-sec">
      <img src={cityArray[index]} alt={todo.name} className="to-do-image" />
      <h2 className="todo-title">{todo.name}</h2>
      <p>{todo.address_obj.address_string}</p>
    </div>
  );
}



function CityInfo({ cityData }) {
  if (cityData) {
    return (
      <ul className="country-info">
        <li>
          Population:
          {cityData?.population && cityData.population?.toLocaleString()}
        </li>
        <li>Currency: {cityData.currencies && cityData.currencies[0]}</li>
        <li>Capital: {cityData.capital}</li>
        <li>Continent: {cityData.subregion}</li>
        <li>languages: {cityData.languages && cityData.languages[0]}</li>
      </ul>
    );
  }
}
