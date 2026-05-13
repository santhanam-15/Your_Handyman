import React from 'react';
import { NAV_ITEMS } from '../../constants/navItems';

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "#1f2937",
    color: "white",
    padding: "20px",
    boxSizing: "border-box",
    overflowY: "auto"
  },
  title: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    borderBottom: "1px solid #374151",
    paddingBottom: "10px",
    color: "#f9fafb"
  },
  navList: {
    listStyleType: "none",
    padding: 0,
    margin: 0
  },
  navItem: {
    marginBottom: "8px"
  },
  navButton: {
    backgroundColor: "transparent",
    color: "#d1d5db",
    border: "none",
    padding: "12px 16px",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center"
  },
  navButtonActive: {
    backgroundColor: "#3b82f6",
    color: "white",
    fontWeight: "600"
  },
  navButtonHover: {
    backgroundColor: "#374151",
    color: "white"
  }
};

export default function Sidebar({ role, selected, onSelect }) {
  const navItems = NAV_ITEMS[role] || [];

  return (
    <nav style={styles.sidebar}>
      <h2 style={styles.title}>
        {role?.charAt(0).toUpperCase() + role?.slice(1)} Dashboard
      </h2>
      <ul style={styles.navList}>
        {navItems.map((item) => (
          <li key={item} style={styles.navItem}>
            <button
              onClick={() => onSelect(item)}
              style={{
                ...styles.navButton,
                ...(selected === item ? styles.navButtonActive : {})
              }}
              onMouseOver={(e) => {
                if (selected !== item) {
                  e.target.style.backgroundColor = styles.navButtonHover.backgroundColor;
                  e.target.style.color = styles.navButtonHover.color;
                }
              }}
              onMouseOut={(e) => {
                if (selected !== item) {
                  e.target.style.backgroundColor = styles.navButton.backgroundColor;
                  e.target.style.color = styles.navButton.color;
                }
              }}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}