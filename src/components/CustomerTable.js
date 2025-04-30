import React from "react";
import styles from "../styles/CustomerTable.module.css";

const CustomerTable = ({
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
  return (
    <div className={styles.tableContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Last Active</th>
              <th className={styles.actionsColumn}>Actions</th>
            </tr>
          </thead>
          <tbody>
          {customers
            .filter((customer) => {
              const searchLower = searchQuery.toLowerCase();
              return (
                customer.name.toLowerCase().includes(searchLower) ||
                customer.email.toLowerCase().includes(searchLower)
              );
            })
            .map((customer) => (
              <tr key={customer.user_id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[statusMapping[customer.status]] || ""
                    }`}
                  >
                    {statusMapping[customer.status] || "Unknown"}
                  </span>
                </td>
                <td>{customer.last_active}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() => onEdit(customer)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => onDelete(customer.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
