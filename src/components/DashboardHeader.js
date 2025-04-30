import React from "react";
import styles from "../styles/DashboardHeader.module.css";

import menuIcon from "../media/menu.png";

const DashboardHeader = ({ onAddCustomer, onToggleCollapse }) => {
  return (
    <header className={styles.header}>
      <section className={styles.headerContent}>
        <img className={styles.menuIcon} src={menuIcon} alt="menu icons" onClick={onToggleCollapse} />
        <h1 className={styles.title}>Customer Management</h1>
        <button className={styles.addButton} onClick={onAddCustomer}>
          Add Customer
        </button>
      </section>
    </header>
  );
};

export default DashboardHeader;
