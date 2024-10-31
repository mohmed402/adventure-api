import Home from "./pages/Home";
import City from "./pages/City";
import Loader from "./pages/Loader";
import "./App.css";
import { useState } from "react";

function App() {
  const [isCity, setIsCity] = useState(false);
  const [cityName, setCityName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  function setCity(value) {
    setIsCity(value);
  }

  function addSearchCity(city, countryCode) {
    setCityName(city);
    setCountryCode(countryCode);
  }

  function showLoader() {
    setIsLoader(true);
    setCity(true);
    setTimeout(() => {
      setIsLoader(false);
    }, 5000); // Delay of 1 second
  }

  return isCity ? (
    <>
      <City cityName={cityName} countryCode={countryCode} isLoader={isLoader} />
      {isLoader && <Loader />}
      <Footer />
    </>
  ) : (
    <>
      <Home addSearchCity={addSearchCity} setIsLoader={showLoader} />
      <Footer />
    </>
  );
}

export default App;

function Footer() {
  return (
    <div className="container">
      <header>
        <h1 className="logos">
          <span className="logo-highlight">Adven</span> ture
        </h1>
      </header>

      <div className="info-section">
        <div className="connect">
          <h2>CONNECT WITH US</h2>
          <ul>
            <li>Instagram</li>
            <li>Twitter</li>
            <li>Facebook</li>
            <li>LinkedIn</li>
          </ul>
        </div>

        <div className="locations">
          <h2>LOCATIONS</h2>
          <ul>
            <li>
              DELHI
              <br />
              123 Anywhere St., Any City
            </li>
            <li>
              MUMBAI
              <br />
              123 Anywhere St., Any City
            </li>
            <li>
              AGRA
              <br />
              123 Anywhere St., Any City
            </li>
          </ul>
        </div>
      </div>

      <footer>
        <p>info@adventure.com</p>
      </footer>
    </div>
  );
}
