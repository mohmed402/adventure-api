import React from "react";
import styles from "../styles/CustomerTable.module.css";

const CityTable = ({
  customers,
  onEdit,
  onDelete,
  onSearch,
  searchQuery,
}) => {

// console.log(customers[0])
console.log(customers[0]?.raw?.imageUrls[0]);

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
      .map((city, i) => {
        const [cityName, country] = trimCity(city.name);

        return (
          <tr key={city.user_id}>
           <td>
            {city.raw?.imageUrls?.[0] && (
              <img
                src={city.raw.imageUrls[0]}
                alt={city.raw?.places?.[0]?.title || "City Image"}
                width="100"
                className={styles.cityImg}
              />  
            )}
            </td>
            <td>{cityName}</td>
            <td>{country}</td>
            <td>{new Date(city.created_at).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}</td>

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
