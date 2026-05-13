import React, { useState, useEffect } from 'react';

// Add Google Font link in your index.html or import it globally:
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">

const styles = {
  container: { 
    padding: '30px 40px',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
    color: '#333',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px'
  },
  title: {
    fontWeight: '700',
    fontSize: '2.2rem',
    color: '#0c4b8e',
  },
  refreshButton: {
    padding: '12px 26px',
    backgroundColor: '#0c4b8e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: '0 4px 8px rgba(12, 75, 142, 0.3)',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  },
  refreshButtonHover: {
    backgroundColor: '#084276',
    boxShadow: '0 6px 12px rgba(8, 66, 118, 0.5)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '22px',
    marginBottom: '40px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '28px 30px',
    borderRadius: '14px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
    borderLeft: '8px solid #0c4b8e',
    cursor: 'default',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  },
  statCardHover: {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  },
  statValue: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#0c4b8e',
    margin: '18px 0 12px',
    fontVariantNumeric: 'tabular-nums',
  },
  statLabel: {
    fontSize: '1.15rem',
    color: '#555',
    fontWeight: '600',
    letterSpacing: '0.02em',
  },
  statDesc: {
    color: '#7a7a7a',
    fontSize: '0.95rem',
    marginTop: '4px',
    fontWeight: '400',
  },
  sectionCard: {
    backgroundColor: 'white',
    padding: '28px 30px',
    borderRadius: '14px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    marginBottom: '35px'
  },
  sectionTitle: {
    color: '#222',
    marginBottom: '22px',
    borderBottom: '3px solid #0c4b8e',
    paddingBottom: '12px',
    fontWeight: '700',
    fontSize: '1.6rem',
    letterSpacing: '0.03em',
  },
  roleStatusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  },
  roleStatusCard: {
    backgroundColor: '#fefefe',
    padding: '18px 22px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    cursor: 'default',
    transition: 'box-shadow 0.3s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: '1.05rem',
    textTransform: 'capitalize',
  },
  roleStatusCount: {
    fontWeight: '700',
    fontSize: '1.3rem',
    color: '#0c4b8e',
  },
  bookingsCountPositive: {
    color: '#28a745',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '55vh',
    fontSize: '1.3rem',
    color: '#666',
    flexDirection: 'column',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '55vh',
    fontSize: '1.3rem',
    color: '#dc3545',
    flexDirection: 'column',
  },
  tryAgainButton: {
    padding: '12px 24px',
    backgroundColor: '#0c4b8e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '18px',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: '0 4px 10px rgba(12, 75, 142, 0.3)',
    transition: 'background-color 0.3s ease',
  },
  tryAgainButtonHover: {
    backgroundColor: '#084276',
  },
  debugContainer: {
    backgroundColor: '#f0f4f8',
    padding: '18px',
    borderRadius: '10px',
    border: '1px solid #d1d9e6',
    marginTop: '25px',
    fontSize: '0.9rem',
    color: '#666',
    fontFamily: 'monospace',
    maxHeight: '150px',
    overflowY: 'auto',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #0c4b8e',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track hover states for cards and buttons for subtle animations
  const [hoveredCard, setHoveredCard] = useState(null);
  const [refreshHover, setRefreshHover] = useState(false);
  const [tryAgainHover, setTryAgainHover] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/superadmin/statistics');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <div>Loading statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div>Error loading statistics: {error}</div>
          <button 
            onClick={fetchStatistics}
            onMouseEnter={() => setTryAgainHover(true)}
            onMouseLeave={() => setTryAgainHover(false)}
            style={{
              ...styles.tryAgainButton,
              ...(tryAgainHover ? styles.tryAgainButtonHover : {})
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>System Statistics Dashboard</h1>
        <button
          onClick={fetchStatistics}
          onMouseEnter={() => setRefreshHover(true)}
          onMouseLeave={() => setRefreshHover(false)}
          style={{
            ...styles.refreshButton,
            ...(refreshHover ? styles.refreshButtonHover : {})
          }}
          aria-label="Refresh statistics data"
        >
          Refresh Data
        </button>
      </div>

      <div style={styles.statsGrid}>
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, desc: 'Registered users in system' },
          { label: 'Total Bookings', value: stats?.totalBookings || 0, desc: 'All-time bookings' },
          { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), desc: 'Total earnings' },
          { label: 'Active Services', value: stats?.activeServices || 0, desc: 'Available services' },
          { label: 'Pending Bookings', value: stats?.pendingBookings || 0, desc: 'Awaiting confirmation' },
          { label: 'Completed Bookings', value: stats?.completedBookings || 0, desc: 'Successfully delivered' },
          { label: 'Recent Registrations', value: stats?.recentRegistrations || 0, desc: 'Last 30 days' },
          { 
            label: 'Avg Provider Rating', 
            value: stats?.providersStats?.avgRating ? parseFloat(stats.providersStats.avgRating).toFixed(1) : '0.0', 
            desc: 'Average service provider rating' 
          },
        ].map((stat, i) => (
          <div 
            key={i} 
            style={{
              ...styles.statCard,
              ...(hoveredCard === i ? styles.statCardHover : {})
            }}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            tabIndex={0} // for keyboard accessibility
            aria-label={`${stat.label}: ${stat.value}`}
          >
            <h3 style={styles.statLabel}>{stat.label}</h3>
            <div style={styles.statValue}>{stat.value}</div>
            <p style={styles.statDesc}>{stat.desc}</p>
          </div>
        ))}
      </div>

      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>Users by Role</h2>
        <div style={styles.roleStatusGrid}>
          {stats?.usersByRole?.map((role, index) => (
            <div key={index} style={styles.roleStatusCard} tabIndex={0} aria-label={`${role.role} users count: ${role.count}`}>
              <span>{role.role.replace('_', ' ')}</span>
              <span style={styles.roleStatusCount}>{role.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>Bookings by Status</h2>
        <div style={styles.roleStatusGrid}>
          {stats?.bookingsByStatus?.map((status, index) => (
            <div key={index} style={styles.roleStatusCard} tabIndex={0} aria-label={`${status.status} bookings count: ${status.count}`}>
              <span>{status.status}</span>
              <span style={{...styles.roleStatusCount, ...styles.bookingsCountPositive}}>{status.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional debug info */}
      {/* <div style={styles.debugContainer}>
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      </div> */}
    </div>
  );
}
