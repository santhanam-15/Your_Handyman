// UserManagementPage.jsx
import React, { useState, useEffect } from 'react';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
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
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '14px'
  },
  deleteBtn: {
    backgroundColor: '#ef4444'
  },
  viewBtn: {
    backgroundColor: '#10b981'
  },
  statusActive: {
    color: '#10b981',
    fontWeight: 'bold'
  },
  statusInactive: {
    color: '#ef4444',
    fontWeight: 'bold'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    marginRight: '8px'
  },
  userCell: {
    display: 'flex',
    alignItems: 'center'
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '16px'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px'
  },
  cancelBtn: {
    backgroundColor: '#6b7280'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px'
  },
  infoItem: {
    marginBottom: '12px'
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '4px'
  },
  infoValue: {
    color: '#6b7280'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '2px solid #e5e7eb'
  },
  logsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px'
  },
  logsTh: {
    backgroundColor: '#f3f4f6',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #d1d5db',
    fontWeight: 'bold',
    color: '#374151',
    fontSize: '14px'
  },
  logsTd: {
    padding: '10px',
    borderBottom: '1px solid #e5e7eb',
    color: '#6b7280',
    fontSize: '14px'
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#d97706'
  },
  statusConfirmed: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8'
  },
  statusCompleted: {
    backgroundColor: '#dcfce7',
    color: '#16a34a'
  },
  statusCancelled: {
    backgroundColor: '#fee2e2',
    color: '#dc2626'
  },
  noLogs: {
    textAlign: 'center',
    padding: '20px',
    color: '#9ca3af',
    fontStyle: 'italic'
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
  }
};

export default function UserManagementPage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter customers based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = customers.filter(customer => 
        customer.name?.toLowerCase().includes(lowercasedSearch) ||
        customer.email?.toLowerCase().includes(lowercasedSearch) ||
        customer.phone?.toLowerCase().includes(lowercasedSearch) ||
        customer.address?.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  // Fetch customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/customers');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched customers:', data);
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerBookings = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/customers/${customerId}/bookings`);
      if (response.ok) {
        const data = await response.json();
        setCustomerBookings(data);
      } else {
        setCustomerBookings([]);
      }
    } catch (err) {
      console.error('Error fetching customer bookings:', err);
      setCustomerBookings([]);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/customers/${userId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete customer');
        }

        // Remove customer from local state
        const updatedCustomers = customers.filter(customer => customer.user_id !== userId);
        setCustomers(updatedCustomers);
        setFilteredCustomers(updatedCustomers.filter(customer => 
          !searchTerm.trim() || 
          customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.address?.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      } catch (err) {
        alert('Error deleting customer: ' + err.message);
        console.error('Error deleting customer:', err);
      }
    }
  };

  const handleView = async (customer) => {
    setSelectedCustomer(customer);
    await fetchCustomerBookings(customer.user_id);
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending':
        return { ...styles.statusBadge, ...styles.statusPending };
      case 'confirmed':
        return { ...styles.statusBadge, ...styles.statusConfirmed };
      case 'completed':
        return { ...styles.statusBadge, ...styles.statusCompleted };
      case 'cancelled':
        return { ...styles.statusBadge, ...styles.statusCancelled };
      default:
        return styles.statusBadge;
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading customers...</div>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        Error: {error}
        <br />
        <button 
          style={styles.button} 
          onClick={fetchCustomers}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ color: '#1f2937' }}>Customer Management</h1>
      </div>
      
      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search customers by name, email, phone, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.resultsCount}>
          {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'} found
        </div>
      </div>
      
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Join Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.user_id}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <div style={styles.avatar}>
                      {getInitials(customer.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>{customer.name}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>{customer.email}</td>
                <td style={styles.td}>{customer.phone || 'Not provided'}</td>
                <td style={styles.td}>{customer.address || 'Not provided'}</td>
                <td style={styles.td}>{formatDate(customer.created_at)}</td>
                <td style={styles.td}>
                  <div style={styles.actionGroup}>
                    <button 
                      style={{...styles.button, ...styles.viewBtn}}
                      onClick={() => handleView(customer)}
                    >
                      View
                    </button>
                    <button 
                      style={{...styles.button, ...styles.deleteBtn}}
                      onClick={() => handleDelete(customer.user_id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <div style={styles.loading}>
            {searchTerm ? `No customers found for "${searchTerm}"` : 'No customers found.'}
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>Customer Details</h2>
              <button 
                style={{...styles.button, ...styles.cancelBtn}}
                onClick={() => setSelectedCustomer(null)}
              >
                ×
              </button>
            </div>
            
            {/* Customer Information */}
            <div style={styles.sectionTitle}>Customer Information</div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Name</div>
                <div style={styles.infoValue}>{selectedCustomer.name}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Email</div>
                <div style={styles.infoValue}>{selectedCustomer.email}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Phone</div>
                <div style={styles.infoValue}>{selectedCustomer.phone || 'Not provided'}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Join Date</div>
                <div style={styles.infoValue}>{formatDate(selectedCustomer.created_at)}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Address</div>
                <div style={styles.infoValue}>{selectedCustomer.address || 'Not provided'}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Customer ID</div>
                <div style={styles.infoValue}>{selectedCustomer.customer_id || selectedCustomer.user_id}</div>
              </div>
            </div>

            {/* Booking Logs */}
            <div style={styles.sectionTitle}>Booking History</div>
            {customerBookings.length > 0 ? (
              <table style={styles.logsTable}>
                <thead>
                  <tr>
                    <th style={styles.logsTh}>Booking ID</th>
                    <th style={styles.logsTh}>Service</th>
                    <th style={styles.logsTh}>Booking Date</th>
                    <th style={styles.logsTh}>Amount</th>
                    <th style={styles.logsTh}>Status</th>
                    <th style={styles.logsTh}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {customerBookings.map(booking => (
                    <tr key={booking.booking_id}>
                      <td style={styles.logsTd}>#{booking.booking_id}</td>
                      <td style={styles.logsTd}>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                          {booking.service_name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {booking.service_category}
                        </div>
                      </td>
                      <td style={styles.logsTd}>{formatDateTime(booking.booking_date)}</td>
                      <td style={styles.logsTd}>${booking.total_amount || booking.service_price || '0.00'}</td>
                      <td style={styles.logsTd}>
                        <span style={getStatusBadgeStyle(booking.status)}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </span>
                      </td>
                      <td style={styles.logsTd}>{formatDate(booking.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.noLogs}>No booking history found for this customer.</div>
            )}

            <div style={styles.modalActions}>
              <button 
                style={{...styles.button, ...styles.cancelBtn}}
                onClick={() => setSelectedCustomer(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}