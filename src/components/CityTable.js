import React from "react";
import styles from "../styles/CustomerTable.module.css";

const CityTable = ({
  customers,
  onEdit,
  onDelete,
  onSearch,
  searchQuery,
}) => {

  const statusMapping = {
    0: "inactive",
    1: "active",
    3: "admin",
  };

  function trimCity(city) {
    const [cityName, country] = city.split(", ").map((part) => part.trim());
    return [cityName, country];
  }
  



  return (
    <div className={styles.tableContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search City..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
      <table className={styles.table}>
  <thead>
    <tr>
      <th>Image</th>
      <th>City</th>
      <th>Country</th>
      <th>Date Added</th>
      <th className={styles.actionsColumn}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {customers
      .filter((city) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          city.name.toLowerCase().includes(searchLower) ||
          city.email.toLowerCase().includes(searchLower)
        );
      })
      .map((city) => {
        const [cityName, country] = trimCity(city.name); // 👈 call trimCity here

        return (
          <tr key={city.user_id}>
            <td>
              {city.places?.[0]?.thumbnail && (
                <img
                  src={city.places[0].thumbnail}
                  alt={city.places[0].title || "Place Thumbnail"}
                  width="100"
                />
              )}
            </td>
            <td>{cityName}</td>
            <td>{country}</td>
            <td>{city.last_active}</td>
            <td>
              <div className={styles.actions}>
                <button
                  className={styles.editButton}
                  onClick={() => onEdit(city)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete(city.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        );
      })}
  </tbody>
</table>

      </div>
    </div>
  );
};

export default CityTable;
