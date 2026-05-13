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
  jobInfo: {
    flex: 1
  },
  serviceName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px'
  },
  jobId: {
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
  statusAssigned: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  statusInProgress: {
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  statusCompleted: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  statusCancelled: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
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
  successButton: {
    backgroundColor: '#10b981',
    color: 'white'
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db'
  },
  noJobs: {
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
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderRadius: '8px',
    marginBottom: '20px'
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
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px',
    borderRadius: '4px'
  },
  modalSection: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '8px'
  },
  modalDetailItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  modalDetailLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px',
    fontWeight: '500'
  },
  modalDetailValue: {
    fontSize: '14px',
    color: '#1f2937',
    fontWeight: '600'
  },
  notesSection: {
    backgroundColor: '#f0f9ff',
    padding: '16px',
    borderRadius: '8px',
    borderLeft: '4px solid #3b82f6'
  },
  notesTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: '8px'
  },
  notesContent: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.5'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  },
  // Payment status styles
  paymentStatus: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  },
  paymentPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  paymentCompleted: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  paymentFailed: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  cashAlert: {
    backgroundColor: '#fffbeb',
    border: '1px solid #f59e0b',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  cashIcon: {
    fontSize: '24px',
    color: '#f59e0b'
  },
  cashMessage: {
    color: '#92400e',
    fontWeight: '600',
    fontSize: '14px'
  }
};

export default function JobsPage({ user }) {
  const [activeTab, setActiveTab] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  // Use the user object passed from dashboard
  const userId = user?.user_id;

  // Fetch jobs from backend
const fetchJobs = async () => {
  if (!userId) {
    setError('User not found');
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);
    const response = await fetch(`http://localhost:5000/api/provider/jobs/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }
    
    const jobsData = await response.json();

    const activeJobs = jobsData.filter(job => 
      job.status === 'Assigned' || job.status === 'In Progress'
    );
    
    setJobs(activeJobs);
  } catch (err) {
    setError(err.message);
    console.error('Error fetching jobs:', err);
  } finally {
    setLoading(false);
  }
};    

  useEffect(() => {
    if (userId) {
      fetchJobs();
    }
  }, [userId]);

  // Fetch payment information for a job
  const fetchPaymentInfo = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/provider/payments/${jobId}`);
      if (response.ok) {
        const paymentData = await response.json();
        setPaymentInfo(paymentData);
      }
    } catch (err) {
      console.error('Error fetching payment info:', err);
    }
  };

  // View job details in modal
  const viewJobDetails = async (job) => {
    try {
      setSelectedJob(job);
      const response = await fetch(`http://localhost:5000/api/provider/jobs/${job.id}/details?user_id=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      
      const jobDetailsData = await response.json();
      setJobDetails(jobDetailsData);
      
      // Fetch payment information
      await fetchPaymentInfo(job.id);
    } catch (err) {
      alert('Error fetching job details: ' + err.message);
    }
  };

  const closeModal = () => {
    setSelectedJob(null);
    setJobDetails(null);
    setPaymentInfo(null);
  };

  const startJob = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/provider/jobs/${jobId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        throw new Error('Failed to start job');
      }

      const result = await response.json();
      
      // Update local state
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: 'In Progress' } : job
      ));
      
      alert(result.message);
    } catch (err) {
      alert('Error starting job: ' + err.message);
    }
  };

  const completeJob = async (jobId) => {
    try {
      // Check if it's cash on delivery and show confirmation
      if (paymentInfo && paymentInfo.payment_method === 'Cash' && paymentInfo.status === 'pending') {
        const confirmCash = window.confirm(
          `💰 Cash on Delivery\n\nAmount: ${paymentInfo.amount}\nPlease collect cash from customer and confirm.`
        );
        
        if (!confirmCash) {
          return;
        }

        // Update payment status to completed for cash payment
        const paymentResponse = await fetch(`http://localhost:5000/api/provider/payments/${jobId}/complete`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId })
        });

        if (!paymentResponse.ok) {
          console.error('Failed to update payment status');
        }
        alert('hi');
      }

      const response = await fetch(`http://localhost:5000/api/provider/jobs/${jobId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        throw new Error('Failed to complete job');
      }

      const result = await response.json();
      
      // Update local state
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: 'Completed' } : job
      ));
      
      // Close modal if open
      if (selectedJob && selectedJob.id === jobId) {
        closeModal();
      }
      
      alert(result.message);
    } catch (err) {
      alert('Error completing job: ' + err.message);
    }
  };

  const cancelJob = async (jobId, reason) => {
    try {
      const response = await fetch(`http://localhost:5000/api/provider/jobs/${jobId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reason: reason,
          user_id: userId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel job');
      }

      const result = await response.json();
      
      // Update local state
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: 'Cancelled' } : job
      ));
      
      alert(result.message);
    } catch (err) {
      alert('Error cancelling job: ' + err.message);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Assigned': return { ...styles.status, ...styles.statusAssigned };
      case 'In Progress': return { ...styles.status, ...styles.statusInProgress };
      case 'Completed': return { ...styles.status, ...styles.statusCompleted };
      case 'Cancelled': return { ...styles.status, ...styles.statusCancelled };
      default: return styles.status;
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'pending': return { ...styles.paymentStatus, ...styles.paymentPending };
      case 'completed': return { ...styles.paymentStatus, ...styles.paymentCompleted };
      case 'failed': return { ...styles.paymentStatus, ...styles.paymentFailed };
      default: return styles.paymentStatus;
    }
  };

  const filteredJobs = activeTab === 'All' 
    ? jobs 
    : jobs.filter(job => job.status === activeTab);

