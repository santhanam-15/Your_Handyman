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
  radioGroup: {
    display: 'flex',
    gap: '16px',
    marginBottom: '8px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer'
  },
  newFieldInput: {
    marginTop: '8px'
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

// Mapping functions to handle numeric category values
const mapCategoryValue = (category) => {
  const categoryMap = {
    '1': 'Electrical',
    '2': 'Plumbing', 
    '3': 'Carpentry',
    '4': 'Painting',
    '5': 'Cleaning',
    '6': 'Appliance',
    '7': 'HVAC'
  };
  return categoryMap[category] || category;
};

const mapSubcategoryValue = (subcategory) => {
  const subcategoryMap = {
    // Electrical
    '1': 'Wiring', '2': 'Switch & Socket', '3': 'Lighting', '4': 'Fan Installation', '5': 'MCB/DB',
    // Plumbing  
    '6': 'Leak Repair', '7': 'Pipe Install', '8': 'Tap/Faucet', '9': 'Clog/Cleaning', '10': 'Water Heater',
    // Carpentry
    '11': 'Furniture Assembly', '12': 'Door/Window', '13': 'Repair', '14': 'Polish',
    // Painting
    '15': 'Interior', '16': 'Exterior', '17': 'Touch-up',
    // Cleaning
    '18': 'Home Deep Clean', '19': 'Kitchen Clean', '20': 'Bathroom Clean',
    // Appliance
    '21': 'AC Service', '22': 'AC Install', '23': 'Fridge Repair', '24': 'Washing Machine',
    // HVAC
    '25': 'HVAC Service', '26': 'Duct Clean'
  };
  return subcategoryMap[subcategory] || subcategory;
};

export default function ServiceManagementPage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryMapping, setCategoryMapping] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    description: '',
    status: 'Active',
    isNewCategory: false,
    isNewSubcategory: false,
    newCategory: '',
    newSubcategory: ''
  });

  const [addForm, setAddForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    description: '',
    status: 'Active',
    isNewCategory: false,
    isNewSubcategory: false,
    newCategory: '',
    newSubcategory: ''
  });

  // Filter services based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredServices(services);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = services.filter(service => 
        service.name?.toLowerCase().includes(lowercasedSearch) ||
        mapCategoryValue(service.category)?.toLowerCase().includes(lowercasedSearch) ||
        mapSubcategoryValue(service.subcategory)?.toLowerCase().includes(lowercasedSearch) ||
        service.description?.toLowerCase().includes(lowercasedSearch) ||
        service.price?.toString().includes(lowercasedSearch)
      );
      setFilteredServices(filtered);
    }
  }, [searchTerm, services]);

  // Fetch services and categories from backend
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/services');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched services:', data);
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/service-categories');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched categories data:', data);
      
      setCategories(data.categories || []);
      setSubcategories(data.subcategories || []);
      setCategoryMapping(data.categoryMapping || {});
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
      setSubcategories([]);
      setCategoryMapping({});
    }
  };

  // Fetch subcategories for a specific category
  const fetchSubcategoriesForCategory = async (category) => {
    if (!category) {
      setSubcategories([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/subcategories/${encodeURIComponent(category)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subcategories: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Fetched subcategories for ${category}:`, data.subcategories);
      setSubcategories(data.subcategories || []);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setSubcategories([]);
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/services/${serviceId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete service');
        }

        const updatedServices = services.filter(service => service.service_id !== serviceId);
        setServices(updatedServices);
        setFilteredServices(updatedServices.filter(service => 
          !searchTerm.trim() || 
          service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mapCategoryValue(service.category)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mapSubcategoryValue(service.subcategory)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.price?.toString().includes(searchTerm.toLowerCase())
        ));
      } catch (err) {
        alert('Error deleting service: ' + err.message);
        console.error('Error deleting service:', err);
      }
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setEditForm({
      name: service.name || '',
      category: service.category || '',
      subcategory: service.subcategory || '',
      price: service.price || '',
      description: service.description || '',
      status: service.status || 'Active',
      isNewCategory: false,
      isNewSubcategory: false,
      newCategory: '',
      newSubcategory: ''
    });
    
    if (service.category) {
      fetchSubcategoriesForCategory(service.category);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { ...editForm };
      
      if (formData.isNewCategory) {
        formData.category = formData.newCategory;
      }
      
      if (formData.isNewSubcategory) {
        formData.subcategory = formData.newSubcategory;
      }

      const response = await fetch(`http://localhost:5000/api/admin/services/${editingService.service_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update service');
      }

      const result = await response.json();
      
      const updatedServices = services.map(service => 
        service.service_id === editingService.service_id 
          ? result.service 
          : service
      );
      setServices(updatedServices);
      setFilteredServices(updatedServices.filter(service => 
        !searchTerm.trim() || 
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mapCategoryValue(service.category)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mapSubcategoryValue(service.subcategory)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.price?.toString().includes(searchTerm.toLowerCase())
      ));
      
      setEditingService(null);
      fetchCategories();
    } catch (err) {
      console.error('Error updating service:', err);
      alert('Error updating service: ' + err.message);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { ...addForm };
      
      if (formData.isNewCategory) {
        formData.category = formData.newCategory;
      }
      
      if (formData.isNewSubcategory) {
        formData.subcategory = formData.newSubcategory;
      }

      const response = await fetch('http://localhost:5000/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create service');
      }

      const result = await response.json();
      
      const updatedServices = [result.service, ...services];
      setServices(updatedServices);
      setFilteredServices(updatedServices.filter(service => 
        !searchTerm.trim() || 
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mapCategoryValue(service.category)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mapSubcategoryValue(service.subcategory)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.price?.toString().includes(searchTerm.toLowerCase())
      ));
      
      setAddForm({
        name: '',
        category: '',
        subcategory: '',
        price: '',
        description: '',
        status: 'Active',
        isNewCategory: false,
        isNewSubcategory: false,
        newCategory: '',
        newSubcategory: ''
      });
      
      setIsAddModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Error creating service:', err);
      alert('Error creating service: ' + err.message);
    }
  };

  const handleFormChange = (formType, field, value) => {
    if (formType === 'edit') {
      setEditForm(prev => {
        const newForm = { ...prev, [field]: value };
        
        if (field === 'category') {
          fetchSubcategoriesForCategory(value);
          newForm.subcategory = '';
          newForm.isNewSubcategory = false;
          newForm.newSubcategory = '';
        }
        
        if (field === 'isNewCategory' && !value) {
          newForm.newCategory = '';
        }
        
        if (field === 'isNewSubcategory' && !value) {
          newForm.newSubcategory = '';
        }
        
        return newForm;
      });
    } else {
      setAddForm(prev => {
        const newForm = { ...prev, [field]: value };
        
        if (field === 'category') {
          fetchSubcategoriesForCategory(value);
          newForm.subcategory = '';
          newForm.isNewSubcategory = false;
          newForm.newSubcategory = '';
        }
        
        if (field === 'isNewCategory' && !value) {
          newForm.newCategory = '';
        }
        
        if (field === 'isNewSubcategory' && !value) {
          newForm.newSubcategory = '';
        }
        
        return newForm;
      });
    }
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const getAvailableSubcategories = () => {
    return subcategories || [];
  };

  const renderCategorySelection = (formType) => {
    const form = formType === 'edit' ? editForm : addForm;
    
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>Category *</label>
        
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="categoryType"
              checked={!form.isNewCategory}
              onChange={() => handleFormChange(formType, 'isNewCategory', false)}
            />
            Select Existing Category
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="categoryType"
              checked={form.isNewCategory}
              onChange={() => handleFormChange(formType, 'isNewCategory', true)}
            />
            Add New Category
          </label>
        </div>

        {!form.isNewCategory ? (
          <select
            style={styles.select}
            value={form.category}
            onChange={(e) => handleFormChange(formType, 'category', e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories && categories.length > 0 ? (
              categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))
            ) : (
              <option value="" disabled>Loading categories...</option>
            )}
          </select>
        ) : (
          <input
            type="text"
            style={{...styles.input, ...styles.newFieldInput}}
            value={form.newCategory}
            onChange={(e) => handleFormChange(formType, 'newCategory', e.target.value)}
            placeholder="Enter new category name"
            required
          />
        )}
      </div>
    );
  };

  const renderSubcategorySelection = (formType) => {
    const form = formType === 'edit' ? editForm : addForm;
    const availableSubcategories = getAvailableSubcategories();
    
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>Subcategory *</label>
        
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="subcategoryType"
              checked={!form.isNewSubcategory}
              onChange={() => handleFormChange(formType, 'isNewSubcategory', false)}
              disabled={!form.category && !form.isNewCategory}
            />
            Select Existing Subcategory
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="subcategoryType"
              checked={form.isNewSubcategory}
              onChange={() => handleFormChange(formType, 'isNewSubcategory', true)}
              disabled={!form.category && !form.isNewCategory}
            />
            Add New Subcategory
          </label>
        </div>

        {!form.isNewSubcategory ? (
          <select
            style={styles.select}
            value={form.subcategory}
            onChange={(e) => handleFormChange(formType, 'subcategory', e.target.value)}
            required
            disabled={!form.category && !form.isNewCategory}
          >
            <option value="">Select Subcategory</option>
            {availableSubcategories && availableSubcategories.length > 0 ? (
              availableSubcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))
            ) : (
              <option value="" disabled>
                {form.category ? 'No subcategories found' : 'Select a category first'}
              </option>
            )}
          </select>
        ) : (
          <input
            type="text"
            style={{...styles.input, ...styles.newFieldInput}}
            value={form.newSubcategory}
            onChange={(e) => handleFormChange(formType, 'newSubcategory', e.target.value)}
            placeholder="Enter new subcategory name"
            required
            disabled={!form.category && !form.isNewCategory}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return <div style={styles.loading}>Loading services...</div>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        Error: {error}
        <br />
        <button 
          style={styles.button} 
          onClick={fetchServices}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ color: '#1f2937' }}>Service Management</h1>
        <button style={styles.button} onClick={() => setIsAddModalOpen(true)}>
          + Add New Service
        </button>
      </div>
      
      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search services by name, category, subcategory, description, or price..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.resultsCount}>
          {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
        </div>
      </div>
      
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Service Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Subcategory</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map(service => (
              <tr key={service.service_id}>
                <td style={styles.td}>#{service.service_id}</td>
                <td style={styles.td}>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>{service.name}</div>
                </td>
                <td style={styles.td}>
                  <span style={{
                    backgroundColor: '#f3f4f6',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#374151'
                  }}>
                    {mapCategoryValue(service.category)}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    backgroundColor: '#e0f2fe',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#0369a1'
                  }}>
                    {mapSubcategoryValue(service.subcategory)}
                  </span>
                </td>
                <td style={styles.td}>{formatPrice(service.price)}</td>
                <td style={styles.td}>
                  <div style={{ 
                    maxWidth: '200px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap' 
                  }}>
                    {service.description}
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={service.status === "Active" ? styles.statusActive : styles.statusInactive}>
                    {service.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionGroup}>
                    <button 
                      style={{...styles.button, ...styles.editBtn}}
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </button>
                    <button 
                      style={{...styles.button, ...styles.deleteBtn}}
                      onClick={() => handleDelete(service.service_id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredServices.length === 0 && (
          <div style={styles.loading}>
            {searchTerm ? `No services found for "${searchTerm}"` : 'No services found.'}
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>Add New Service</h2>
              <button 
                style={{...styles.button, ...styles.cancelBtn}}
                onClick={() => setIsAddModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Service Name *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={addForm.name}
                  onChange={(e) => handleFormChange('add', 'name', e.target.value)}
                  required
                />
              </div>

              {renderCategorySelection('add')}
              {renderSubcategorySelection('add')}

              <div style={styles.formGroup}>
                <label style={styles.label}>Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  style={styles.input}
                  value={addForm.price}
                  onChange={(e) => handleFormChange('add', 'price', e.target.value)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={styles.textarea}
                  value={addForm.description}
                  onChange={(e) => handleFormChange('add', 'description', e.target.value)}
                  placeholder="Enter service description..."
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
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>Edit Service</h2>
              <button 
                style={{...styles.button, ...styles.cancelBtn}}
                onClick={() => setEditingService(null)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Service Name *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={editForm.name}
                  onChange={(e) => handleFormChange('edit', 'name', e.target.value)}
                  required
                />
              </div>

              {renderCategorySelection('edit')}
              {renderSubcategorySelection('edit')}

              <div style={styles.formGroup}>
                <label style={styles.label}>Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  style={styles.input}
                  value={editForm.price}
                  onChange={(e) => handleFormChange('edit', 'price', e.target.value)}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={styles.textarea}
                  value={editForm.description}
                  onChange={(e) => handleFormChange('edit', 'description', e.target.value)}
                  placeholder="Enter service description..."
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
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={styles.button}
                >
                  Update Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}