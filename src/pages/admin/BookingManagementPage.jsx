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
  completeBtn: {
    backgroundColor: '#10b981'
  },
  cancelBtn: {
    backgroundColor: '#ef4444'
  },
  assignBtn: {
    backgroundColor: '#f59e0b'
  },
  statusPending: {
    color: '#f59e0b',
    fontWeight: 'bold'
  },
  statusConfirmed: {
    color: '#3b82f6',
    fontWeight: 'bold'
  },
  statusCompleted: {
    color: '#10b981',
    fontWeight: 'bold'
  },
  statusCancelled: {
    color: '#ef4444',
    fontWeight: 'bold'
  },
  actionGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
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
  // Search and Filter styles
  searchContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchInput: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    minWidth: '200px'
  },
  filterSelect: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'white'
  },
  filterLabel: {
    fontWeight: 'bold',
    color: '#374151',
    marginRight: '8px'
  },
  // Modal styles
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
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '4px',
    fontWeight: 'bold',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'white'
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
  staffList: {
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    padding: '8px'
  },
  staffItem: {
    padding: '8px',
    cursor: 'pointer',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s'
  },
  staffItemHover: {
    backgroundColor: '#f3f4f6'
  },
  selectedStaff: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  noResults: {
    textAlign: 'center',
    padding: '20px',
    color: '#6b7280',
    fontStyle: 'italic'
  }
};

export default function BookingManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigningBooking, setAssigningBooking] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Fetch bookings from backend
  useEffect(() => {
    fetchBookings();
    fetchStaffMembers();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/bookings');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched bookings:', data);
      setBookings(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };


  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking status');
      }

      const result = await response.json();
      
      setBookings(bookings.map(booking => 
        booking.booking_id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Error updating booking status: ' + err.message);
    }
  };

 // In the fetchStaffMembers function, modify to include provider_id
const fetchStaffMembers = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/staff');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch staff members: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched staff members:', data);
    setStaffMembers(data);
  } catch (err) {
    console.error('Error fetching staff members:', err);
    setStaffMembers([]);
  }
};

