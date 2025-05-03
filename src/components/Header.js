import Logo from "./Logo"
import profileIcon from "../media/profileIcon.png";
import "../styles/components.css";
import { useState } from 'react';
import onLogout from "../api/handleLogout.js"
import styles from '../styles/Header.module.css'; // New module CSS for header

function Header({ setIsCity, setCity, toggleAuth, isLoggedin, name, setIsProfile}) {
  const [showDropdown, setShowDropdown] = useState(false);
//   const [isLoggedin, setIsLoggedin] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <section className={styles.headerCity}>
      <Logo />
      { isLoggedin ? <div className={styles.profileWrapper}>
        <div className={styles.homeNav}>
         <p onClick={()=> setIsCity(false)}>{setIsCity ? "Exit" : ""}</p>

        </div>
        <p className={styles.profileName} onClick={toggleDropdown}>
          {name} ▼
        </p>
        {showDropdown && (
          <div className={styles.dropdownMenu}>
            <button className={styles.dropdownItem} onClick={() => setIsProfile(true)}>
              View Profile
            </button>
            <button className={styles.dropdownItem} onClick={()=> onLogout()}>
              Logout
            </button>
          </div>
        )}
      </div> :  <img onClick={toggleAuth} className="profile-icon" src={profileIcon} alt="profile icon" /> }
    </section>
  );
}

export default Header;


