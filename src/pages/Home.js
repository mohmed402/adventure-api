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
// import Logo from "../components/Logo";
import Header from "../components/Header";
import AuthForm from "../components/AuthForm";

const RAPIDAPIKEY = API_KEYS.rapidapi;

function Home({ addSearchCity, setIsLoader, setName, name, isLoggedin, setIsLoggedin, setIsProfile }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isAuth, setIsAuth] = useState(false);




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
      if (searchQuery.length < 2) return;

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
       <Header cityName={searchQuery} setCity={setSearchQuery} toggleAuth={() => setIsAuth(!isAuth)} isLoggedin={isLoggedin} name={name} setIsProfile={setIsProfile} />
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
     {isAuth &&  <AuthForm onClose={() => setIsAuth(false)} loggedIn={setIsLoggedin} setName={setName} />}
      <main>
        <h1 className="main-text">Top Destinations</h1>
        <section className="main-sec">
          <Continent src={asia} continentName={"Asia"} />
          <Continent src={america} continentName={"America"} />
          <Continent src={europe} continentName={"Europe"} />
          <Continent src={africa} continentName={"Africa"} />
        </section>
        <section className="addvert-sec">
          <aside className="box1">
            <img src={addvert} className="" alt="Indian museum" />
          </aside>
          <section className="box2">
            <div className="box2-container">
              <h2 className="box2-header">Make 2025 your year</h2>
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
            <Review
              review={
                "I love how intuitive this website is! The clean design, fast performance, and attention to detail really stand out. It’s a pleasure to use"
              }
            />
            <Review
              review={
                "I was impressed by the wealth of useful information this website provides. The content is presented clearly, and the design ensures everything is easy to access"
              }
            />
            <Review
              review={
                "This website is incredibly user-friendly and easy to navigate. The clear design and thoughtful layout made finding information effortless"
              }
            />
          </section>
        </section>
      </main>
    </>
  );
}

export default Home;

function Continent({ src, continentName }) {
  return (
    <div className="continent-box">
      <img src={src} alt={`${continentName} Continent`} />
      <span className="overlay-text">{continentName}</span>
    </div>
  );
}

function Review({ src, name, review }) {
  return (
    <div className="review">
      <img src={quote} alt="quote" className="quote" />
      <p style={{ fontSize: "1.8rem" }}>{review}</p>
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
