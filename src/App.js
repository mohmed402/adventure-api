import Home from "./pages/Home";
import City from "./pages/City";
import Loader from "./pages/Loader";
import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from './supabaseClient';
import CustomerDashboard from "./components/CustomerDashboard";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";

function App() {
  const [isCity, setIsCity] = useState(false);
  const [cityName, setCityName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [name, setName] = useState("");
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isProfile, setIsProfile] = useState(false);

  function setCity(value) {
    setIsCity(value);
    // window.localStorage.setItem("searchCity", value);
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

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setIsLoggedin(true);
        setName(data.user.user_metadata?.name || '');
      }
    };
    checkUser();
  }, []);

    if(isProfile){
      return <Admin setIsProfile={setIsProfile} />;
    } 
  

  return isCity ? (
    <>
      <City cityName={cityName} countryCode={countryCode} isLoader={isLoader} setDataCount={setDataCount} />
      {isLoader && <Loader />}
      {/* <Footer /> */}
    </>
  ) : (
    <>
      <Home addSearchCity={addSearchCity} setIsLoader={showLoader} setName={setName} name={name} isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} setIsProfile={setIsProfile} />
      <Footer />
    </>
  );
}

export default App;


