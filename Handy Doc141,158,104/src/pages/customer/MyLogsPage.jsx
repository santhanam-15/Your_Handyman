import React, { useState, useEffect } from 'react';

// --- Styles ---
const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    padding: '24px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
    color: '#4b5563',
    fontWeight: '600',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    color: '#374151',
    verticalAlign: 'top',
  },
  reviewButton: {
    padding: '6px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontWeight: '500'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  star: {
    color: '#fbbf24',
    fontSize: '16px',
  },
  statusCompleted: {
    padding: '4px 8px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '999px',
    fontWeight: '500',
    fontSize: '13px',
  },
  statusCancelled: {
    padding: '4px 8px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '999px',
    fontWeight: '500',
    fontSize: '13px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#6b7280',
  },
  loading: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#6b7280',
  },
  error: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#b91c1c',
  }
};

// --- Review Modal ---
function ReviewModal({ isOpen, onClose, booking, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (booking) {
      setRating(booking.rating || 0);
      setComment(booking.feedback !== 'No feedback provided' ? booking.feedback : '');
    }
  }, [booking]);

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }

    onSubmit(booking.id, rating, comment);
    onClose();
  };

  if (!isOpen || !booking) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '8px',
        width: '400px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>
          Review for: {booking.serviceName}
        </h2>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Rating:</label>
          <div style={{ fontSize: '20px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{ cursor: 'pointer', color: star <= rating ? '#fbbf24' : '#d1d5db' }}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Feedback:</label>
          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback..."
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              fontFamily: 'inherit'
            }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            marginBottom: '8px'
          }}
        >
          Submit Review
        </button>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '8px',
            background: 'transparent',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function CustomerLogsPage({ user }) {
  const [serviceLogs, setServiceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (user?.user_id) {
      fetchServiceLogs();
    } else {
      setError('User not authenticated. Please log in again.');
      setLoading(false);
    }
  }, [user]);

  const fetchServiceLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const user_id = user?.user_id;

      if (!user_id) throw new Error('User not authenticated');

      let response = await fetch(`http://localhost:5000/api/customer/bookings/${user_id}/logs`);

      if (response.status === 404) {
        response = await fetch(`http://localhost:5000/api/customer/bookings/${user_id}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const allBookings = await response.json();
        const filtered = allBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

        const transformed = filtered.map(b => ({
          id: b.booking_id,
          serviceName: b.service_name,
          date: new Date(b.booking_date).toISOString().split('T')[0],
          provider: b.staff_name || 'Not assigned',
          amount: b.total_amount ? `₹${b.total_amount}` : '₹0',
          status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
          rating: null,
          feedback: 'No feedback provided'
        }));

        setServiceLogs(transformed);
      } else if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      } else {
        const data = await response.json();
        setServiceLogs(data);
      }

    } catch (err) {
      setError(err.message || 'Failed to load service history.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (bookingId, rating, comment) => {
    try {
      const response = await fetch(`http://localhost:5000/api/customer/bookings/${bookingId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      alert(`Review submitted successfully!`);
      fetchServiceLogs();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const openReviewModal = (booking) => {
    if (booking.status === 'Completed' && booking.provider !== 'Not assigned') {
      setSelectedBooking(booking);
      setShowReviewModal(true);
    } else {
      alert('Reviews are only available for completed services with assigned providers.');
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not rated</span>;

    return (
      <div style={styles.rating}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={styles.star}>
            {i < rating ? '★' : '☆'}
          </span>
        ))}
        <span>({rating}/5)</span>
      </div>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return styles.statusCompleted;
      case 'Cancelled': return styles.statusCancelled;
      default: return {};
    }
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>Service History</h1>
        <div style={styles.loading}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h3>Loading service history...</h3>
          <p>Please wait while we fetch your records.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>Service History</h1>
        <div style={styles.error}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3>Error loading data</h3>
          <p>{error}</p>
          <button onClick={fetchServiceLogs} style={styles.reviewButton}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>Service History</h1>

      <div style={styles.card}>
        {serviceLogs.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Provider</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Rating</th>
                  <th style={styles.th}>Feedback</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {serviceLogs.map(log => (
                  <tr
                    key={log.id}
                    style={{ transition: 'background 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={styles.td}>{log.serviceName}</td>
                    <td style={styles.td}>{log.date}</td>
                    <td style={styles.td}>{log.provider}</td>
                    <td style={styles.td}>{log.amount}</td>
                    <td style={styles.td}>
                      <span style={getStatusStyle(log.status)}>{log.status}</span>
                    </td>
                    <td style={styles.td}>{renderStars(log.rating)}</td>
                    <td style={styles.td}>
                      <div
                        title={log.feedback}
                        style={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {log.feedback}
                      </div>
                    </td>
                    <td style={styles.td}>
                      {log.status === 'Completed' && log.provider !== 'Not assigned' && (
                        <button
                          style={{
                            ...styles.reviewButton,
                            backgroundColor: log.rating ? '#10b981' : '#3b82f6',
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = log.rating ? '#059669' : '#2563eb'}
                          onMouseOut={(e) => e.target.style.backgroundColor = log.rating ? '#10b981' : '#3b82f6'}
                          onClick={() => openReviewModal(log)}
                        >
                          {log.rating ? 'Update Review' : 'Review'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h3>No service history</h3>
            <p>Your completed and cancelled services will appear here.</p>
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        booking={selectedBooking}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
