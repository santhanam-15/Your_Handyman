// Home.jsx
import React, { useState, useEffect, useRef } from 'react';

const styles = {
  // Main container styles
  body: {
    backgroundColor: '#f8fafc',
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    margin: 0,
    padding: 0,
    minHeight: '100vh',
    lineHeight: '1.6',
  },
  navbar: {
    backgroundColor: '#0c4b8e',
    padding: '0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'linear-gradient(135deg, #0c4b8e 0%, #1e6fd9 100%)',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    height: '70px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  logoHover: {
    transform: 'scale(1.05)',
  },
  logoIcon: {
    fontSize: '2rem',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  navMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navItem: {
    position: 'relative',
  },
  navLink: {
    color: 'white',
    padding: '20px 18px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'block',
    fontSize: '0.95rem',
  },
  navLinkHover: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: 'white',
    minWidth: '220px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    padding: '12px 0',
    opacity: 0,
    visibility: 'hidden',
    transform: 'translateY(-15px)',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0',
  },
  dropdownVisible: {
    opacity: 1,
    visibility: 'visible',
    transform: 'translateY(5px)',
  },
  dropdownItem: {
    padding: '14px 20px',
    color: '#2d3748',
    textDecoration: 'none',
    display: 'block',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    borderLeft: '3px solid transparent',
  },
  dropdownItemHover: {
    backgroundColor: '#f0f7ff',
    borderLeftColor: '#0c4b8e',
    paddingLeft: '25px',
  },
  authButton: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8e35 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '25px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginLeft: '15px',
    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
    fontSize: '0.9rem',
  },
  authButtonHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 20px rgba(255, 107, 53, 0.4)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'white',
    padding: '8px 16px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    marginLeft: '10px',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },

  // Hero Section
  hero: {
    padding: '100px 20px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '20px',
    lineHeight: '1.1',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
    position: 'relative',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    maxWidth: '700px',
    margin: '0 auto 40px',
    lineHeight: '1.6',
    opacity: '0.95',
    position: 'relative',
    fontWeight: '400',
  },
  ctaButton: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8e35 100%)',
    color: 'white',
    border: 'none',
    padding: '18px 45px',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
    position: 'relative',
  },
  ctaButtonHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 25px rgba(255, 107, 53, 0.5)',
  },

  // Main Container
  container: {
    padding: '40px 20px',
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  // Stats Section
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    margin: '80px 0',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '40px 20px',
    borderRadius: '20px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid #f1f5f9',
  },
  statCardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#0c4b8e',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #0c4b8e 0%, #1e6fd9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '1.1rem',
    color: '#64748b',
    fontWeight: '600',
  },

  // About Us Section
  aboutUs: {
    maxWidth: '900px',
    margin: '0 auto 80px',
    backgroundColor: '#ffffff',
    padding: '60px',
    borderRadius: '25px',
    boxShadow: '0 10px 35px rgba(0, 0, 0, 0.08)',
    textAlign: 'left',
    lineHeight: '1.7',
    position: 'relative',
    border: '1px solid #f1f5f9',
  },
  sectionTitle: {
    fontSize: '2.8rem',
    fontWeight: '800',
    color: '#0c4b8e',
    textAlign: 'center',
    marginBottom: '60px',
    position: 'relative',
    background: 'linear-gradient(135deg, #0c4b8e 0%, #1e6fd9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sectionTitleAfter: {
    content: '""',
    position: 'absolute',
    bottom: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '5px',
    background: 'linear-gradient(135deg, #0c4b8e 0%, #1e6fd9 100%)',
    borderRadius: '3px',
  },

  // Features Section
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '35px',
    margin: '80px 0',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '50px 30px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    border: '1px solid #f1f5f9',
    position: 'relative',
    overflow: 'hidden',
  },
  featureCardHover: {
    transform: 'translateY(-12px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  featureIcon: {
    fontSize: '4rem',
    marginBottom: '25px',
    background: 'linear-gradient(135deg, #0c4b8e 0%, #1e6fd9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 4px 8px rgba(12, 75, 142, 0.3))',
  },
  featureTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#0c4b8e',
    marginBottom: '15px',
  },
  featureDesc: {
    color: '#64748b',
    lineHeight: '1.6',
  },

  // Categories & Services
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    margin: '50px 0',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px 25px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    border: '2px solid transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  categoryCardHover: {
    transform: 'translateY(-12px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    borderColor: '#0c4b8e',
  },
  categoryIcon: {
    fontSize: '4.5rem',
    marginBottom: '25px',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
    margin: '50px 0',
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '35px 30px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    border: '1px solid #f1f5f9',
    position: 'relative',
    overflow: 'hidden',
  },
  serviceCardHover: {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  serviceBadge: {
    position: 'absolute',
    top: '25px',
    right: '-35px',
    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8e35 100%)',
    color: 'white',
    padding: '8px 45px',
    fontSize: '0.8rem',
    fontWeight: '700',
    transform: 'rotate(45deg)',
    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
  },
  price: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#0c4b8e',
    marginTop: '20px',
    background: 'linear-gradient(135deg, #0c4b8e 0%, #1e6fd9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  // Back Button
  backButton: {
    background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '12px',
    cursor: 'pointer',
    marginBottom: '40px',
    fontSize: '1rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '0 auto 40px',
    boxShadow: '0 6px 20px rgba(229, 62, 62, 0.3)',
  },
  backButtonHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 25px rgba(229, 62, 62, 0.4)',
  },

  // Testimonials Section
  testimonialSection: {
    background: 'linear-gradient(135deg, #f0f7ff 0%, #e1efff 100%)',
    padding: '100px 20px',
    borderRadius: '30px',
    margin: '100px 0',
    position: 'relative',
    overflow: 'hidden',
  },
  testimonials: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '35px',
    marginTop: '60px',
  },
  testimonialCard: {
    backgroundColor: 'white',
    padding: '40px 30px',
    borderRadius: '20px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    textAlign: 'left',
    position: 'relative',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.3s ease',
  },
  testimonialCardHover: {
    transform: 'translateY(-8px)',
  },
  testimonialText: {
    fontStyle: 'italic',
    lineHeight: '1.7',
    marginBottom: '25px',
    color: '#4a5568',
    fontSize: '1.05rem',
  },
  testimonialAuthor: {
    fontWeight: '700',
    color: '#0c4b8e',
    fontSize: '1.1rem',
  },
  testimonialRole: {
    fontSize: '0.9rem',
    color: '#718096',
    marginTop: '5px',
  },
  quoteIcon: {
    fontSize: '4rem',
    color: '#e2e8f0',
    position: 'absolute',
    top: '15px',
    right: '25px',
    opacity: '0.7',
  },

  // CTA Section
  ctaSection: {
    background: 'linear-gradient(135deg, #0c4b8e 0%, #1e6fd9 100%)',
    color: 'white',
    padding: '100px 20px',
    borderRadius: '30px',
    textAlign: 'center',
    margin: '100px 0',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '25px',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
    position: 'relative',
  },
  ctaSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '50px',
    opacity: '0.95',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: '1.6',
    position: 'relative',
    fontWeight: '400',
  },

  // Footer
  footer: {
    background: 'linear-gradient(135deg, #0c4b8e 0%, #1a56b4 100%)',
    color: 'white',
    padding: '60px 20px 30px',
    marginTop: '100px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '50px',
    textAlign: 'left',
  },
  footerSection: {
    marginBottom: '30px',
  },
  footerHeading: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '25px',
    borderBottom: '3px solid rgba(255,255,255,0.2)',
    paddingBottom: '12px',
  },
  footerLinks: {
    listStyle: 'none',
    padding: 0,
  },
  footerLink: {
    marginBottom: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: '8px 0',
    borderRadius: '5px',
    paddingLeft: '10px',
    borderLeft: '3px solid transparent',
  },
  footerLinkHover: {
    color: '#a0c4ff',
    paddingLeft: '15px',
    borderLeftColor: '#a0c4ff',
  },
  copyright: {
    marginTop: '60px',
    paddingTop: '30px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    opacity: '0.8',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
};

