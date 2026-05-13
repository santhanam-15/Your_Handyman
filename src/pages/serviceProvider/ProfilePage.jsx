import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f0f0f0'
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #f1f5f9'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    marginRight: '20px'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px'
  },
  userRole: {
    color: '#64748b',
    fontSize: '16px',
    fontWeight: '500'
  },
  stats: {
    display: 'flex',
    gap: '20px',
    marginTop: '16px'
  },
  stat: {
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    minWidth: '80px'
  },
  statNumber: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: '2px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500'
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  infoItem: {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  label: {
    fontWeight: '600',
    color: '#475569',
    marginBottom: '6px',
    fontSize: '13px',
    textTransform: 'uppercase'
  },
  value: {
    color: '#1e293b',
    fontSize: '15px',
    fontWeight: '500'
  },
  skills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  skill: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: '600'
  },
  button: {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#1e293b'
  },
  inputGroup: {
    marginBottom: '16px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '20px'
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default function ProviderProfilePage({ user }) {
  const [providerData, setProviderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const userId = user?.user_id;

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const fetchProfileData = async () => {
    if (!userId) {
      setMessage({ type: 'error', text: 'User ID not found' });
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/provider/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      setProviderData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setMessage({ type: 'error', text: 'User not found' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/provider/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordModal(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleInputChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage({ type: '', text: '' });
  };

  if (!userId) {
    return <div>Loading user information...</div>;
  }

  if (loading) {
    return <div>Loading profile data...</div>;
  }

  if (!providerData) {
    return <div>Error loading profile data. Please try again.</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={{ 
        marginBottom: '24px', 
        color: '#1e293b', 
        fontSize: '28px', 
        fontWeight: '700'
      }}>
        My Professional Profile
      </h1>
      
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            {providerData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{providerData.name}</div>
            <div style={styles.userRole}>{providerData.specialty}</div>
            <div style={styles.stats}>
              <div style={styles.stat}>
                <div style={styles.statNumber}>{providerData.completedJobs}</div>
                <div style={styles.statLabel}>Completed</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statNumber}>{providerData.ongoingJobs}</div>
                <div style={styles.statLabel}>Ongoing</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statNumber}>{providerData.rating}</div>
                <div style={styles.statLabel}>Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Professional Information</div>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <div style={styles.label}>Specialty</div>
              <div style={styles.value}>{providerData.specialty}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.label}>Experience</div>
              <div style={styles.value}>{providerData.experience}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.label}>Member Since</div>
              <div style={styles.value}>{providerData.joinDate}</div>
            </div>
          </div>
        </div>

        {/* Skills & Services */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Skills & Services</div>
          <div style={styles.skills}>
            {providerData.skills.map((skill, index) => (
              <span key={index} style={styles.skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Contact Information</div>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <div style={styles.label}>Email Address</div>
              <div style={styles.value}>{providerData.email}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.label}>Phone Number</div>
              <div style={styles.value}>{providerData.phone}</div>
            </div>
          </div>
        </div>

        {/* Password Change Button */}
        <div style={{ marginTop: '24px' }}>
          <button 
            style={styles.button}
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalTitle}>Change Password</div>
            
            {message.text && (
              <div style={{
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '14px',
                backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: message.type === 'success' ? '#166534' : '#991b1b'
              }}>
                {message.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div style={styles.inputGroup}>
                <div style={styles.label}>Current Password</div>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                  placeholder="Enter current password"
                />
              </div>
              <div style={styles.inputGroup}>
                <div style={styles.label}>New Password</div>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                  placeholder="Enter new password"
                />
              </div>
              <div style={styles.inputGroup}>
                <div style={styles.label}>Confirm New Password</div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                  placeholder="Confirm new password"
                />
              </div>
              
              <div style={styles.buttonGroup}>
                <button 
                  type="button" 
                  style={styles.secondaryButton}
                  onClick={() => {
                    setShowPasswordModal(false);
                    resetPasswordForm();
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={styles.button}
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}