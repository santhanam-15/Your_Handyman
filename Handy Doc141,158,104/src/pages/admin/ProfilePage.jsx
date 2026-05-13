import React, { useState, useEffect } from 'react';

export default function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);
        setLoading(true);
        
        const response = await fetch('http://localhost:5000/api/admin/profile');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProfile(data);
        setEditForm({
          name: data.name,
          email: data.email,
          phone: data.phone || ''
        });
      } catch (err) {
        setError('Failed to load profile: ' + err.message);
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone || ''
    });
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleChangePassword = () => {
    setIsChangingPassword(true);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);
      setSaveSuccess(null);

      const response = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfile(data.profile);
      setIsEditing(false);
      setSaveSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSavePassword = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);
      setSaveSuccess(null);

      // Validate passwords match
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setSaveError("New passwords don't match");
        return;
      }

      // Validate password length
      if (passwordForm.newPassword.length < 6) {
        setSaveError("New password must be at least 6 characters long");
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setIsChangingPassword(false);
      setSaveSuccess('Password changed successfully!');
      
      // Clear form and success message after 3 seconds
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}></div>
      <p style={styles.loadingText}>Loading your profile...</p>
    </div>
  );

  if (error) return (
    <div style={styles.errorContainer}>
      <div style={styles.errorIcon}>⚠️</div>
      <h3 style={styles.errorTitle}>Something went wrong</h3>
      <p style={styles.errorMessage}>{error}</p>
      <button style={styles.retryButton} onClick={handleRetry}>
        Try Again
      </button>
    </div>
  );

  if (!profile) return (
    <div style={styles.emptyContainer}>
      <div style={styles.emptyIcon}>📄</div>
      <h3 style={styles.emptyTitle}>No profile data available</h3>
      <p style={styles.emptyMessage}>Please check your connection or contact support.</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Profile</h1>
        <div style={styles.roleBadge}>{profile.role}</div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div style={styles.successMessage}>
          <span style={styles.successIcon}>✅</span>
          {saveSuccess}
        </div>
      )}

      {/* Error Message */}
      {saveError && (
        <div style={styles.errorMessageBanner}>
          <span style={styles.errorIcon}>⚠️</span>
          {saveError}
        </div>
      )}
      
      <div style={styles.card}>
        <div style={styles.avatarSection}>
          <div style={styles.avatarCircle}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 style={styles.profileName}>{profile.name}</h2>
          <p style={styles.profileEmail}>{profile.email}</p>
        </div>

        <div style={styles.detailsSection}>
          {!isEditing && !isChangingPassword ? (
            <>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Personal Information</h3>
                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>User ID</label>
                    <div style={styles.detailValue}>{profile.user_id}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Full Name</label>
                    <div style={styles.detailValue}>{profile.name}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Email Address</label>
                    <div style={styles.detailValue}>
                      <a href={`mailto:${profile.email}`} style={styles.emailLink}>
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Phone Number</label>
                    <div style={styles.detailValue}>
                      {profile.phone || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Account Information</h3>
                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Role</label>
                    <div style={styles.roleBadgeSmall}>{profile.role}</div>
                  </div>
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Join Date</label>
                    <div style={styles.detailValue}>
                      {new Date(profile.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Member Since</label>
                    <div style={styles.detailValue}>
                      {Math.floor((new Date() - new Date(profile.joinDate)) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : isEditing ? (
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Edit Profile</h3>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    style={styles.formInput}
                    placeholder="Enter your full name"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditFormChange}
                    style={styles.formInput}
                    placeholder="Enter your email address"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditFormChange}
                    style={styles.formInput}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Change Password</h3>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Current Password *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordFormChange}
                    style={styles.formInput}
                    placeholder="Enter current password"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                    style={styles.formInput}
                    placeholder="Enter new password (min. 6 characters)"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Confirm New Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFormChange}
                    style={styles.formInput}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={styles.actionsSection}>
          {!isEditing && !isChangingPassword ? (
            <>
              <button style={styles.primaryButton} onClick={handleEditProfile}>
                Edit Profile
              </button>
              <button style={styles.secondaryButton} onClick={handleChangePassword}>
                Change Password
              </button>
            </>
          ) : isEditing ? (
            <>
              <button 
                style={styles.primaryButton} 
                onClick={handleSaveProfile}
                disabled={saveLoading}
              >
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                style={styles.secondaryButton} 
                onClick={handleCancelEdit}
                disabled={saveLoading}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                style={styles.primaryButton} 
                onClick={handleSavePassword}
                disabled={saveLoading}
              >
                {saveLoading ? 'Changing...' : 'Change Password'}
              </button>
              <button 
                style={styles.secondaryButton} 
                onClick={handleCancelPasswordChange}
                disabled={saveLoading}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e1e5e9',
  },
  title: {
    color: '#2c3e50',
    margin: 0,
    fontSize: '2rem',
    fontWeight: 600,
  },
  roleBadge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  avatarSection: {
    textAlign: 'center',
    padding: '3rem 2rem 2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  avatarCircle: {
    width: '80px',
    height: '80px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0 auto 1rem',
    border: '3px solid rgba(255, 255, 255, 0.3)',
  },
  profileName: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
  },
  profileEmail: {
    opacity: 0.9,
    margin: 0,
    fontSize: '1rem',
  },
  detailsSection: {
    padding: '2rem',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    color: '#2d3748',
    marginBottom: '1rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e2e8f0',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  detailLabel: {
    color: '#718096',
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    color: '#2d3748',
    fontWeight: 500,
    fontSize: '1rem',
  },
  emailLink: {
    color: '#667eea',
    textDecoration: 'none',
  },
  roleBadgeSmall: {
    background: '#e9d8fd',
    color: '#6b46c1',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: 600,
    display: 'inline-block',
    width: 'fit-content',
  },
  actionsSection: {
    padding: '1.5rem 2rem',
    background: '#f7fafc',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  primaryButton: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    background: 'white',
    color: '#667eea',
    border: '1px solid #667eea',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
  },
  // Form Styles
  formSection: {
    marginBottom: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  formLabel: {
    color: '#2d3748',
    fontWeight: 500,
    fontSize: '0.875rem',
  },
  formInput: {
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
  },
  // Message Styles
  successMessage: {
    background: '#f0fff4',
    color: '#276749',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #9ae6b4',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  errorMessageBanner: {
    background: '#fed7d7',
    color: '#c53030',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #feb2b2',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  successIcon: {
    fontSize: '1.2rem',
  },
  // Loading and Error States
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  loadingText: {
    color: '#666',
    fontSize: '1.1rem',
    margin: 0,
  },
  errorContainer: {
    textAlign: 'center',
    padding: '3rem 2rem',
    background: '#fff5f5',
    borderRadius: '12px',
    border: '1px solid #fed7d7',
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  errorTitle: {
    color: '#c53030',
    marginBottom: '1rem',
  },
  errorMessage: {
    color: '#718096',
    marginBottom: '2rem',
  },
  retryButton: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '3rem 2rem',
    background: '#f7fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    color: '#2d3748',
    marginBottom: '1rem',
  },
  emptyMessage: {
    color: '#718096',
  },
};

// Add CSS for animations
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

// Add hover effects
styles.primaryButton[':hover'] = {
  background: '#5a6fd8',
  transform: 'translateY(-1px)',
};

styles.secondaryButton[':hover'] = {
  background: '#f7fafc',
  transform: 'translateY(-1px)',
};

styles.emailLink[':hover'] = {
  textDecoration: 'underline',
};

styles.retryButton[':hover'] = {
  background: '#5a6fd8',
};

styles.formInput[':focus'] = {
  outline: 'none',
  borderColor: '#667eea',
  boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
};

// Disabled state for buttons
styles.primaryButton[':disabled'] = {
  background: '#a0aec0',
  cursor: 'not-allowed',
  transform: 'none',
};

styles.secondaryButton[':disabled'] = {
  color: '#a0aec0',
  borderColor: '#a0aec0',
  cursor: 'not-allowed',
  transform: 'none',
};