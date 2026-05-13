import React, { useState, useEffect } from "react";

const styles = {
  searchBar: { display: "flex", gap: "12px", marginBottom: "24px", alignItems: "center" },
  searchInput: { flex: 1, padding: "12px 16px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", maxWidth: "400px" },
  filterSelect: { padding: "12px 16px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", backgroundColor: "white" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" },
  card: { backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #f3f4f6" },
  serviceName: { color: "#1f2937", fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
  category: { color: "#6b7280", fontSize: "14px", marginBottom: "12px" },
  description: { color: "#374151", fontSize: "14px", lineHeight: "1.5", marginBottom: "16px", minHeight: "60px" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f3f4f6" },
  price: { fontWeight: "bold", color: "#059669", fontSize: "20px" },
  bookButton: { backgroundColor: "#3b82f6", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  bookButtonDisabled: { backgroundColor: "#9ca3af", cursor: "not-allowed" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { backgroundColor: "white", padding: "24px", borderRadius: "12px", maxWidth: "500px", width: "90%", maxHeight: "90vh", overflowY: "auto" },
  modalTitle: { fontSize: "20px", fontWeight: "bold", marginBottom: "16px", color: "#1f2937" },
  paymentOption: { display: "flex", alignItems: "center", gap: "12px", padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", marginBottom: "8px", cursor: "pointer" },
  paymentOptionSelected: { borderColor: "#3b82f6", backgroundColor: "#eff6ff" },
  paymentLabel: { fontSize: "14px", fontWeight: "600" },
  buttonGroup: { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" },
  confirmButton: { backgroundColor: "#059669", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  cancelButton: { backgroundColor: "#6b7280", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  detailsTable: { width: "100%", borderCollapse: "collapse", margin: "16px 0" },
  detailsRow: { borderBottom: "1px solid #e5e7eb" },
  detailsCell: { padding: "8px 12px", textAlign: "left" },
  detailsLabel: { fontWeight: "600", color: "#374151", width: "40%" },
  detailsValue: { color: "#1f2937" }
};


export default function ServicesPage({ user }) {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  // use user.user_id from parent (backend expects user_id in URL)
  const customerId = user?.user_id ?? null;
  const [booked, setBooked] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Updated payment methods to match database enum values exactly
  const paymentMethods = [
    { id: "Cash", label: "💰 Cash on Service" },
    { id: "Credit Card", label: "💳 Credit Card" },
    { id: "Debit Card", label: "💳 Debit Card" },
    { id: "UPI", label: "📱 UPI Payment" },
    { id: "Bank Transfer", label: "🏦 Bank Transfer" }
  ];

  useEffect(() => {
    async function fetchServices() {
      console.log("🟢 [DEBUG] Fetching services from backend...");
      try {
        const response = await fetch("http://localhost:5000/api/customer/services");
        console.log("🟢 [DEBUG] Response status:", response.status);

        if (!response.ok) {
          console.error("❌ [DEBUG] Network response was not ok:", response.statusText);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ [DEBUG] Services received:", data);

        if (!Array.isArray(data)) {
          console.error("❌ [DEBUG] Expected array but got:", typeof data, data);
        }

        setServices(data);
      } catch (error) {
        console.error("💥 [DEBUG] Error fetching services:", error);
      } finally {
        setLoading(false);
        console.log("🟡 [DEBUG] Fetching complete. Loading set to false.");
      }
    }
    fetchServices();
  }, []);

  const categories = ["All", ...new Set(services.map(s => s.category))];

  const filteredServices = services.filter(service => {
    const matchSearch =
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "All" || service.category === categoryFilter;
    const isActive = service.status === 'Active'; // Only show active services
    return matchSearch && matchCategory && isActive;
  });

  const handleBookClick = (service) => {
    setSelectedService(service);
    setPaymentMethod("");
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    setShowPaymentModal(false);
    setShowConfirmation(true);
  };

  const handleFinalBooking = async () => {
    if (!selectedService) return;
    if (!user?.user_id) {
      alert("Please log in to book a service.");
      return;
    }

    const url = `http://localhost:5000/api/customer/book/${user.user_id}`;
    const body = { service_id: selectedService.service_id };
    console.log(`🟣 [DEBUG] Final booking — URL: ${url}`);
    console.log("🟣 [DEBUG] Final booking — body:", body);

    try {
      // Create the booking (user_id is in URL; backend will resolve/create customer)
      const bookingResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log("🟣 [DEBUG] Booking response status:", bookingResponse.status);
      const bookingResult = await bookingResponse.json();
      console.log("🟣 [DEBUG] Booking response JSON:", bookingResult);

      if (bookingResponse.ok) {
        // Then create payment record
        const paymentResponse = await fetch("http://localhost:5000/api/customer/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking_id: bookingResult.booking_id,
            amount: selectedService.price,
            payment_method: paymentMethod,
            status: paymentMethod === 'Cash' ? 'pending' : 'completed'
          }),
        });

        const paymentResult = await paymentResponse.json();
        
        if (paymentResponse.ok) {
          alert("✅ Service booked successfully! Payment recorded.");
          setBooked(prev => [...prev, selectedService.service_id]);
          console.log("✅ [DEBUG] Booking and payment success!");
        } else {
          console.error("❌ [DEBUG] Payment recording failed:", paymentResult);
          alert("Service booked but payment recording failed. Please contact support.");
        }
      } else {
        alert(bookingResult.error || "Booking failed");
        console.error("❌ [DEBUG] Booking error from backend:", bookingResult);
      }
    } catch (err) {
      console.error("💥 [DEBUG] Booking failed due to fetch error:", err);
      alert("Booking failed. Try again!");
    } finally {
      setShowConfirmation(false);
      setSelectedService(null);
      setPaymentMethod("");
    }
  };

  if (loading) {
    console.log("⏳ [DEBUG] Still loading...");
    return <div>Loading services...</div>;
  }

  console.log("🟩 [DEBUG] Render stage: displaying", filteredServices.length, "services.");

  return (
    <div>
      <h1 style={{ marginBottom: "24px", color: "#1f2937" }}>Available Services</h1>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search services..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          style={styles.filterSelect}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={styles.grid}>
        {filteredServices.map(service => {
          const isBooked = booked.includes(service.service_id);
          return (
            <div key={service.service_id} style={styles.card}>
              <h3 style={styles.serviceName}>{service.name}</h3>
              <div style={styles.category}>🔧 {service.category} / {service.subcategory}</div>
              <p style={styles.description}>{service.description}</p>
              <div style={styles.footer}>
                <span style={styles.price}>₹{service.price}</span>
                <button
                  style={isBooked ? { ...styles.bookButton, ...styles.bookButtonDisabled } : styles.bookButton}
                  disabled={isBooked}
                  onClick={() => handleBookClick(service)}
                >
                  {isBooked ? "Booked ✅" : "Book Now"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          No services found matching your criteria.
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && selectedService && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Select Payment Method</h3>
            <p style={{ marginBottom: "16px", color: "#6b7280" }}>
              Choose how you'd like to pay for: <strong>{selectedService.name}</strong>
            </p>
            
            {paymentMethods.map(method => (
              <div
                key={method.id}
                style={{
                  ...styles.paymentOption,
                  ...(paymentMethod === method.id ? styles.paymentOptionSelected : {})
                }}
                onClick={() => setPaymentMethod(method.id)}
              >
                <input
                  type="radio"
                  id={method.id}
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                />
                <label htmlFor={method.id} style={styles.paymentLabel}>
                  {method.label}
                </label>
              </div>
            ))}
            
            <div style={styles.buttonGroup}>
              <button 
                style={styles.cancelButton}
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button 
                style={styles.confirmButton}
                onClick={handlePaymentConfirm}
                disabled={!paymentMethod}
              >
                Continue to Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && selectedService && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Confirm Booking</h3>
            <p style={{ marginBottom: "16px", color: "#6b7280" }}>
              Please review your booking details:
            </p>
            
            <table style={styles.detailsTable}>
              <tbody>
                <tr style={styles.detailsRow}>
                  <td style={{...styles.detailsCell, ...styles.detailsLabel}}>Service:</td>
                  <td style={{...styles.detailsCell, ...styles.detailsValue}}>{selectedService.name}</td>
                </tr>
                <tr style={styles.detailsRow}>
                  <td style={{...styles.detailsCell, ...styles.detailsLabel}}>Category:</td>
                  <td style={{...styles.detailsCell, ...styles.detailsValue}}>{selectedService.category} / {selectedService.subcategory}</td>
                </tr>
                <tr style={styles.detailsRow}>
                  <td style={{...styles.detailsCell, ...styles.detailsLabel}}>Description:</td>
                  <td style={{...styles.detailsCell, ...styles.detailsValue}}>{selectedService.description}</td>
                </tr>
                <tr style={styles.detailsRow}>
                  <td style={{...styles.detailsCell, ...styles.detailsLabel}}>Price:</td>
                  <td style={{...styles.detailsCell, ...styles.detailsValue}}>₹{selectedService.price}</td>
                </tr>
                <tr style={styles.detailsRow}>
                  <td style={{...styles.detailsCell, ...styles.detailsLabel}}>Payment Method:</td>
                  <td style={{...styles.detailsCell, ...styles.detailsValue}}>
                    {paymentMethods.find(m => m.id === paymentMethod)?.label}
                  </td>
                </tr>
                <tr style={styles.detailsRow}>
                  <td style={{...styles.detailsCell, ...styles.detailsLabel}}>Payment Status:</td>
                  <td style={{...styles.detailsCell, ...styles.detailsValue}}>
                    {paymentMethod === 'Cash' ? 'Pending (Pay on service)' : 'Completed'}
                  </td>
                </tr>
                <tr style={styles.detailsRow}>
                  <td style={{...styles.detailsCell, ...styles.detailsLabel}}>Booking Date:</td>
                  <td style={{...styles.detailsCell, ...styles.detailsValue}}>
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div style={styles.buttonGroup}>
              <button 
                style={styles.cancelButton}
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                style={styles.confirmButton}
                onClick={handleFinalBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}