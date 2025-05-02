import React from "react";
import styles from "../styles/Navigation.module.css";
import Switch from "./Switch";
import handleLogout from "../api/handleLogout";

const Navigation = ({ selected, setPageNumber, isNavOpen, onToggleCollapse, onToggleDarkMode, onToggleSignOut }) => {

  function signOut() {
    if (onToggleSignOut) onToggleSignOut(); // ✅ call the function
    handleLogout(); // ✅ perform Supabase logout
  }


  return isNavOpen ? (
  
    
    <nav className={styles.nav}>
      <section className={styles.navContent}>
        <section className={styles.navHeader}>
            <h2 className={styles.navTitle}>Admin</h2>
        <Switch onToggleDarkMode={onToggleDarkMode} />
          <button
            className={styles.closeButton}
            onClick={onToggleCollapse}
          >
           X
          </button>
        </section>

        <ul className={styles.navList}>
          <li>
          <a href="#" className={`${styles.navLink} ${selected == 0 && styles.navSelected}`} onClick={()=>setPageNumber(0)}>
               City
          </a>
          </li>
          <li>
          <a href="#" className={`${styles.navLink} ${selected == 1 && styles.navSelected}`} onClick={()=>setPageNumber(1)}>
              Users
            </a>
          </li>
          <li>
          <a href="#" className={`${styles.navLink} ${selected == 2 && styles.navSelected}`}>
              Settings
            </a>
          </li>
        </ul>
      </section>

      <section className={styles.userSection}>
        <section className={styles.userInfo}>
        <div className={styles.userAvatar}>
            <svg viewBox="0 0 20 20">
              <path
                d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 3a3 3 0 110 6 3 3 0 010-6zm0 13a8 8 0 01-6.32-3.094C4.306 13.88 7.21 13 10 13c2.79 0 5.694.88 6.32 1.906A8 8 0 0110 18z"
                fill="currentColor"
              />
            </svg>
          </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>John Doe</span>
              <span className={styles.userEmail}>john@example.com</span>
            </div>
        </section>
        <button onClick={signOut} className={styles.logoutButton}>
            <span>Log out</span>
        </button>
      </section>
    </nav>
   
  ) : null;
};

export default Navigation;
