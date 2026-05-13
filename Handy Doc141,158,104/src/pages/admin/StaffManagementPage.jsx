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
  editBtn: {
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
    maxWidth: '600px',
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
  textarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical'
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
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px'
  },
  skillTag: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  removeSkillBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0'
  },
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '8px',
    marginTop: '8px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
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

const SERVICE_CATEGORIES = [
  'Electrical',
  'Plumbing', 
  'Carpentry',
  'Painting',
  'Cleaning',
  'Appliance',
  'HVAC'
];

export default function StaffManagementPage() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'service_provider',
    experience_years: '',
    rating: '',
    status: 'Active',
    selectedSkills: []
  });

  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'service_provider',
    experience_years: '',
    rating: '',
    status: 'Active',
    password: '',
    selectedSkills: []
  });

  // Filter staff based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStaff(staff);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = staff.filter(member => 
        member.name?.toLowerCase().includes(lowercasedSearch) ||
        member.email?.toLowerCase().includes(lowercasedSearch) ||
        member.phone?.toLowerCase().includes(lowercasedSearch) ||
        (member.skills && member.skills.some(skill => 
          skill.toLowerCase().includes(lowercasedSearch)
        )) ||
        member.role?.toLowerCase().includes(lowercasedSearch) ||
        member.experience_years?.toString().includes(lowercasedSearch) ||
        member.rating?.toString().includes(lowercasedSearch)
      );
      setFilteredStaff(filtered);
    }
  }, [searchTerm, staff]);

  // Fetch staff and available services
  useEffect(() => {
    fetchStaff();
    fetchAvailableServices();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/staff');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch staff: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched staff:', data);
      setStaff(data);
      setFilteredStaff(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setAvailableServices(data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/staff/${userId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete staff');
        }

        const updatedStaff = staff.filter(member => member.user_id !== userId);
        setStaff(updatedStaff);
        setFilteredStaff(updatedStaff.filter(member => 
          !searchTerm.trim() || 
          member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.skills && member.skills.some(skill => 
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )) ||
          member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.experience_years?.toString().includes(searchTerm.toLowerCase()) ||
          member.rating?.toString().includes(searchTerm.toLowerCase())
        ));
      } catch (err) {
        alert('Error deleting staff: ' + err.message);
        console.error('Error deleting staff:', err);
      }
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setEditForm({
      name: staffMember.name || '',
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      role: staffMember.role || 'service_provider',
      experience_years: staffMember.experience_years || '',
      rating: staffMember.rating || '',
      status: staffMember.status || 'Active',
      selectedSkills: staffMember.skills || []
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/admin/staff/${editingStaff.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update staff');
      }

      const result = await response.json();
      
      const updatedStaff = staff.map(member => 
        member.user_id === editingStaff.user_id 
          ? result.staff 
          : member
      );
      setStaff(updatedStaff);
      setFilteredStaff(updatedStaff.filter(member => 
        !searchTerm.trim() || 
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.skills && member.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
        member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.experience_years?.toString().includes(searchTerm.toLowerCase()) ||
        member.rating?.toString().includes(searchTerm.toLowerCase())
      ));
      
      setEditingStaff(null);
    } catch (err) {
      console.error('Error updating staff:', err);
      alert('Enter all fields');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create staff');
      }

      const result = await response.json();
      
      const updatedStaff = [result.staff, ...staff];
      setStaff(updatedStaff);
      setFilteredStaff(updatedStaff.filter(member => 
        !searchTerm.trim() || 
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.skills && member.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
        member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.experience_years?.toString().includes(searchTerm.toLowerCase()) ||
        member.rating?.toString().includes(searchTerm.toLowerCase())
      ));
      
      setAddForm({
        name: '',
        email: '',
        phone: '',
        role: 'service_provider',
        experience_years: '',
        rating: '',
        status: 'Active',
        password: '',
        selectedSkills: []
      });
      
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error creating staff:', err);
      alert('Error creating staff: ' + err.message);
    }
  };

  const handleFormChange = (formType, field, value) => {
    if (formType === 'edit') {
      setEditForm(prev => ({ ...prev, [field]: value }));
    } else {
      setAddForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSkillToggle = (formType, category) => {
    if (formType === 'edit') {
      setEditForm(prev => {
        const currentSkills = [...prev.selectedSkills];
        if (currentSkills.includes(category)) {
          return { ...prev, selectedSkills: currentSkills.filter(skill => skill !== category) };
        } else {
          return { ...prev, selectedSkills: [...currentSkills, category] };
        }
      });
    } else {
      setAddForm(prev => {
        const currentSkills = [...prev.selectedSkills];
        if (currentSkills.includes(category)) {
          return { ...prev, selectedSkills: currentSkills.filter(skill => skill !== category) };
        } else {
          return { ...prev, selectedSkills: [...currentSkills, category] };
        }
      });
    }
  };

  const handleStatusToggle = async (staffMember) => {
  try {
    const newStatus = staffMember.status === "Active" ? "Inactive" : "Active";
    
    const response = await fetch(`http://localhost:5000/api/admin/staff/${staffMember.user_id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update status');
    }

    const result = await response.json();
    
    setStaff(staff.map(member => 
      member.user_id === staffMember.user_id 
        ? { ...member, status: result.status }
        : member
    ));
    
    setFilteredStaff(filteredStaff.map(member => 
      member.user_id === staffMember.user_id 
        ? { ...member, status: result.status }
        : member
    ));
  } catch (err) {
    console.error('Error updating status:', err);
    alert('Error updating status: ' + err.message);
  }
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

  const renderSkillsSelection = (formType) => {
    const form = formType === 'edit' ? editForm : addForm;
    
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>Skills (Categories)</label>
        <div style={styles.checkboxGroup}>
          {SERVICE_CATEGORIES.map(category => (
            <label key={category} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.selectedSkills.includes(category)}
                onChange={() => handleSkillToggle(formType, category)}
              />
              {category}
            </label>
          ))}
        </div>
        <div style={styles.skillsContainer}>
          {form.selectedSkills.map(skill => (
            <span key={skill} style={styles.skillTag}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div style={styles.loading}>Loading staff...</div>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        Error: {error}
        <br />
        <button 
          style={styles.button} 
          onClick={fetchStaff}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ color: '#1f2937' }}>Staff Management</h1>
        <button style={styles.button} onClick={() => setIsAddModalOpen(true)}>
          + Add New Staff
        </button>
      </div>
      
      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search staff by name, email, phone, skills, role, experience, or rating..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.resultsCount}>
          {filteredStaff.length} {filteredStaff.length === 1 ? 'staff member' : 'staff members'} found
        </div>
      </div>
      
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Staff Member</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Skills</th>
              <th style={styles.th}>Experience</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>Join Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map(member => (
              <tr key={member.user_id}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <div style={styles.avatar}>
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>{member.name}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>{member.email}</td>
                <td style={styles.td}>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#374151'
                  }}>
                    {member.role === 'service_provider' ? 'Service Provider' : member.role}
                  </span>
                </td>
                <td style={styles.td}>{member.phone || 'Not provided'}</td>
                <td style={styles.td}>
                  <div style={styles.skillsContainer}>
                    {member.skills && member.skills.map((skill, index) => (
                      <span key={index} style={styles.skillTag}>
                        {skill}
                      </span>
                    ))}
                    {(!member.skills || member.skills.length === 0) && 'No skills'}
                  </div>
                </td>
                <td style={styles.td}>
                  {member.experience_years ? `${member.experience_years} years` : 'Not specified'}
                </td>
                <td style={styles.td}>
                  {member.rating ? `⭐ ${member.rating}` : 'No rating'}
                </td>
                <td style={styles.td}>{formatDate(member.created_at)}</td>
                <td style={styles.td}>
                  <span style={member.status === "Active" ? styles.statusActive : styles.statusInactive}>
                    {member.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionGroup}>
                    <button 
                      style={{...styles.button, ...styles.editBtn}}
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>
                    <button 
                      style={styles.button}
                      onClick={() => handleStatusToggle(member)}
                    >
                      {member.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                    <button 
                      style={{...styles.button, ...styles.deleteBtn}}
                      onClick={() => handleDelete(member.user_id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStaff.length === 0 && (
          <div style={styles.loading}>
            {searchTerm ? `No staff members found for "${searchTerm}"` : 'No staff members found.'}
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>Add New Staff</h2>
              <button 
                style={{...styles.button, ...styles.cancelBtn}}
                onClick={() => setIsAddModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={addForm.name}
                  onChange={(e) => handleFormChange('add', 'name', e.target.value)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  style={styles.input}
                  value={addForm.email}
                  onChange={(e) => handleFormChange('add', 'email', e.target.value)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password *</label>
                <input
                  type="password"
                  style={styles.input}
                  value={addForm.password}
                  onChange={(e) => handleFormChange('add', 'password', e.target.value)}
                  required
                  minLength="6"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  style={styles.input}
                  value={addForm.phone}
                  onChange={(e) => handleFormChange('add', 'phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>

              {renderSkillsSelection('add')}

              <div style={styles.formGroup}>
                <label style={styles.label}>Experience (years)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  style={styles.input}
                  value={addForm.experience_years}
                  onChange={(e) => handleFormChange('add', 'experience_years', e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  style={styles.input}
                  value={addForm.rating}
                  onChange={(e) => handleFormChange('add', 'rating', e.target.value)}
                  placeholder="4.5"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  style={styles.select}
                  value={addForm.status}
                  onChange={(e) => handleFormChange('add', 'status', e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={styles.modalActions}>
                <button 
                  type="button"
                  style={{...styles.button, ...styles.cancelBtn}}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={styles.button}
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>Edit Staff</h2>
              <button 
                style={{...styles.button, ...styles.cancelBtn}}
                onClick={() => setEditingStaff(null)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={editForm.name}
                  onChange={(e) => handleFormChange('edit', 'name', e.target.value)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  style={styles.input}
                  value={editForm.email}
                  onChange={(e) => handleFormChange('edit', 'email', e.target.value)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  style={styles.input}
                  value={editForm.phone}
                  onChange={(e) => handleFormChange('edit', 'phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>

              {renderSkillsSelection('edit')}

              <div style={styles.formGroup}>
                <label style={styles.label}>Experience (years)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  style={styles.input}
                  value={editForm.experience_years}
                  onChange={(e) => handleFormChange('edit', 'experience_years', e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  style={styles.input}
                  value={editForm.rating}
                  onChange={(e) => handleFormChange('edit', 'rating', e.target.value)}
                  placeholder="4.5"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  style={styles.select}
                  value={editForm.status}
                  onChange={(e) => handleFormChange('edit', 'status', e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={styles.modalActions}>
                <button 
                  type="button"
                  style={{...styles.button, ...styles.cancelBtn}}
                  onClick={() => setEditingStaff(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={styles.button}
                >
                  Update Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}