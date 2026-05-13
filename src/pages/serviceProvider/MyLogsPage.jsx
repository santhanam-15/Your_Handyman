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

// --- Main Component ---
export default function ProviderLogsPage({ user }) {
  const [serviceLogs, setServiceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      // Fetch completed and cancelled jobs for this provider using user_id
      const response = await fetch(`http://localhost:5000/api/provider/logs/${user_id}`);
      
      if (!response.ok) {

        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Server error: ${response.status} ${response.statusText} - ${errorData.message || ''}`);
      }

      const data = await response.json();
      setServiceLogs(data);

    } catch (err) {
      setError(err.message || 'Failed to load service history.');
    } finally {
      setLoading(false);
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
        <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>My Service History</h1>
        <div style={styles.loading}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h3>Loading service history...</h3>
          <p>Please wait while we fetch your completed jobs.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>My Service History</h1>
        <div style={styles.error}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3>Error loading data</h3>
          <p>{error}</p>
          <button 
            onClick={fetchServiceLogs} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>My Service History</h1>

      <div style={styles.card}>
        {serviceLogs.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
<table style={styles.table}>
  <thead>
    <tr>
      <th style={styles.th}>Service</th>
      <th style={styles.th}>Completed Date</th>
      <th style={styles.th}>Customer</th>
      <th style={styles.th}>Amount</th>
      <th style={styles.th}>Rating</th>
      <th style={styles.th}>Customer Feedback</th>
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
        <td style={styles.td}>{log.customer}</td>
        <td style={styles.td}>{log.amount}</td>
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
      </tr>
    ))}
  </tbody>
</table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h3>No service history yet</h3>
            <p>Your completed cancelled services will appear here once you finish jobs.</p>
          </div>
        )}
      </div>
    </div>
  );
}