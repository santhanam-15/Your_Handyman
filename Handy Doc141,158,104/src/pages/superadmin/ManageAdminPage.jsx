import React, { useState, useEffect } from 'react';

const styles = {
  container: { padding: '20px' },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: '20px'
  },
  button: {
    backgroundColor: '#0c4b8e',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa'
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },
  actionButton: {
    padding: '5px 10px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  }
};

export default function ManageAdminPage() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/superadmin/admins');
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      // Send plain text password without any encoding
      const adminData = {
        name: formData.name,
        email: formData.email,
        password: formData.password // Plain text, no encoding
      };

      const response = await fetch('http://localhost:5000/api/superadmin/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ name: '', email: '', password: '' });
        fetchAdmins();
        alert('Admin created successfully!');
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error creating admin');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/superadmin/admins/${adminId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchAdmins();
          alert('Admin deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting admin:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Manage Admins</h1>
        <button 
          style={styles.button}
          onClick={() => setShowModal(true)}
        >
          Create New Admin
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Created Date</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.user_id}>
              <td style={styles.td}>{admin.user_id}</td>
              <td style={styles.td}>{admin.name}</td>
              <td style={styles.td}>{admin.email}</td>
              <td style={styles.td}>{new Date(admin.created_at).toLocaleDateString()}</td>
              <td style={styles.td}>
                <button 
                  style={{...styles.actionButton, backgroundColor: '#dc3545', color: 'white'}}
                  onClick={() => handleDeleteAdmin(admin.user_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Create New Admin</h2>
            <form onSubmit={handleCreateAdmin}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  style={styles.input}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  style={styles.input}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={styles.button}>
                  Create Admin
                </button>
                <button 
                  type="button" 
                  style={{...styles.button, backgroundColor: '#6c757d'}}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}