export default function Home({ user, onLoginClick, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [hoverState, setHoverState] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const servicesRef = useRef(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        setError('');
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/services/${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
      setSelectedCategory(category);
      setError('');
      
      setTimeout(() => {
        servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (element) => {
    setHoverState(prev => ({ ...prev, [element]: true }));
  };

  const handleMouseLeave = (element) => {
    setHoverState(prev => ({ ...prev, [element]: false }));
  };

  const handleDropdownEnter = (dropdown) => {
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const getCategoryIcon = cat => {
    const icons = {
      Electrical: '⚡',
      Plumbing: '🔧',
      Carpentry: '🔨',
      Painting: '🎨',
      Cleaning: '🧽',
      Appliance: '📱',
      HVAC: '❄️',
    };
    return icons[cat] || '🔧';
  };

  const features = [
    { icon: '⏱️', title: 'Quick Response', desc: 'Get service in as little as 2 hours with our rapid response team available 24/7.' },
    { icon: '✅', title: 'Verified Professionals', desc: 'All our handymen are background-checked, certified, and highly rated.' },
    { icon: '💰', title: 'Fair Pricing', desc: 'Transparent pricing with no hidden fees. Get the best value for your money.' },
    { icon: '🛡️', title: 'Satisfaction Guarantee', desc: '100% satisfaction guaranteed or we will make it right, no questions asked.' },
  ];

  const testimonials = [
    { 
      text: 'The electrician arrived within an hour and fixed my issue professionally. The pricing was transparent and the service was exceptional. Highly recommended!', 
      author: 'Sarah Johnson', 
      role: 'Homeowner' 
    },
    { 
      text: 'I use their services regularly for my rental properties. Always reliable, affordable, and professional. They have never let me down!', 
      author: 'Michael Chen', 
      role: 'Property Manager' 
    },
    { 
      text: 'Outstanding plumbing service! They went above and beyond to fix a complex issue that others couldn\'t handle. True professionals!', 
      author: 'David Wilson', 
      role: 'Restaurant Owner' 
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Expert Handymen' },
    { number: '25+', label: 'Service Categories' },
    { number: '99.8%', label: 'Satisfaction Rate' },
  ];

  const servicesDropdown = [
    { label: 'All Services', action: () => window.scrollTo({ top: 2600, behavior: 'smooth' }) },
    ...categories.map(cat => ({
      label: cat,
      action: () => handleCategoryClick(cat)
    }))
  ];

  return (
    <div style={styles.body}>
      {/* Enhanced Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          {/* Logo */}
          <div 
            style={{
              ...styles.logo,
              ...(hoverState.logo ? styles.logoHover : {})
            }}
            onClick={() => {
              setSelectedCategory(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onMouseEnter={() => handleMouseEnter('logo')}
            onMouseLeave={() => handleMouseLeave('logo')}
          >
            <span style={styles.logoIcon}>🔧</span>
            <span>Your Handyman</span>
          </div>

          {/* Navigation Menu */}
          <ul style={styles.navMenu}>
            <li style={styles.navItem}>
              <span
                style={{
                  ...styles.navLink,
                  ...(hoverState.navHome ? styles.navLinkHover : {})
                }}
                onClick={() => {
                  setSelectedCategory(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onMouseEnter={() => handleMouseEnter('navHome')}
                onMouseLeave={() => handleMouseLeave('navHome')}
              >
                Home
              </span>
            </li>

            {/* Services Dropdown */}
            <li 
              style={styles.navItem}
              onMouseEnter={() => handleDropdownEnter('services')}
              onMouseLeave={handleDropdownLeave}
            >
              <span
                style={{
                  ...styles.navLink,
                  ...(hoverState.navServices ? styles.navLinkHover : {})
                }}
                onMouseEnter={() => handleMouseEnter('navServices')}
                onMouseLeave={() => handleMouseLeave('navServices')}
              >
                Services ▼
              </span>
              <div style={{
                ...styles.dropdown,
                ...(activeDropdown === 'services' ? styles.dropdownVisible : {})
              }}>
                {servicesDropdown.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.dropdownItem,
                      ...(hoverState[`dropdown-${index}`] ? styles.dropdownItemHover : {})
                    }}
                    onClick={item.action}
                    onMouseEnter={() => handleMouseEnter(`dropdown-${index}`)}
                    onMouseLeave={() => handleMouseLeave(`dropdown-${index}`)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </li>

            <li style={styles.navItem}>
              <span
                style={{
                  ...styles.navLink,
                  ...(hoverState.navAbout ? styles.navLinkHover : {})
                }}
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                onMouseEnter={() => handleMouseEnter('navAbout')}
                onMouseLeave={() => handleMouseLeave('navAbout')}
              >
                About Us
              </span>
            </li>

            <li style={styles.navItem}>
              <span
                style={{
                  ...styles.navLink,
                  ...(hoverState.navContact ? styles.navLinkHover : {})
                }}
                onClick={() => alert('Contact us at:\n📞 +91 9788172033\n✉️ support@handyman.com\n📍 Sivakasi, Tamilnadu .')}
                onMouseEnter={() => handleMouseEnter('navContact')}
                onMouseLeave={() => handleMouseLeave('navContact')}
              >
                Contact
              </span>
            </li>

            {/* User Auth Section */}
            <li style={styles.navItem}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={styles.userInfo}>
                    <div style={styles.userAvatar}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span>Hi, {user.name}</span>
                  </div>
                  <button
                    style={{
                      ...styles.authButton,
                      ...(hoverState.navLogout ? styles.authButtonHover : {})
                    }}
                    onClick={onLogout}
                    onMouseEnter={() => handleMouseEnter('navLogout')}
                    onMouseLeave={() => handleMouseLeave('navLogout')}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                    style={{
                      ...styles.authButton,
                      ...(hoverState.navLogin ? styles.authButtonHover : {})
                    }}
                    onClick={onLoginClick}
                    onMouseEnter={() => handleMouseEnter('navLogin')}
                    onMouseLeave={() => handleMouseLeave('navLogin')}
                  >
                    Login / Register
                  </button>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBg}></div>
        <div style={styles.container}>
          <h1 style={styles.heroTitle}>Professional Home Services, Done Right</h1>
          <p style={styles.heroSubtitle}>
            From minor repairs to major renovations, connect with trusted professionals 
            who deliver quality workmanship at fair prices. Your satisfaction is 100% guaranteed.
          </p>
          <button 
            style={{
              ...styles.ctaButton,
              ...(hoverState.heroCta ? styles.ctaButtonHover : {})
            }}
            onMouseEnter={() => handleMouseEnter('heroCta')}
            onMouseLeave={() => handleMouseLeave('heroCta')}
            onClick={() => (user ? window.scrollTo({ top: 1400, behavior: 'smooth' }) : onLoginClick())}
          >
            {user ? 'Book a Service Now' : 'Get Started Today'}
          </button>
        </div>
      </section>

      <div style={styles.container}>
        {/* Loading and Error States */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            fontSize: '1.2rem',
            color: '#0c4b8e'
          }}>
            ⏳ Loading services...
          </div>
        )}
        
        {error && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '10px',
            margin: '20px 0',
            border: '1px solid #fecaca'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Stats Section */}
        <div style={styles.stats}>
          {stats.map((stat, i) => (
            <div 
              key={i} 
              style={{
                ...styles.statCard,
                ...(hoverState[`stat-${i}`] ? styles.statCardHover : {})
              }}
              onMouseEnter={() => handleMouseEnter(`stat-${i}`)}
              onMouseLeave={() => handleMouseLeave(`stat-${i}`)}
            >
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* About Us Section */}
        <section style={styles.aboutUs}>
          <h2 style={styles.sectionTitle}>
            About Us
            <span style={styles.sectionTitleAfter}></span>
          </h2>
          <p>
            At <strong style={{ color: '#0c4b8e' }}>Your Handyman</strong>, we are committed to making your life easier
            by connecting you with skilled professionals for all your home maintenance and repair needs.
            Whether it's a flickering light, a leaky pipe, or a room that needs painting, we've got you covered.
          </p>
          <p>
            Our team is made up of certified technicians who prioritize quality, punctuality, and customer satisfaction.
            We believe in transparent pricing and reliable service, ensuring your home is in safe hands.
            Founded in 2015, we've grown to become the most trusted home services platform in the region,
            serving thousands of satisfied customers.
          </p>
          <p>
            Our mission is to simplify home maintenance by providing a seamless booking experience, 
            vetted professionals, and quality guaranteed work. We stand behind every service with our 
            satisfaction guarantee.
          </p>
        </section>

        {/* Features Section */}
        <section>
          <h2 style={styles.sectionTitle}>
            Why Choose Your Handyman
            <span style={styles.sectionTitleAfter}></span>
          </h2>
          <div style={styles.features}>
            {features.map((feature, i) => (
              <div 
                key={i} 
                style={{
                  ...styles.featureCard,
                  ...(hoverState[`feature-${i}`] ? styles.featureCardHover : {})
                }}
                onMouseEnter={() => handleMouseEnter(`feature-${i}`)}
                onMouseLeave={() => handleMouseLeave(`feature-${i}`)}
              >
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section>
          <h2 style={styles.sectionTitle}>
            Our Services
            <span style={styles.sectionTitleAfter}></span>
          </h2>
          
          {!selectedCategory ? (
            <>
              <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto 50px', lineHeight: '1.6' }}>
                Browse our comprehensive range of professional home services. Click on any category to explore 
                available services, detailed descriptions, and transparent pricing.
              </p>
              
              {categories.length === 0 && !loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '15px',
                  color: '#64748b'
                }}>
                  No service categories available at the moment.
                </div>
              ) : (
                <div style={styles.categoriesGrid}>
                  {categories.map((cat, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.categoryCard,
                        ...(hoverState[`category-${i}`] ? styles.categoryCardHover : {})
                      }}
                      onClick={() => handleCategoryClick(cat)}
                      onMouseEnter={() => handleMouseEnter(`category-${i}`)}
                      onMouseLeave={() => handleMouseLeave(`category-${i}`)}
                    >
                      <div style={styles.categoryIcon}>
                        {getCategoryIcon(cat)}
                      </div>
                      <h3 style={{ color: '#0c4b8e', fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>{cat}</h3>
                      <p style={{ color: '#64748b', marginTop: '15px', fontWeight: '500' }}>View Services →</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <button 
                style={{
                  ...styles.backButton,
                  ...(hoverState.backButton ? styles.backButtonHover : {})
                }} 
                onClick={() => setSelectedCategory(null)}
                onMouseEnter={() => handleMouseEnter('backButton')}
                onMouseLeave={() => handleMouseLeave('backButton')}
              >
                ← Back to All Categories
              </button>
              <div ref={servicesRef}>
                <h2 style={{...styles.sectionTitle, marginBottom: '40px'}}>
                  {selectedCategory} Services
                  <span style={styles.sectionTitleAfter}></span>
                </h2>
                
                {services.length === 0 && !loading ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '15px',
                    color: '#64748b',
                    fontSize: '1.1rem'
                  }}>
                    No services available in this category at the moment.
                  </div>
                ) : (
                  <div style={styles.servicesGrid}>
                    {services.map(s => (
                      <div
                        key={s.service_id}
                        style={{
                          ...styles.serviceCard,
                          ...(hoverState[`service-${s.service_id}`] ? styles.serviceCardHover : {})
                        }}
                        onMouseEnter={() => handleMouseEnter(`service-${s.service_id}`)}
                        onMouseLeave={() => handleMouseLeave(`service-${s.service_id}`)}
                      >
                        <div style={styles.serviceBadge}>
                          {s.status === 'Active' ? 'Available' : s.status}
                        </div>
                        <h3 style={{ color: '#0c4b8e', fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px' }}>
                          {s.name}
                        </h3>
                        {s.subcategory && (
                          <p style={{ marginBottom: '12px', fontWeight: '600', color: '#4a5568' }}>
                            <b>Type:</b> {s.subcategory}
                          </p>
                        )}
                        <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
                          {s.description || 'Professional service with quality guarantee'}
                        </p>
                        <div style={styles.price}>
                          ₹{s.price}
                        </div>
                        {s.duration && (
                          <p style={{ marginTop: '10px', color: '#718096', fontSize: '0.9rem' }}>
                            <b>Duration:</b> {s.duration}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {/* Testimonials Section */}
        <section style={styles.testimonialSection}>
          <h2 style={{...styles.sectionTitle, color: '#0c4b8e'}}>
            What Our Customers Say
            <span style={styles.sectionTitleAfter}></span>
          </h2>
          <div style={styles.testimonials}>
            {testimonials.map((testimonial, i) => (
              <div 
                key={i} 
                style={{
                  ...styles.testimonialCard,
                  ...(hoverState[`testimonial-${i}`] ? styles.testimonialCardHover : {})
                }}
                onMouseEnter={() => handleMouseEnter(`testimonial-${i}`)}
                onMouseLeave={() => handleMouseLeave(`testimonial-${i}`)}
              >
                <div style={styles.quoteIcon}>"</div>
                <p style={styles.testimonialText}>{testimonial.text}</p>
                <div style={styles.testimonialAuthor}>{testimonial.author}</div>
                <div style={styles.testimonialRole}>{testimonial.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of satisfied customers who trust us with their home service needs. 
            Book a service today and experience the HandymanPro difference!
          </p>
          <button 
            style={{
              ...styles.ctaButton,
              ...(hoverState.finalCta ? styles.ctaButtonHover : {})
            }}
            onMouseEnter={() => handleMouseEnter('finalCta')}
            onMouseLeave={() => handleMouseLeave('finalCta')}
            onClick={() => (user ? window.scrollTo({ top: 1400, behavior: 'smooth' }) : onLoginClick())}
          >
            {user ? 'Book a Service Now' : 'Sign Up & Get Started'}
          </button>
        </section>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerHeading}>HandymanPro</h3>
            <p style={{ lineHeight: '1.6', opacity: '0.9' }}>
              Professional home services at your doorstep. Quality guaranteed, satisfaction assured.
            </p>
          </div>
          
          <div style={styles.footerSection}>
            <h3 style={styles.footerHeading}>Quick Links</h3>
            <ul style={styles.footerLinks}>
              {['Home', 'Services', 'About Us', 'Contact'].map((link, i) => (
                <li 
                  key={i}
                  style={{
                    ...styles.footerLink,
                    ...(hoverState[`footer-${link}`] ? styles.footerLinkHover : {})
                  }}
                  onMouseEnter={() => handleMouseEnter(`footer-${link}`)}
                  onMouseLeave={() => handleMouseLeave(`footer-${link}`)}
                  onClick={() => {
                    if (link === 'Home') {
                      setSelectedCategory(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (link === 'Services') {
                      window.scrollTo({ top: 1400, behavior: 'smooth' });
                    } else if (link === 'About Us') {
                      window.scrollTo({ top: 800, behavior: 'smooth' });
                    } else if (link === 'Contact') {
                      alert('Contact us at:\n📞 +91 9788171681\n✉️ support@handyman.com');
                    }
                  }}
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>
          
          <div style={styles.footerSection}>
            <h3 style={styles.footerHeading}>Contact Info</h3>
            <ul style={styles.footerLinks}>
              <li style={{ ...styles.footerLink, borderLeft: 'none', paddingLeft: '0' }}>📞 +91 9788172033</li>
              <li style={{ ...styles.footerLink, borderLeft: 'none', paddingLeft: '0' }}>✉️ support@handyman.com</li>
              <li style={{ ...styles.footerLink, borderLeft: 'none', paddingLeft: '0' }}>📍 sivakasi, Tamilnadu ,India</li>
            </ul>
          </div>  
          <div style={styles.footerSection}>
            <h3 style={styles.footerHeading}>Business Hours</h3>
            <ul style={styles.footerLinks}>
              <li style={{ ...styles.footerLink, borderLeft: 'none', paddingLeft: '0' }}>Mon - Fri: 7:00 AM - 9:00 PM</li>
              <li style={{ ...styles.footerLink, borderLeft: 'none', paddingLeft: '0' }}>Saturday: 8:00 AM - 8:00 PM</li>
              <li style={{ ...styles.footerLink, borderLeft: 'none', paddingLeft: '0' }}>Sunday: 9:00 AM - 6:00 PM</li>
              <li style={{ ...styles.footerLink, borderLeft: 'none', paddingLeft: '0', fontWeight: '600', color: '#a0c4ff' }}>Emergency: 24/7 Available</li>
            </ul>
          </div>
        </div>
        
        <div style={styles.copyright}>
          <p>&copy; 2025 Your Handyman. All rights reserved. | Professional Home Services</p>
        </div>
      </footer>
    </div>
  );
}