// Update the assignStaffToBooking function
const assignStaffToBooking = async (bookingId, staffUserId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/admin/bookings/${bookingId}/assign-staff`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ staffId: staffUserId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to assign staff');
    }

    const result = await response.json();
    
    // Refresh bookings to get updated data
    fetchBookings();
    
    setAssigningBooking(null);
    setSelectedStaff('');
    alert('Staff assigned successfully!');
  } catch (err) {
    console.error('Error assigning staff:', err);
    alert('Error assigning staff: ' + err.message);
  }
};

// Add a function to filter staff by service category
const getQualifiedStaff = (serviceCategory) => {
  if (!serviceCategory) return staffMembers;
  
  return staffMembers.filter(staff => 
    staff.skills && staff.skills.includes(serviceCategory)
  );
};
  const handleAssignStaff = (booking) => {
    setAssigningBooking(booking);
    setSelectedStaff(booking.assigned_staff_id || '');
  };

  const handleStaffAssignment = () => {
    if (!selectedStaff) {
      alert('Please select a staff member');
      return;
    }
    assignStaffToBooking(assigningBooking.booking_id, selectedStaff);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'confirmed': return styles.statusConfirmed;
      case 'completed': return styles.statusCompleted;
      case 'cancelled': return styles.statusCancelled;
      default: return {};
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
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  // Filter bookings based on search term and filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      searchTerm === '' ||
      booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.assigned_staff_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.booking_id?.toString().includes(searchTerm);

    const matchesStatus = 
      statusFilter === 'all' || 
      booking.status === statusFilter;

    const matchesDate = 
      dateFilter === '' || 
      (booking.booking_date && booking.booking_date.startsWith(dateFilter));

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return <div style={styles.loading}>Loading bookings...</div>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        Error: {error}
        <br />
        <button 
          style={styles.button} 
          onClick={fetchBookings}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ color: '#1f2937' }}>Booking Management</h1>
      </div>
      
      {/* Search and Filter Section */}
      <div style={styles.card}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search by customer, service, staff, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={styles.filterLabel}>Status:</span>
            <select
              style={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={styles.filterLabel}>Date:</span>
            <input
              type="date"
              style={styles.searchInput}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          
          <button 
            style={{...styles.button, backgroundColor: '#6b7280'}}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDateFilter('');
            }}
          >
            Clear Filters
          </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Booking ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Service</th>
              <th style={styles.th}>Date & Time</th>
              <th style={styles.th}>Assigned Staff</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.booking_id}>
                <td style={styles.td}>#{booking.booking_id}</td>
                <td style={styles.td}>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>
                    {booking.customer_name || `Customer ${booking.customer_id}`}
                  </div>
                  {booking.customer_phone && (
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {booking.customer_phone}
                    </div>
                  )}
                </td>
                <td style={styles.td}>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>
                    {booking.service_name}
                  </div>
                  {booking.service_category && (
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {booking.service_category}
                    </div>
                  )}
                </td>
                <td style={styles.td}>
                  <div>{formatDate(booking.booking_date)}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {formatTime(booking.booking_date)}
                  </div>
                </td>
                <td style={styles.td}>
                  {booking.assigned_staff_name ? (
                    <span style={{
                      backgroundColor: '#e0f2fe',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#0369a1'
                    }}>
                      {booking.assigned_staff_name}
                    </span>
                  ) : (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                      Not assigned
                    </span>
                  )}
                </td>
                <td style={styles.td}>
                  <div style={{ fontWeight: '600', color: '#059669' }}>
                    {formatCurrency(booking.total_amount || booking.service_price || 0)}
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={getStatusStyle(booking.status)}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionGroup}>
                    {booking.status === "pending" && (
                      <>
                        <button 
                          style={{...styles.button, ...styles.assignBtn}}
                          onClick={() => handleAssignStaff(booking)}
                        >
                          Assign Staff
                        </button>
                        <button 
                          style={{...styles.button, ...styles.cancelBtn}}
                          onClick={() => updateBookingStatus(booking.booking_id, "cancelled")}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <>
                        <button 
                          style={{...styles.button, ...styles.completeBtn}}
                          onClick={() => updateBookingStatus(booking.booking_id, "completed")}
                        >
                          Complete
                        </button>
                        <button 
                          style={{...styles.button, ...styles.assignBtn}}
                          onClick={() => handleAssignStaff(booking)}
                        >
                          Reassign
                        </button>
                      </>
                    )}
                    {(booking.status === "completed" || booking.status === "cancelled") && (
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>No actions</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && (
          <div style={styles.noResults}>
            {bookings.length === 0 ? 'No bookings found.' : 'No bookings match your search criteria.'}
          </div>
        )}
      </div>

      {/* Assign Staff Modal */}
      {assigningBooking && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>
                Assign Staff to Booking #{assigningBooking.booking_id}
              </h2>
              <button 
                style={{...styles.button, ...styles.cancelBtn}}
                onClick={() => {
                  setAssigningBooking(null);
                  setSelectedStaff('');
                }}
              >
                ×
              </button>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Service</label>
              <div style={{ padding: '8px 0', color: '#374151' }}>
                {assigningBooking.service_name}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Customer</label>
              <div style={{ padding: '8px 0', color: '#374151' }}>
                {assigningBooking.customer_name || `Customer ${assigningBooking.customer_id}`}
              </div>
            </div>

            <div style={styles.formGroup}>
  <label style={styles.label}>Select Qualified Staff Member *</label>
  <div style={{ marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
    Service Category: <strong>{assigningBooking.service_category}</strong>
  </div>
  <div style={styles.staffList}>
    {getQualifiedStaff(assigningBooking.service_category).length > 0 ? (
      getQualifiedStaff(assigningBooking.service_category).map(staff => (
        <div
          key={staff.user_id}
          style={{
            ...styles.staffItem,
            ...(selectedStaff === staff.user_id ? styles.selectedStaff : {}),
            ...(selectedStaff !== staff.user_id ? styles.staffItemHover : {})
          }}
          onClick={() => setSelectedStaff(staff.user_id)}
        >
          <div style={{ fontWeight: '600' }}>{staff.name}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Skills: {staff.skills?.join(', ')} | Experience: {staff.experience_years || 0} years
          </div>
          {staff.rating && (
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              Rating: {staff.rating}/5
            </div>
          )}
        </div>
      ))
    ) : (
      <div style={styles.noResults}>
        No staff members available with skills in {assigningBooking.service_category}.
        <br />
        <button 
          style={{...styles.button, marginTop: '8px', fontSize: '12px'}}
          onClick={() => {
            // Optionally redirect to staff management
            alert('Please add staff members with the required skills first.');
          }}
        >
          Manage Staff Skills
        </button>
      </div>
    )}
  </div>
</div>

            <div style={styles.modalActions}>
              <button 
                type="button"
                style={{...styles.button, ...styles.cancelBtn}}
                onClick={() => {
                  setAssigningBooking(null);
                  setSelectedStaff('');
                }}
              >
                Cancel
              </button>
              <button 
                type="button"
                style={styles.button}
                onClick={handleStaffAssignment}
                disabled={!selectedStaff}
              >
                Assign Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}