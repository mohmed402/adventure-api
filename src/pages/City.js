import cityBackground from "../media/ciryBackground.png";
import scratsh from "../media/scratsh.png";
import tripoli from "../media/tripoli.jpg";
import unitedKingdomFlag from "../media/ukFlag.png";
import unitedStatesFlag from "../media/usFlag.png";

import "../styles/city.css";
import "../styles/weatherElement.css";

import { useEffect, useState } from "react";
import { API_KEYS } from "../config/config";

function City({ cityName, countryCode, isLoader }) {
  const [citySrc, setCitySrc] = useState("");
  const [cityArray, setCityArray] = useState([]);
  const [cityId, setCityId] = useState("");
  const [cityFlag, setCityFlag] = useState("");
  const [toDoCityData, setToDoCityData] = useState();
  const [cityData, setCityData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [weatherCodeImg, setWeatherCodeImg] = useState("");
  const [weatherType, setWeatherType] = useState("");

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
        } else if (country === "United States") {
          setCityFlag(unitedStatesFlag);
        }

        if (result[0].flag?.officialflag.svg.length > 0) {
          setCityFlag(result[0].flag.officialflag?.svg);
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
          "x-rapidapi-key": RAPIDAPIKEY,
          "x-rapidapi-host": "country-location-api.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setCityData(result.location);
        // if (result.length > 0) {
        // }
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
        // setCityData(result.location);
        // if (result.length > 0) {
        // }
      } catch (error) {
        console.error(error);
      }
    }
    getWeather();
  }, [city, countryCode]);

  return (
    <>
      <header className={isLoader ? "load" : "cityHeader"}>
        <img src={cityFlag} alt="city" className="flag" />
        <img src={scratsh} alt="scratsh" className="scratsh" />
        <CityInfo cityData={cityData} />
        {weatherData.main && (
          <WeatherElement
            weatherData={weatherData}
            city={city}
            weatherCodeImg={weatherCodeImg}
          />
        )}

        <img
          src={city === "Tripoli" ? tripoli : citySrc}
          alt="city"
          className="backgroundImg"
        />
        <h1 className="cityName">{cityName}</h1>
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
        <img src={cityBackground} alt="city" className="cityBackground" />
        <p className="city-text-info">
          From Shoreditch’s swaggering style to Camden’s punky vibe and chic
          Portobello Road, London is many worlds in one. The city’s energy means
          that no two days are the same. Explore royal or historic sites, tick
          off landmarks from your bucket list, eat and drink in exclusive
          Michelin-starred restaurants, enjoy a pint in a traditional pub, or
          get lost down winding cobbled streets and see what you stumble across
          – when it comes to London, the possibilities are endless.
        </p>

        <section>
          <h1 className="header-city-text">
            Things to do in <span className="highlited">{city}</span>
          </h1>
          <section className="todo-container">
            {toDoCityData?.data?.map(
              (todo, index) =>
                index < 4 && (
                  <TodoPlace
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

function WeatherElement({ weatherData, weatherCodeImg, city }) {
  return (
    <>
      <div className="cardm">
        <div className="card">
          <svg
            xmlSpace="preserve"
            viewBox="0 0 100 100"
            height="100px"
            width="100px"
            y="0px"
            x="0px"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            version="1.1"
            className="weather"
          >
            <image
              href={`https://openweathermap.org/img/wn/${weatherCodeImg}@2x.png`}
              y="0"
              x="0"
              height="100"
              width="100"
              id="image0"
            ></image>
          </svg>
          <div className="main">{parseInt(weatherData.main.temp)} °C</div>
          <div className="mainsub">{city}</div>
        </div>

        <div className="card2">
          <div className="upper">
            <div className="humidity">
              <div className="humiditytext">
                Humidity
                <br />
                {weatherData.main.humidity}%
              </div>
              <svg
                className="humiditysvg"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="30px"
                height="30px"
                viewBox="0 0 30 30"
                xmlSpace="preserve"
              >
                <image
                  id="image0"
                  width="30"
                  height="30"
                  x="0"
                  y="0"
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
        AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABiVBMVEUAAAAAAP9NerV/f39O
        e7ZQfLZVf6pRfbfL5fdRfbZIbbZmmcxols5nl85OebSPsteLrdVSfLZxl89ok9FqlM5ahsBdicNa
        hsFcicRhjcdWgbpahsFfi8ZbhsFijsmErOWLt+9xndZcicJahsFahsFdicN5n81xjcZqlNRpls1q
        lNBfn99pls9nkcxXgrpZgrtik81OebWNsdeMrtZOebRNerVZg7pwmMhNebRKdLRNerZNebHZ8v9o
        lM9jj8rV7v3W7v1ch7+Ktu6Lt/CEsep7p+Cz1PO+3fqJte5/q+V+quOUvvLY8f+TvfKpzvapzfaq
        z/aRvPGdxfSVv/LX8P/W8P+32fnK5vyMuPCmzPXW8P6ny/WWv/KOufGawvO22PjJ5vzB4PrU7v6i
        yPSz1fiYwfKOufDD4funzPXF4vvE4vuOuvHV7/7U7/7G4/uNufCx1Pew0/ev0veu0feQu/G01viP
        ufF/q+SCrud+quSItO2kyvWjyfVijslrltFmkcyEqtZgjMf///8NXQssAAAAPHRSTlMAAZgCW+EG
        y+jMBxRaRXHC2H8bX0ry/vrhyvnw0PDHR0Be/e/4/f4SDDNiEFVb0eI5iMHCho7NwI0YOBdy59Cm
        AAAAAWJLR0SCi7P/RAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cCEBITAJMBs+kAAAFb
        SURBVCjPY2CAAUYmZgY8gIWVBY8sGzsHJxc2CW4eXiDJx28jIAjiCgnzgoV5ebiBpIiomK2duISk
        lL2Ng6O0jIwsmCsnIW5nKyYqwiDv5AwELq5uNjY27h6enh5grpcLiHKSZ1BwBgNvH6C0j68zKlCA
        SfvZgIA/LukAsHQAVDgwCE06OAQoGxoMlQ4Lj0CVdo6MsomKhrJjfGwi0aSdY+NiYcx4G5sEdGkk
        kGhjk4RHOjnEJgWPtLNvKprL07CpgktHpEfgk/a3ycAnnWmThRDMxpDOscmFi6Xl5aNLF+QUwqWL
        bIoxogQBSpJskkpwS5cC4yYFp3RZElA6qQwh7VFeAWZXVFYByWpwxNcAueUeQGlFJWUZCZXauloV
        CRllVdt6NbB0QyOIq6TIoK4BSrWaWpogSltHVw8srW8A4mqoY6R6QyOgrLEJztxiamZuZsGGOztZ
        WlnD2QBCYbJl9Cx9XAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xNlQxODoxOTowMCswMDow
        MG/wqfUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMTZUMTg6MTk6MDArMDA6MDAerRFJAAAA
        KHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTE2VDE4OjE5OjAwKzAwOjAwSbgwlgAAAABJRU5ErkJggg=="
                ></image>
              </svg>
            </div>

            <div className="air">
              <div className="airtext">
                Wind
                <br />
                {weatherData.wind.speed} Km/h
              </div>
              <svg
                xmlSpace="preserve"
                viewBox="0 0 30 30"
                height="30px"
                width="30px"
                y="0px"
                x="0px"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                version="1.1"
                className="airsvg"
              >
                <image
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
          AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABaFBMVEUAAAAA//8ilfIhlfMg
          lvIglfMglvIeku8cjf8glvMhlfIflvMhlfIhlvIglvMhl/MglvIglfIglPEfmfIhlfIglvQfn/8g
          lfIglvIhlfMglfIglvMhl/AhlfIcm/AAf/8qlOkglPYglvIZmf8zmf8hlfIglfIXi+cilPMhlvMg
          lfQhlvMglvIhlfIgl/MglvMhlvMhlfMhlvIfl+8hlvMhlfMglvMglvI/f/8hlvMilvMelvAglfIg
          lvMhlvIglPIglvIhlfIkkfUglfMglfMhlvMhlvMilvMjlfEglvMhlfIhlfMglfIflvEnnOshlvIf
          lPEflfIek/QglvIglvMhlfIime4jlPAglvMglvEhlvMhl/MglfMglfMhlvIak/Edk/UhlvIglfMg
          l/IglvIglfIilPIhlvMhlfMhk/Eqqv8glvIglfMcl/UhlfMhlvIhlvMhlfIglfIhlfIgl/QflPQh
          lvP///+FIn/GAAAAdnRSTlMAAVKu1MmNIQmy91ig/Z5s0fo3KP5dCL27Lvm0NvwSAgwf+woFv7oL
          Q0RGa9L1Vtndx4sgme3FZgTIFiI/hvZld3sch8Tv7kI683nV6DgN4GBQMsycjw8k6nWqRW3cUxMa
          5dpnfLU87N8mBrxXG5jnibjLoi8YaHuXCQAAAAFiS0dEd0Zk+dcAAAAJcEhZcwAACxMAAAsTAQCa
          nBgAAAAHdElNRQfnAhEIBBbLW8PtAAABJ0lEQVQoz62RZ1fCMBSG46atomBR1IJ7g+KotKKgxYl7
          4Z6493x/v6T0QKMtn/p8ec/Nk5Pc5BLiHCWlZeUVlVU21sWBwgvWuho1bqG2Dh6vla0X4ctGQyP8
          VrqpuUVPCQGXlQ+26tEGtBfpX0JHp73t6kYPs9Db159nYDAEj8RoNxjCQ+xxvuFIgZHRMcemQMi4
          iP+I8kRU0TUHG9RJqpWYFVPTcahKsc/jkSAzfgNuVvvjk5gj84W7FhZZvYRl4o0apFawGmT0GsKm
          an0DmzS31O3cQgo75t27SNLYQyRNc/8AhzkROzrOPjCEE1poMk7Pzi8Sl7gyxp5B/Fq4Aa//A7m9
          y7V6/2Ac+/hEy8CzUb68ysDbezp/rZL5+Pz6NvWh/TgwzV+1HV523WQ81AAAACV0RVh0ZGF0ZTpj
          cmVhdGUAMjAyMy0wMi0xN1QwODowNDoyMiswMDowML1dmzYAAAAldEVYdGRhdGU6bW9kaWZ5ADIw
          MjMtMDItMTdUMDg6MDQ6MjIrMDA6MDDMACOKAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAy
          LTE3VDA4OjA0OjIyKzAwOjAwmxUCVQAAAABJRU5ErkJggg=="
                  y="0"
                  x="0"
                  height="30"
                  width="30"
                  id="image0"
                ></image>
              </svg>
            </div>
          </div>

          <div className="lower">
            <div className="aqi">
              <svg
                xmlSpace="preserve"
                viewBox="0 0 20 20"
                height="20px"
                width="20px"
                y="0px"
                x="0px"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                version="1.1"
                className="aqisvg"
              >
                <image
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
        AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABBVBMVEUAAABL4f9O5v9P5f9Q
        5f9R5/8AZsxB0vYAd9EAeNQAd9MeoOM1w/EYmuIZm+IXnOIAAP8AccYmrOgYmuAWneEA//8AdtQZ
        m+JP5f8ZmeUAf89L3vwcoOQYmeIAddEAeNUrseocjeIAd9QAeNMxu+4kqucZmuEYm+IWmeI5xfIf
        n99P3/9Q5v9Q5v9Q5v9G2Pk0wPA+zfZN4v5L3/w+zfUyve8iqOcrs+s9zPVM4f1N4v1E1vklrOki
        p+cmrOhH2fpP5f5F1/kstewqs+tO4/4nruott+0or+pL3vxE1flK3vxA0fcjqecrtOxO5P4yvvAs
        tOw6yPNA0Pc7yfQ4xfI3xPL////cI4U2AAAALnRSTlMAEXF3ZWsFeC3S26iVh7MsAQnAVCIBZ7Ft
        ChBv6GonVZQJs4yLxtPNLY8IEHuINVg0ZAAAAAFiS0dEVgoN6YkAAAAJcEhZcwAACxMAAAsTAQCa
        nBgAAAAHdElNRQfnAhIFCRn0J5yMAAAAq0lEQVQY02NgIAkwMjFDARMjXJBFDw5Y4IKsCEFWmBgb
        u56+gaERsiAHJxe3nrGJqZm5haWeFQ8vHz9QUEAQqt3a1MbWTkhYRBRmprG9A5qZYuJ6jk62ziYu
        QEEJSaiglDRIjaOpraubu4wsupM8PL2g2gXk5BX0vH18LYwgZiqCLOJQUlbR0/Nz9LcNCAwKVlVT
        10DRbh1iGqqphc+b2ANEW0cXCnS0SQt0ALCcIug70CWhAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIz
        LTAyLTE4VDA1OjA5OjI1KzAwOjAwRMIpTAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wMi0xOFQw
        NTowOToyNSswMDowMDWfkfAAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjMtMDItMThUMDU6MDk6
        MjUrMDA6MDBiirAvAAAAAElFTkSuQmCC"
                  y="0"
                  x="0"
                  height="20"
                  width="20"
                  id="image0"
                ></image>
              </svg>
              <div className="aqitext">
                AQI
                <br />
                30
              </div>
            </div>

            <div className="realfeel">
              <svg
                xmlSpace="preserve"
                viewBox="0 0 20 20"
                height="20px"
                width="20px"
                y="0px"
                x="0px"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                version="1.1"
                className="rfsvg"
              >
                <image
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
        AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABuVBMVEUAAAAAAAAECQkIDg4E
        BAQAAAAAAAAFBQUHDAwIDg4MFBUNFRUKCgoPGhxGenw/b3FDdXcmRUYJDAwJDw9Pi40LFBQNFhYM
        FhYPGhsMExUKEhIPGhoKEhQMExMOGhoMExMPGhoKFBQLExMNFxcKEhILFBQKExMKExQLEhILERMK
        EREHDQ1SkJMuUlMABAQAAAASHh9FeXtAcXI8aWszWlwvU1M4Y2QjPT4NGBoAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAABYmZtWlplKgoVlsbRsvsF0zM9uwsVuwcNsvb9ecU53czF0bStgbkdqt7dntbhp
        tbVxaCf5uxD+vxD7vBBTUilYlZdtwMNms7Zdc1P8vRDYpBR5b0imsKy0wcFzhoZdkpRldEx6cU3W
        5eWLnJxdm51otrlZdl67kBWxvbmUo6RmfHxajo9ouLpqt7mJdiN8YxnH1dWVpaVfn6Jgl41OUUKv
        u7pWe3xwxsldn6KmtLTO3NxUf4BswMN0ys1gpaedrKzT4uJjd3dsvcBqubxXg4Vgd3hthYVid3dh
        dnZof39shYVkf4BVeXpqt7pksbJjr7Jdo6X////f0mPcAAAAQXRSTlMABGh/a1xUZIqPo7BH2vv4
        /vJQgvyxwLLCpqXBsafBqcKutcCwuamtop+SgPzwOQzg/f728fD166Zla1o/PiEmFs+XjUIAAAAB
        YktHRJKWBO8gAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wISBQ8aO3RqsAAAAQlJREFU
        GNNjYMAOGJmYmVlY2djYmZk5OLm4ecBivHyOTs7O/ALOTo6Oji6ugkJAQWERNxTgLgoUFEMVc/MQ
        BwpKuLl5enn7+PpBBf0lwYIBgUHBwSGhYeFgwQgpoKC0W2RUcHB0TGxcfAJYuwxYMDE4OCgpGQhS
        UoGCabJAQTm39KDgjEyQYHJWdo5brjxQUMEtLz+ooDAZAoqKXRXBgm4lpWXJMFBeoQQUVHZzq6yC
        i1XX1KoABVXr3OobYGKNTc0takBBdVc3t9a29vaOzq7unt4+t34NoKDmBFRvTtQCCmrroArq6gEF
        9Q0MnY2MTUxNzYxBwNwCHMj6llbWNrZ29jZg4IAjKhgAAWdbVO4nzP4AAAAldEVYdGRhdGU6Y3Jl
        YXRlADIwMjMtMDItMThUMDU6MTU6MjYrMDA6MDCumAyfAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIz
        LTAyLTE4VDA1OjE1OjI2KzAwOjAw38W0IwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0x
        OFQwNToxNToyNiswMDowMIjQlfwAAAAASUVORK5CYII="
                  y="0"
                  x="0"
                  height="20"
                  width="20"
                  id="image0"
                ></image>
              </svg>
              <div className="realfeeltext">
                Real Feel
                <br />
                {parseInt(weatherData.main.feels_like)} °C
              </div>
            </div>

            <div className="pressure">
              <svg
                xmlSpace="preserve"
                viewBox="0 0 20 20"
                height="20px"
                width="20px"
                y="0px"
                x="0px"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                version="1.1"
                className="pressuresvg"
              >
                <image
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
        AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABNVBMVEUAAAAAr8EArMAAqsAA
        rMEBrMEBrMAAq8AArb8AqsIBrMEgtMa53+S53+QetMYArMEArMEAqrsArMA9scFegp4Cqr8Ao8gA
        rMEErMHn6+wTobgArMAArMBCvc1sco8Aq8EArMFSqrmNWn1Dvs4Aq8EErcLo7O0SorgArMAAq8A8
        sMBie5gCqr8BrMEftMa23eO33uQcs8YAq8AArMAAq8ABq8AAq8EAq8Mtdn9DW2OvvcSwvcSrucJ3
        kZyvvcWvv8OruMJ6kZ55kJ2rusAArMHFzdLH0NS5xMru7u7l5+jm6Ojp3eDd4OK2ubvAhZL4G0en
        rK1YYWV3foHu7e39Mlns7OwzXWQxW2Tl5+f6VHSssLKpra/9MVnc4OL1m6y5xcvv09kxcX5FWmR4
        kJywvsWsusL///80ikJBAAAARHRSTlMAHUotv/j5vSw/9cvd3MrzPg/q4+rqDnXk+/NzucP3t873
        /cJ05Przcunj8en0y93cyz28/vu7K1RASpWb/YBAhvP3hpKCbb4AAAABYktHRGYs1NklAAAACXBI
        WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wISBRAIBZcVZgAAAM1JREFUGNNjYMAHGJmYGNGEmFlc
        WNlc2DmQxTi5uHlc3Xj5+AUQYoJCwu4enl4e3iKiYnBBcQlJHw8PD18/fylpuKCMLFAoIDAoOERO
        Hi6ooOjuERoWHuERqaSAUKkMVBkV7REcg6RSRVUtFijsEeevroGwXVMrHiSYoK2DsJ1BQFdP38PD
        wJDfCNn1HMYmpqYmZuZoHrVITLTACBDLpCRLJK6VNRDY2CYn29qAWFZgQbsUIEhNBoJUEMsOLGhv
        BwQOjk5Ojs4glj0DCQAAJCUofMKIT9cAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDItMThUMDU6
        MTY6MDgrMDA6MDBXtcu8AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAyLTE4VDA1OjE2OjA4KzAw
        OjAwJuhzAAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0xOFQwNToxNjowOCswMDowMHH9
        Ut8AAAAASUVORK5CYII="
                  y="0"
                  x="0"
                  height="20"
                  width="20"
                  id="image0"
                ></image>
              </svg>
              <div className="pressuretext">
                Pressure
                <br />
                {weatherData.main.pressure} mbar
              </div>
            </div>
            <div className="card3">{weatherData.weather[0].description}</div>
          </div>
        </div>
      </div>
    </>
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
