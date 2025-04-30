import React from "react";
import styles from "../styles/StatsCard.module.css";

const StatsCard = ({ title, value, status }) => {
  console.log(value)
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={`${styles.statusDot} ${styles[status]}`} />
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.value}>{value}</div>
    </div>
  );
};

export default StatsCard;
