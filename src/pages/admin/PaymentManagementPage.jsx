import React, { useState, useEffect } from 'react';

const styles = {
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px'
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '14px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    backgroundColor: '#f8fafc',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: 'bold',
    color: '#374151'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    color: '#6b7280'
  },
  statusCompleted: {
    color: '#10b981',
    fontWeight: 'bold'
  },
  statusPending: {
    color: '#f59e0b',
    fontWeight: 'bold'
  },
  statusFailed: {
    color: '#ef4444',
    fontWeight: 'bold'
  },
  methodBadge: {
    backgroundColor: '#f3f4f6',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#374151'
  },
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '12px'
  },
  actionGroup: {
    display: 'flex',
    gap: '8px'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#6b7280'
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    color: '#ef4444'
  },
  // Search styles
  searchContainer: {
    marginBottom: '20px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    maxWidth: '400px',
    padding: '10px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  resultsCount: {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500'
  },
  // Status filter
  filterGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '20px'
  },
  filterButton: {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  }
};

export default function PaymentManagementPage() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    average: 0,
    totalCount: 0
  });

  // Filter payments based on search term and status filter
  useEffect(() => {
    if (!searchTerm.trim() && statusFilter === 'all') {
      setFilteredPayments(payments);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = payments.filter(payment => {
        const matchesSearch = !searchTerm.trim() || 
          payment.customer_name?.toLowerCase().includes(lowercasedSearch) ||
          payment.service_name?.toLowerCase().includes(lowercasedSearch) ||
          payment.transaction_id?.toLowerCase().includes(lowercasedSearch) ||
          payment.payment_id?.toString().includes(lowercasedSearch) ||
          payment.booking_id?.toString().includes(lowercasedSearch);
        
        // Use payment_status instead of status
        const paymentStatus = payment.payment_status || payment.status;
        const matchesStatus = statusFilter === 'all' || paymentStatus === statusFilter;
        
        return matchesSearch && matchesStatus;
      });
      
      // Sort by status priority: pending first, then completed, then others
      const sorted = filtered.sort((a, b) => {
        const statusPriority = { pending: 1, completed: 2, failed: 3 };
        const statusA = a.payment_status || a.status;
        const statusB = b.payment_status || b.status;
        return statusPriority[statusA] - statusPriority[statusB];
      });
      
      setFilteredPayments(sorted);
    }
  }, [searchTerm, statusFilter, payments]);

  // Fetch payments and stats from backend
  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/payments');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched payments:', data);
      setPayments(data);
      setFilteredPayments(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/payment-stats');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch payment stats: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched payment stats:', data);
      setStats(data);
    } catch (err) {
      console.error('Error fetching payment stats:', err);
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/payments/${paymentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update payment status');
      }

      const result = await response.json();
      
      // Update local state - handle both payment_status and status fields
      const updatedPayments = payments.map(payment => 
        payment.payment_id === paymentId 
          ? { 
              ...payment, 
              payment_status: newStatus,
              status: newStatus // Update both for backward compatibility
            }
          : payment
      );
      
      setPayments(updatedPayments);
      fetchPaymentStats(); // Refresh stats
      
      alert(result.message);
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Error updating payment status: ' + err.message);
    }
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return styles.statusCompleted;
      case 'pending': return styles.statusPending;
      case 'failed': return styles.statusFailed;
      default: return {};
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'completed': 'Completed',
      'pending': 'Pending',
      'failed': 'Failed'
    };
    return statusMap[status] || status;
  };

  // Helper function to get payment status (handles both payment_status and status fields)
  const getPaymentStatus = (payment) => {
    return payment.payment_status || payment.status;
  };

  if (loading) {
    return <div style={styles.loading}>Loading payments...</div>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        Error: {error}
        <br />
        <button 
          style={styles.button} 
          onClick={fetchPayments}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>Payment Management</h1>
      
      {/* Statistics Cards */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{formatPrice(stats.total)}</div>
          <div style={styles.statLabel}>Total Revenue</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.completed}</div>
          <div style={styles.statLabel}>Completed Payments</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending Payments</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.failed}</div>
          <div style={styles.statLabel}>Failed Payments</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{formatPrice(stats.average)}</div>
          <div style={styles.statLabel}>Average Payment</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search payments by customer, service, transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.resultsCount}>
          {filteredPayments.length} {filteredPayments.length === 1 ? 'payment' : 'payments'} found
        </div>
      </div>

      {/* Status Filter */}
      <div style={styles.filterGroup}>
        <button
          style={{
            ...styles.filterButton,
            ...(statusFilter === 'all' ? styles.filterButtonActive : {})
          }}
          onClick={() => setStatusFilter('all')}
        >
          All Payments
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(statusFilter === 'pending' ? styles.filterButtonActive : {})
          }}
          onClick={() => setStatusFilter('pending')}
        >
          Pending
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(statusFilter === 'completed' ? styles.filterButtonActive : {})
          }}
          onClick={() => setStatusFilter('completed')}
        >
          Completed
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(statusFilter === 'failed' ? styles.filterButtonActive : {})
          }}
          onClick={() => setStatusFilter('failed')}
        >
          Failed
        </button>
      </div>
      
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Payment ID</th>
              <th style={styles.th}>Booking ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Service</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Payment Date</th>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Transaction ID</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => {
              const paymentStatus = getPaymentStatus(payment);
              return (
                <tr key={payment.payment_id}>
                  <td style={styles.td}>#{payment.payment_id}</td>
                  <td style={styles.td}>#{payment.booking_id}</td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {payment.customer_name}
                    </div>
                    {payment.customer_phone && (
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {payment.customer_phone}
                      </div>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>
                      {payment.service_name}
                    </div>
                    {payment.service_category && (
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {payment.service_category}
                      </div>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: '600', color: '#059669' }}>
                      {formatPrice(payment.amount)}
                    </div>
                  </td>
                  <td style={styles.td}>{formatDate(payment.payment_date)}</td>
                  <td style={styles.td}>
                    <span style={styles.methodBadge}>
                      {payment.payment_method || 'N/A'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <code style={{ fontSize: '12px', color: '#6b7280' }}>
                      {payment.transaction_id || 'N/A'}
                    </code>
                  </td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(paymentStatus)}>
                      {getStatusDisplay(paymentStatus)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      {paymentStatus === 'pending' && (
                        <button 
                          style={{...styles.button, backgroundColor: '#10b981'}}
                          onClick={() => handleStatusUpdate(payment.payment_id, 'completed')}
                        >
                          Mark Complete
                        </button>
                      )}
                      {paymentStatus === 'completed' && (
                        <button 
                          style={{...styles.button, backgroundColor: '#f59e0b'}}
                          onClick={() => handleStatusUpdate(payment.payment_id, 'pending')}
                        >
                          Mark Pending
                        </button>
                      )}
                      {paymentStatus !== 'failed' && (
                        <button 
                          style={{...styles.button, backgroundColor: '#ef4444'}}
                          onClick={() => handleStatusUpdate(payment.payment_id, 'failed')}
                        >
                          Mark Failed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredPayments.length === 0 && (
          <div style={styles.loading}>
            {searchTerm || statusFilter !== 'all' 
              ? `No payments found matching your criteria.` 
              : 'No payments found.'}
          </div>
        )}
      </div>
    </div>
  );
}