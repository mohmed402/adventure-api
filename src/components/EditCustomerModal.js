import React, { useState } from "react";

import styles from "../styles/EditCustomerModal.module.css";

const EditCustomerModal = ({ customer, onClose, onSave }) => {
  const [editedCustomer, setEditedCustomer] = useState(customer);
  const [isSaving, setIsSaving] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true); 
  
    const { user_id, ...fieldsToUpdate } = editedCustomer;
  
    try {
      await onSave(user_id, fieldsToUpdate);
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false); 
    }
  };
  

  return (
    <section
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="editCustomerTitle"
    >
      <section className={styles.modalContent}>
        <header className={styles.modalHeader}>
          <h2 id="editCustomerTitle" className={styles.modalTitle}>
            Edit Customer
          </h2>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              value={editedCustomer.name}
              onChange={(e) =>
                setEditedCustomer({ ...editedCustomer, name: e.target.value })
              }
              required
            />
          </div>


          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={editedCustomer.email}
              onChange={(e) =>
                setEditedCustomer({ ...editedCustomer, email: e.target.value })
              }
              required
            />
          </div>


          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              className={styles.select}
              value={editedCustomer.status}
              onChange={(e) =>
                setEditedCustomer({
                  ...editedCustomer,
                  status: Number(e.target.value),
                })
              }
              required
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
              <option value="3">Admin</option>
            </select>
          </div>


          <footer className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSaving} 
            >
              Cancel
            </button>
          </footer>
        </form>
      </section>
    </section>
  );
};

export default EditCustomerModal;
