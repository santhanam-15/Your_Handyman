import React, { useState, useEffect } from 'react';

const styles = {
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '8px'
  },
  tab: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    transition: 'all 0.2s ease'
  },
  tabActive: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  grid: {
    display: 'grid',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #f3f4f6'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  serviceInfo: {
    flex: 1
  },
  serviceName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px'
  },
  bookingId: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '8px'
  },
  status: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  statusConfirmed: {
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  detailLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px'
  },
  detailValue: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500'
  },
  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db'
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    color: 'white'
  },
  noBookings: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280'
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '8px',
    marginBottom: '20px'
  }
};

export default function MyBookingsPage({ user }) {
  const [activeTab, setActiveTab] = useState('confirmed');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
      
        const response = await fetch(`http://localhost:5000/api/customer/bookings/${user.user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();

        // Only keep confirmed and pending bookings
        const filtered = data.filter(b => {
          const status = b.status?.toLowerCase();
          return status === 'confirmed' || status === 'pending';
        });

        // Confirmed bookings appear first
        const sorted = filtered.sort((a, b) => {
          const statusA = a.status.toLowerCase();
          const statusB = b.status.toLowerCase();
          return (statusB === 'confirmed') - (statusA === 'confirmed');
        });

        setBookings(sorted);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user.user_id]);

  const filteredBookings = activeTab === 'All'
    ? bookings
    : bookings.filter(booking =>
        activeTab.toLowerCase() === booking.status.toLowerCase()
      );

  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/customer/bookings/${bookingId}/cancel`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'cancelled' })
        });

        if (!response.ok) {
          throw new Error('Failed to cancel booking');
        }

        // Remove cancelled booking from list
        setBookings(bookings.filter(b => b.booking_id !== bookingId));
      } catch (err) {
        console.error('Error cancelling booking:', err);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const rescheduleBooking = (bookingId) => {
    alert(`Reschedule booking #${bookingId}`);
  };

  const getStatusStyle = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'pending': return { ...styles.status, ...styles.statusPending };
      case 'confirmed': return { ...styles.status, ...styles.statusConfirmed };
      default: return styles.status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  const tabs = [
    { key: 'All', label: 'All Bookings', count: bookings.length },
    { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status.toLowerCase() === 'confirmed').length },
    { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status.toLowerCase() === 'pending').length }
  ];

  if (loading) {
    return (
      <div>
        <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>My Bookings</h1>
        <div style={styles.loading}>Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>My Bookings</h1>

      {error && <div style={styles.error}>Error: {error}</div>}

      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filteredBookings.map(booking => (
          <div key={booking.booking_id} style={styles.card}>
            <div style={styles.header}>
              <div style={styles.serviceInfo}>
                <div style={styles.serviceName}>{booking.service_name}</div>
                <div style={styles.bookingId}>Booking ID: BK{String(booking.booking_id).padStart(6, '0')}</div>
                <span style={getStatusStyle(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>
                {formatCurrency(booking.total_amount || booking.amount)}
              </div>
            </div>

            <div style={styles.details}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Date</span>
                <span style={styles.detailValue}>{formatDate(booking.booking_date)}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Time</span>
                <span style={styles.detailValue}>{formatTime(booking.booking_date)}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Service Provider</span>
                <span style={styles.detailValue}>{booking.staff_name || 'Not Assigned'}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Service Address</span>
                <span style={styles.detailValue}>{booking.service_address || 'Your registered address'}</span>
              </div>
            </div>

            <div style={styles.actions}>
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <>
                  <button
                    style={{ ...styles.button, ...styles.secondaryButton }}
                    onClick={() => rescheduleBooking(booking.booking_id)}
                  >
                    Reschedule
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.dangerButton }}
                    onClick={() => cancelBooking(booking.booking_id)}
                  >
                    Cancel Booking
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && !loading && (
        <div style={styles.noBookings}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ color: '#374151', marginBottom: '8px' }}>No bookings found</h3>
          <p>You don't have any {activeTab.toLowerCase()} bookings at the moment.</p>
        </div>
      )}
    </div>
  );
}
