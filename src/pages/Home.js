import logo from "../media/advenLogo.png";
import mainBackground from "../media/mainBackground.png";
import searchIcon from "../media/searchIcon.png";
import addvert from "../media/advertBackground.png";
import asia from "../media/asia.png";
import europe from "../media/europe.png";
import america from "../media/america.png";
import africa from "../media/africa.png";
import quote from "../media/quote.png";

import "../styles/home.css";
import { useEffect, useState } from "react";
import { API_KEYS } from "../config/config";

const RAPIDAPIKEY = API_KEYS.rapidapi;

function Home({ addSearchCity, setIsLoader }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  function setSearchCity(city, countryCode) {
    setSearchQuery(city);
    setIsSearchListVisible(false);
    setIsFocused(false);
    addSearchCity(city, countryCode);
    setIsLoader();
  }

  useEffect(() => {
    const controller = new AbortController();

    async function search() {
      if (searchQuery.length < 3) return; // Early return for short queries

      const url = `https://city-and-state-search-api.p.rapidapi.com/cities/search?q=${searchQuery}&limit=10&page=1`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": RAPIDAPIKEY,
          "x-rapidapi-host": "city-and-state-search-api.p.rapidapi.com",
        },
        signal: controller.signal,
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();

        const filteredResults = result.filter(
          (location, index, self) =>
            index ===
            self.findIndex(
              (loc) =>
                loc.name === location.name &&
                loc.country_name === location.country_name
            )
        );

        setIsFocused(true);
        setSearchResult(filteredResults);
        setIsSearchListVisible(filteredResults.length > 0);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error); // Ignore AbortError as it’s intentional
        }
      }
    }

    search();

    return () => controller.abort();
  }, [searchQuery]);

  return (
    <>
      <header>
        <img src={logo} className="logo" alt="logo" />
        <img src={mainBackground} className="backgroundImg" alt="background" />
        <section className="info-sec">
          <h1 className="header-text">Inspire your travels</h1>
          <p className="header-p">
            Browse our latest inspiration pages to start planning your next
            adventure.
          </p>
          <div>
            <input
              type="text"
              className={`search-input ${isFocused ? "focused" : ""}`}
              placeholder=" Search countries, places, hotels..."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            {isSearchListVisible && (
              <ul className="searchList">
                {searchResult.map((location, i) => (
                  <li
                    key={i}
                    onClick={() =>
                      setSearchCity(
                        `${location.name}, ${location.country_name}`,
                        location.country_code
                      )
                    }
                  >{`${location.name}, ${location.country_name}`}</li>
                ))}
              </ul>
            )}

            <img
              src={searchIcon}
              className={`${isFocused ? "viewSearchIcon" : "searchIcon"}`}
              alt="search icon"
            />
          </div>
          <div className="line"></div>
        </section>
      </header>
      <main>
        <h1 className="main-text">Top Destinations</h1>
        <section className="main-sec">
          <Continent src={asia} text={"Asia"} />
          <Continent src={america} text={"America"} />
          <Continent src={europe} text={"Europe"} />
          <Continent src={africa} text={"Africa"} />
        </section>
        <section className="addvert-sec">
          <aside className="box1">
            <img src={addvert} className="" alt="" />
          </aside>
          <section className="box2">
            <div className="box2-container">
              <h3 className="box2-header">Make 2025 your year</h3>
              <p className="box2-text">
                2025 looks to be a bright year for travel. Search for the places
                we’re most excited about, from Australia’s kaleidoscopic reefs
                to the forest-fringed temples of Thailand.
              </p>
            </div>
          </section>
        </section>
        <section className="review-sec">
          <h1 className="review-header-text">Straight from our users</h1>
          <section className="reviews-container">
            <Review />
            <Review />
            <Review />
          </section>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default Home;

function Continent({ src, text }) {
  return (
    <div className="continent-box">
      <img src={src} alt={text} />
      <span className="overlay-text">{text}</span>
    </div>
  );
}

function Review({ src, name, review }) {
  return (
    <div className="review">
      <img src={quote} alt="quote" className="quote" />
      <p style={{ fontSize: "1.8rem" }}>
        This is my website of choice, because of its topnotch service and value
        for money
      </p>
      <div className="user-container">
        <img
          src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg"
          alt="quote"
          className="userImg"
        />
        <p>Mobe benzp</p>
      </div>
    </div>
  );
}