const tabs = [
  { key: 'In Progress', label: 'Assigned for you', count: jobs.filter(j => j.status === 'In Progress').length }
];

  const callCustomer = (phone) => {
    alert(`Calling customer: ${phone}`);
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>My Jobs</h1>
        <div style={styles.loading}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h3 style={{ color: '#374151', marginBottom: '8px' }}>Loading jobs...</h3>
          <p>Please wait while we fetch your jobs</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px', color: '#1f2937' }}>My Jobs</h1>
      
      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchJobs}
            style={{ 
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}
      
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
        {filteredJobs.map(job => (
          <div key={job.id} style={styles.card}>
            <div style={styles.header}>
              <div style={styles.jobInfo}>
                <div style={styles.serviceName}>
                  {job.serviceName}
                </div>
                <div style={styles.jobId}>Job ID: {job.jobId}</div>
                <span style={getStatusStyle(job.status)}>
                  {job.status}
                </span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>
                {job.amount}
              </div>
            </div>

            <div style={styles.details}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Customer</span>
                <span style={styles.detailValue}>{job.customer}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Date & Time</span>
                <span style={styles.detailValue}>
                  {job.date}<br />
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{job.time}</span>
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Contact</span>
                <span style={styles.detailValue}>
                  {job.phone}
                  <button 
                    onClick={() => callCustomer(job.phone)}
                    style={{ 
                      marginLeft: '8px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    Call
                  </button>
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Address</span>
                <span style={styles.detailValue}>{job.address}</span>
              </div>
            </div>

            {job.notes && job.notes !== 'No additional notes' && (
              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '12px', 
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '14px',
                color: '#374151'
              }}>
                <strong>Notes:</strong> {job.notes}
              </div>
            )}

            <div style={styles.actions}>
              {job.status === 'Assigned' && (
                <>
                  <button 
                    style={{...styles.button, ...styles.primaryButton}}
                    onClick={() => startJob(job.id)}
                  >
                    Start Job
                  </button>
                  <button 
                    style={{...styles.button, ...styles.secondaryButton}}
                    onClick={() => viewJobDetails(job)}
                  >
                    View Details
                  </button>
                  <button 
                    style={{...styles.button, ...styles.secondaryButton}}
                    onClick={() => {
                      const reason = prompt('Enter cancellation reason:');
                      if (reason) cancelJob(job.id, reason);
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
              {job.status === 'In Progress' && (
                <>
                  <button 
                    style={{...styles.button, ...styles.successButton}}
                    onClick={() => completeJob(job.id)}
                  >
                    Mark Complete
                  </button>
                  <button 
                    style={{...styles.button, ...styles.secondaryButton}}
                    onClick={() => viewJobDetails(job)}
                  >
                    View Details
                  </button>
                </>
              )}
              {(job.status === 'Completed' || job.status === 'Cancelled') && (
                <button 
                  style={{...styles.button, ...styles.secondaryButton}}
                  onClick={() => viewJobDetails(job)}
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && !loading && (
        <div style={styles.noJobs}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
          <h3 style={{ color: '#374151', marginBottom: '8px' }}>No jobs found</h3>
          <p>You don't have any {activeTab.toLowerCase()} jobs at the moment.</p>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && jobDetails && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Job Details</h2>
              <button style={styles.closeButton} onClick={closeModal}>
                ×
              </button>
            </div>

            {/* Service Information */}
            <div style={styles.modalSection}>
              <h3 style={styles.sectionTitle}>🔧 Service Information</h3>
              <div style={styles.detailGrid}>
                <div style={styles.modalDetailItem}>
                  <span style={styles.modalDetailLabel}>Service Name</span>
                  <span style={styles.modalDetailValue}>{jobDetails.serviceName}</span>
                </div>
                <div style={styles.modalDetailItem}>
                  <span style={styles.modalDetailLabel}>Job ID</span>
                  <span style={styles.modalDetailValue}>{jobDetails.jobId}</span>
                </div>
                <div style={styles.modalDetailItem}>
                  <span style={styles.modalDetailLabel}>Status</span>
                  <span style={getStatusStyle(jobDetails.status)}>
                    {jobDetails.status}
                  </span>
                </div>
                <div style={styles.modalDetailItem}>
                  <span style={styles.modalDetailLabel}>Amount</span>
                  <span style={{...styles.modalDetailValue, color: '#059669'}}>
                    {jobDetails.amount}
                  </span>
                </div>
              </div>
              {jobDetails.serviceDescription && (
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
                  <span style={styles.modalDetailLabel}>Service Description</span>
                  <p style={{ margin: '8px 0 0 0', color: '#374151', fontSize: '14px' }}>
                    {jobDetails.serviceDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div style={styles.modalSection}>
              <h3 style={styles.sectionTitle}>👤 Customer Information</h3>
              <div style={styles.detailGrid}>
                <div style={styles.modalDetailItem}>
                  <span style={styles.modalDetailLabel}>Customer Name</span>
                  <span style={styles.modalDetailValue}>{jobDetails.customer}</span>
                </div>
                <div style={styles.modalDetailItem}>
                  <span style={styles.modalDetailLabel}>Email</span>
                  <span style={styles.modalDetailValue}>{jobDetails.email}</span>
                </div>
                <div style={styles.modalDetailItem}>
                  <span style={styles.modalDetailLabel}>Phone</span>
                  <span style={styles.modalDetailValue}>
                    {jobDetails.phone}
                    <button 
                      onClick={() => callCustomer(jobDetails.phone)}
                      style={{ 
                        marginLeft: '8px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Call
                    </button>
                  </span>
                </div>
                <div style={styles.modalDetailItem}>
                  <span style={styles.modalDetailLabel}>Address</span>
                  <span style={styles.modalDetailValue}>{jobDetails.address}</span>
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            <div style={styles.modalSection}>
              <h3 style={styles.sectionTitle}>📅 Schedule</h3>
              <div style={styles.detailGrid}>
                <div style={styles.modalDetailItem}>
                  <span style={styles.modalDetailLabel}>Date</span>
                  <span style={styles.modalDetailValue}>{jobDetails.date}</span>
                </div>
                <div style={styles.modalDetailItem}>
                  <span style={styles.modalDetailLabel}>Time</span>
                  <span style={styles.modalDetailValue}>{jobDetails.time}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {paymentInfo && (
              <div style={styles.modalSection}>
                <h3 style={styles.sectionTitle}>💳 Payment Information</h3>
                <div style={styles.detailGrid}>
                  <div style={styles.modalDetailItem}>
                    <span style={styles.modalDetailLabel}>Amount</span>
                    <span style={{...styles.modalDetailValue, color: '#059669'}}>
                      {paymentInfo.amount}
                    </span>
                  </div>
                  <div style={styles.modalDetailItem}>
                    <span style={styles.modalDetailLabel}>Payment Method</span>
                    <span style={styles.modalDetailValue}>{paymentInfo.payment_method}</span>
                  </div>
                  <div style={styles.modalDetailItem}>
                    <span style={styles.modalDetailLabel}>Status</span>
                    <span style={getPaymentStatusStyle(paymentInfo.status)}>
                      {paymentInfo.status?.charAt(0).toUpperCase() + paymentInfo.status?.slice(1)}
                    </span>
                  </div>
                </div>
                
                {/* Cash on Delivery Alert */}
                {paymentInfo.payment_method === 'Cash' && paymentInfo.status === 'pending' && (
                  <div style={styles.cashAlert}>
                    <div style={styles.cashIcon}>💰</div>
                    <div style={styles.cashMessage}>
                      Cash on Delivery - Please collect {paymentInfo.amount} from customer upon job completion
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {jobDetails.notes && jobDetails.notes !== 'No additional notes' && (
              <div style={styles.modalSection}>
                <h3 style={styles.sectionTitle}>📝 Notes</h3>
                <div style={styles.notesSection}>
                  <div style={styles.notesContent}>{jobDetails.notes}</div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={styles.modalActions}>
              <button 
                style={{...styles.button, ...styles.secondaryButton}}
                onClick={closeModal}
              >
                Close
              </button>
              {jobDetails.status === 'In Progress' && (
                <button 
                  style={{...styles.button, ...styles.successButton}}
                  onClick={() => completeJob(jobDetails.id)}
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

