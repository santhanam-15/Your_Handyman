import React, { useState } from 'react';

const styles = {
  popup: {
    position: 'fixed',
    zIndex: 1000,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupInner: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 20px rgba(0,0,0,0.75)',
    width: '400px',
    maxWidth: '90%',
  },
  formGroup: { marginBottom: '15px', textAlign: 'left' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#0c4b8e',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    margin: '10px 5px 0 0',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    margin: '10px 0 0 0',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  switchText: { color: '#0c4b8e', cursor: 'pointer', marginTop: '10px' },
};

export default function LoginModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // prevent double submits
  const safeSubmit = (fn) => async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await fn(e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setAddress('');
    setErrors({});
  };

  const switchToRegister = () => {
    resetForm();
    setMode('register');
  };

  const switchToLogin = () => {
    resetForm();
    setMode('login');
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) =>
    phone === '' || /^[0-9]{10}$/.test(phone);

  const validateLoginForm = () => {
    const newErrors = {};
    if (!email || !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email.';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!email || !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email.';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (!validatePhone(phone)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }
    if (!address.trim()) newErrors.address = 'Address is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    // e already prevented in safeSubmit wrapper
    if (!validateLoginForm()) return;

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        alert('Login failed: ' + (error.error || 'Unknown error'));
        return;
      }
      const user = await res.json();
      onSuccess(user);
    } catch (err) {
      alert('Login error: ' + err.message);
    }
  };

  const handleRegister = async (e) => {
    if (!validateRegisterForm()) return;

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address }),
      });
      if (res.status === 201) {
        alert('Registration successful! Please log in.');
        setMode('login');
      } else {
        const { error } = await res.json().catch(() => ({}));
        alert(error || 'Registration failed');
      }
    } catch (err) {
      alert('Register error: ' + err.message);
    }
  };

  return (
    <div style={styles.popup}>
      <div style={styles.popupInner}>
        {mode === 'login' ? (
          <form onSubmit={safeSubmit(handleLogin)}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button type="button" onClick={onClose} style={styles.closeButton}>Cancel</button>
            <div style={styles.switchText} onClick={switchToRegister}>
              Don't have an account? Register
            </div>
          </form>
        ) : (
          <form onSubmit={safeSubmit(handleRegister)}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="text"
                style={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Address</label>
              <input
                type="text"
                style={styles.input}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <div style={{ color: 'red' }}>{errors.address}</div>}
            </div>
            <button type="submit" style={styles.button}>Register</button>
            <button type="button" onClick={onClose} style={styles.closeButton}>Cancel</button>
            <div style={styles.switchText} onClick={switchToLogin}>
              Already have an account? Login
            </div>
          </form>
        )}
      </div>
    </div>
  );
}