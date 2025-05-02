"use client";

import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import DashboardHeader from "./DashboardHeader";
import StatsCard from "./StatsCard";
import EditCustomerModal from "./EditCustomerModal";
import styles from "../styles/CustomerDashboard.module.css";
import { handleSaveCustomer } from "../api/handleSaveCustomer";
import getCityData from "../api/getCityData";
import CityTable from "./CityTable";

const CityData = ({setIsProfile, pageNumber, setPageNumber}) => {
  const [customers, setCustomers] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  function closeModal() {
    setShowEditModal(false);
    setSelectedCustomer(null);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCityData();
        if (Array.isArray(response)) {
          setCustomers(response);
        console.log("this is the city-data: ", response)
        } else {
          console.error("No array received from getData:", response);
          setCustomers([]); // fallback to empty array
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    }

    fetchData();
  }, [showEditModal]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 892) {
        setIsNavOpen(true);
      } else {
        setIsNavOpen(false);
      }
    };

    handleResize(); // Check immediately on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDeleteCustomer = (id) => {
    setCustomers((prevCustomers) => (prevCustomers || []).filter((c) => c.id !== id));
  };

  const handleSearchCustomers = (query) => {
    setSearchQuery(query);
  };

  const filteredCustomers = (customers || []).filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    active: (customers || []).filter((c) => c.status === 0).length,
    inactive: (customers || []).filter((c) => c.status === 1).length,
    total: (customers || []).length,
  };

  return (
    <section className={`${styles.dashboard} ${isDarkMode ? styles.dark : ""}`}>
      <Navigation
        selected={pageNumber}
        setPageNumber={setPageNumber}
        isNavOpen={isNavOpen}
        onToggleCollapse={() => setIsNavOpen(!isNavOpen)}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onToggleSignOut={() => setIsProfile(false)}
      />

      <main className={styles.mainContent}>
        <DashboardHeader 
          onAddCustomer={() => setShowAddModal(true)}
          onToggleCollapse={() => setIsNavOpen(!isNavOpen)}
        />

        <div className={styles.content}>
          <section className={styles.statsGrid}>
            <StatsCard title="Active Users" value={stats.active} status="active" />
            <StatsCard title="Inactive Users" value={stats.inactive} status="inactive" />
            <StatsCard title="Total Users" value={stats.total} status="total" />
          </section>

          <CityTable
            customers={filteredCustomers}
            onEdit={(customer) => {
              setSelectedCustomer(customer);
              setShowEditModal(true);
            }}
            onDelete={handleDeleteCustomer}
            onSearch={handleSearchCustomers}
            searchQuery={searchQuery}
          />
        </div>

        {showEditModal && selectedCustomer && (
          <EditCustomerModal
            customer={selectedCustomer}
            onClose={closeModal}
            onSave={async (user_id, updatedCustomer) => {
              await handleSaveCustomer(user_id, updatedCustomer);
              closeModal();
            }}
          />
        )}
      </main>
    </section>
  );
};

export default CityData;
