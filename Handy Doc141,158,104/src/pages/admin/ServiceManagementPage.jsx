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
  validationError: {
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '4px'
  },
  validationSuccess: {
    fontSize: '12px',
    color: '#10b981',
    marginTop: '4px'
  }
};



const mapCategoryValue = (category) => {
  const categoryMap = {
    '1': 'Electrical',
    '2': 'Plumbing', 
    '3': 'Carpentry',
    '4': 'Painting',
    '5': 'Cleaning',
    '6': 'Appliance',
    '7': 'HVAC',
    '8': 'Washing'
  };
  return categoryMap[category] || category;
};

const mapSubcategoryValue = (subcategory) => {
  const subcategoryMap = {
    '1': 'Wiring', '2': 'Switch & Socket', '3': 'Lighting', '4': 'Fan Installation', '5': 'MCB/DB',
    '6': 'Leak Repair', '7': 'Pipe Install', '8': 'Tap/Faucet', '9': 'Clog/Cleaning', '10': 'Water Heater',
    '11': 'Furniture Assembly', '12': 'Door/Window', '13': 'Repair', '14': 'Polish',
    '15': 'Interior', '16': 'Exterior', '17': 'Touch-up',
    '18': 'Home Deep Clean', '19': 'Kitchen Clean', '20': 'Bathroom Clean',
    '21': 'AC Service', '22': 'AC Install', '23': 'Fridge Repair', '24': 'Washing Machine',
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
  const [allSubcategories, setAllSubcategories] = useState([]); // New state for all subcategories
  const [categoryMapping, setCategoryMapping] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [validationResults, setValidationResults] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to prevent multiple submissions
  
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
    newSubcategory: '',
    confirmNewCategory: false,
    confirmNewSubcategory: false
  });

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
      setCategories(data.categories || []);
      setSubcategories(data.subcategories || []);
      setAllSubcategories(data.subcategories || []); // Store all subcategories
      setCategoryMapping(data.categoryMapping || {});
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
      setSubcategories([]);
      setAllSubcategories([]);
      setCategoryMapping({});
    }
  };

  const fetchSubcategoriesForCategory = async (category) => {
  if (!category) {
    // If no category selected, show all subcategories
    setSubcategories(allSubcategories);
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/admin/subcategories/${encodeURIComponent(category)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch subcategories: ${response.status}`);
    }
    
    const data = await response.json();
    setSubcategories(data.subcategories || allSubcategories); // Fallback to all subcategories if empty
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    setSubcategories(allSubcategories); // Fallback to all subcategories on error
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
    } else {
      setSubcategories(allSubcategories);
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

  const validateServiceFields = async () => {
    try {
      setIsValidating(true);
      const response = await fetch('http://localhost:5000/api/admin/services/validate-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: addForm.isNewCategory ? addForm.newCategory : addForm.category,
          subcategory: addForm.isNewSubcategory ? addForm.newSubcategory : addForm.subcategory,
          isNewCategory: addForm.isNewCategory,
          isNewSubcategory: addForm.isNewSubcategory
        })
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const results = await response.json();
      setValidationResults(results);
      return results;
    } catch (err) {
      console.error('Validation error:', err);
      setValidationResults({
        category: { isValid: false, message: 'Validation failed' },
        subcategory: { isValid: false, message: 'Validation failed' }
      });
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent multiple submissions
    
    if (!addForm.name || !addForm.price) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if we have valid category and subcategory
    if (addForm.isNewCategory && !addForm.newCategory.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    if (!addForm.isNewCategory && !addForm.category) {
      alert('Please select a category');
      return;
    }
    
    if (addForm.isNewSubcategory && !addForm.newSubcategory.trim()) {
      alert('Please enter a subcategory name');
      return;
    }
    
    if (!addForm.isNewSubcategory && !addForm.subcategory) {
      alert('Please select a subcategory');
      return;
    }

    setIsSubmitting(true);

    try {
      const validation = await validateServiceFields();
      if (!validation) {
        alert('Validation failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (!validation.category.isValid || !validation.subcategory.isValid) {
        alert('Please fix the validation errors before submitting.');
        setIsSubmitting(false);
        return;
      }

      let formData = { ...addForm };
      let requiresConfirmation = false;
      
      // Handle category confirmation
      if (addForm.isNewCategory && validation.category.requiresApproval && !addForm.confirmNewCategory) {
        if (window.confirm(`Are you sure you want to add new category "${addForm.newCategory}" to the system?`)) {
          formData.confirmNewCategory = true;
          setAddForm(prev => ({ ...prev, confirmNewCategory: true }));
        } else {
          setIsSubmitting(false);
          return; // User cancelled, stop the process
        }
      }

      // Handle subcategory confirmation  
      if (addForm.isNewSubcategory && validation.subcategory.requiresApproval && !addForm.confirmNewSubcategory) {
        if (window.confirm(`Are you sure you want to add new subcategory "${addForm.newSubcategory}" to the system?`)) {
          formData.confirmNewSubcategory = true;
          setAddForm(prev => ({ ...prev, confirmNewSubcategory: true }));
        } else {
          setIsSubmitting(false);
          return; // User cancelled, stop the process
        }
      }

      // Prepare final form data
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
        
        if (errorData.requiresConfirmation) {
          if (errorData.field === 'category') {
            if (window.confirm(`Add new category "${addForm.newCategory}" to the system?`)) {
              setAddForm(prev => ({ ...prev, confirmNewCategory: true }));
              // Retry submission
              setTimeout(() => handleAddSubmit(e), 100);
              return;
            }
          } else if (errorData.field === 'subcategory') {
            if (window.confirm(`Add new subcategory "${addForm.newSubcategory}" to the system?`)) {
              setAddForm(prev => ({ ...prev, confirmNewSubcategory: true }));
              // Retry submission
              setTimeout(() => handleAddSubmit(e), 100);
              return;
            }
          }
          setIsSubmitting(false);
          return;
        }
        
        throw new Error(errorData.error || 'Failed to create service');
      }

      const result = await response.json();
      
      // Reset form and close modal
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
        newSubcategory: '',
        confirmNewCategory: false,
        confirmNewSubcategory: false
      });
      
      setValidationResults({});
      setIsAddModalOpen(false);
      
      fetchServices();
      fetchCategories();
      
      alert(`Service created successfully! ${
        result.newCategoryAdded ? 'New category added. ' : ''
      }${
        result.newSubcategoryAdded ? 'New subcategory added.' : ''
      }`);
      
    } catch (err) {
      console.error('Error creating service:', err);
      alert('Error creating service: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

 const handleFormChange = (formType, field, value) => {
  if (formType === 'edit') {
    setEditForm(prev => {
      const newForm = { ...prev, [field]: value };
      
      if (field === 'category') {
        if (value) {
          fetchSubcategoriesForCategory(value);
        } else {
          // When category is cleared, show all subcategories
          setSubcategories(allSubcategories);
        }
        newForm.subcategory = '';
        newForm.isNewSubcategory = false;
        newForm.newSubcategory = '';
      }
      
      if (field === 'isNewCategory') {
        if (value) {
          // When switching to new category, show all subcategories
          setSubcategories(allSubcategories);
        } else {
          // When switching back to existing category, fetch subcategories for selected category
          if (newForm.category) {
            fetchSubcategoriesForCategory(newForm.category);
          } else {
            setSubcategories(allSubcategories);
          }
        }
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
      
      if (field === 'category' || field === 'newCategory' || field === 'isNewCategory') {
        newForm.confirmNewCategory = false;
      }
      
      if (field === 'subcategory' || field === 'newSubcategory' || field === 'isNewSubcategory') {
        newForm.confirmNewSubcategory = false;
      }
      
      if (field === 'category') {
        if (value) {
          fetchSubcategoriesForCategory(value);
        } else {
          // When category is cleared, show all subcategories
          setSubcategories(allSubcategories);
        }
        newForm.subcategory = '';
        newForm.isNewSubcategory = false;
        newForm.newSubcategory = '';
      }
      
      if (field === 'isNewCategory') {
        if (value) {
          // When switching to new category, show all subcategories
          setSubcategories(allSubcategories);
        } else {
          // When switching back to existing category, fetch subcategories for selected category
          if (newForm.category) {
            fetchSubcategoriesForCategory(newForm.category);
          } else {
            setSubcategories(allSubcategories);
          }
        }
        newForm.newCategory = '';
      }
      
      if (field === 'isNewSubcategory' && !value) {
        newForm.newSubcategory = '';
      }
      
      return newForm;
    });

    if (field.includes('category') || field.includes('subcategory')) {
      setTimeout(() => {
        if (addForm.category || addForm.newCategory || addForm.subcategory || addForm.newSubcategory) {
          validateServiceFields();
        }
      }, 500);
    }
  }
};

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const getAvailableSubcategories = () => {
    return subcategories || allSubcategories || [];
  };

  const renderCategorySelection = (formType) => {
    const form = formType === 'edit' ? editForm : addForm;
    const validation = validationResults.category || {};
    
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
          <div>
            <select
              style={{
                ...styles.select,
                borderColor: validation.isValid === false ? '#ef4444' : '#d1d5db'
              }}
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
            {validation.message && (
              <div style={validation.isValid ? styles.validationSuccess : styles.validationError}>
                {validation.message}
              </div>
            )}
          </div>
        ) : (
          <div>
            <input
              type="text"
              style={{
                ...styles.input,
                ...styles.newFieldInput,
                borderColor: validation.isValid === false ? '#ef4444' : '#d1d5db'
              }}
              value={form.newCategory}
              onChange={(e) => handleFormChange(formType, 'newCategory', e.target.value)}
              placeholder="Enter new category name"
              required
            />
            {validation.message && (
              <div style={validation.isValid ? styles.validationSuccess : styles.validationError}>
                {validation.message}
              </div>
            )}
            {validation.requiresApproval && form.confirmNewCategory && (
              <div style={styles.validationSuccess}>
                ✓ Category will be added to system
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSubcategorySelection = (formType) => {
  const form = formType === 'edit' ? editForm : addForm;
  const availableSubcategories = form.isNewCategory ? allSubcategories : subcategories;
  const validation = validationResults.subcategory || {};
  
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
          />
          Select Existing Subcategory
        </label>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            name="subcategoryType"
            checked={form.isNewSubcategory}
            onChange={() => handleFormChange(formType, 'isNewSubcategory', true)}
          />
          Add New Subcategory
        </label>
      </div>

      {!form.isNewSubcategory ? (
        <div>
          <select
            style={{
              ...styles.select,
              borderColor: validation.isValid === false ? '#ef4444' : '#d1d5db'
            }}
            value={form.subcategory}
            onChange={(e) => handleFormChange(formType, 'subcategory', e.target.value)}
            required
          >
            <option value="">Select Subcategory</option>
            {availableSubcategories && availableSubcategories.length > 0 ? (
              availableSubcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))
            ) : (
              <option value="" disabled>
                No subcategories available
              </option>
            )}
          </select>
          {validation.message && (
            <div style={validation.isValid ? styles.validationSuccess : styles.validationError}>
              {validation.message}
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            type="text"
            style={{
              ...styles.input,
              ...styles.newFieldInput,
              borderColor: validation.isValid === false ? '#ef4444' : '#d1d5db'
            }}
            value={form.newSubcategory}
            onChange={(e) => handleFormChange(formType, 'newSubcategory', e.target.value)}
            placeholder="Enter new subcategory name"
            required
          />
          {validation.message && (
            <div style={validation.isValid ? styles.validationSuccess : styles.validationError}>
              {validation.message}
            </div>
          )}
          {validation.requiresApproval && form.confirmNewSubcategory && (
            <div style={styles.validationSuccess}>
              ✓ Subcategory will be added to system
            </div>
          )}
        </div>
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
                  disabled={isValidating || isSubmitting}
                >
                  {isValidating ? 'Validating...' : isSubmitting ? 'Creating...' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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