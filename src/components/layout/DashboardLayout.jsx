import React from 'react';
import Sidebar from './Sidebar';

const styles = {
  container: { 
    display: "flex", 
    height: "100vh",
    fontFamily: 'Arial, sans-serif'
  },
  main: { 
    flexGrow: 1, 
    padding: "30px",
    backgroundColor: "#f5f5f5",
    overflowY: "auto"
  }
};

export default function DashboardLayout({ role, selected, children, onNavSelect }) {
  return (
    <div style={styles.container}>
      <Sidebar role={role} selected={selected} onSelect={onNavSelect} />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}