// dashboard.jsx
import React, { useState } from "react";
import DashboardLayout from './components/layout/DashboardLayout.jsx';

// Admin Pages
import AdminProfilePage from './pages/admin/ProfilePage.jsx';
import ServiceManagementPage from './pages/admin/ServiceManagementPage.jsx';
import StaffManagementPage from './pages/admin/StaffManagementPage.jsx';
import BookingManagementPage from './pages/admin/BookingManagementPage.jsx'; // FIXED PATH
import PaymentManagementPage from './pages/admin/PaymentManagementPage.jsx';
import UserManagementPage from "./pages/admin/UserManagementPage.jsx";

// Customer Pages  
import CustomerProfilePage from './pages/customer/ProfilePage.jsx';
import ServicePage from './pages/customer/ServicePage.jsx'; // FIXED: Changed from ServicesPage to ServicePage
import MyBookingsPage from './pages/customer/MyBookingsPage.jsx';
import CustomerLogsPage from './pages/customer/MyLogsPage.jsx';

// Service Provider Pages
import ProviderProfilePage from './pages/serviceProvider/ProfilePage.jsx';
import JobsPage from './pages/serviceProvider/JobsPage.jsx';
import ProviderLogsPage from './pages/serviceProvider/MyLogsPage.jsx';
// Super Admin Pages
import StatisticsPage from './pages/superadmin/StatisticsPage.jsx';
import ManageAdminPage from './pages/superadmin/ManageAdminPage.jsx';

function Dash({ user }) { // Receive entire user object
  const [selected, setSelected] = useState(
  user?.role === "super_admin" ? "Statistics" : "Profile"
);

  const [saselected, setSaselected] = useState("statistics");
  const role = user?.role || "customer"; 
  console.log(role); // Extract role from user object
  //const us = localStorage.setItem({user});
  const renderContent = () => {
    // Common pages
    if (selected === "Back to Home Page" || selected === "Log Out") {
      window.location.href = "/";
      return null;
    }
    // Role-specific pages
    switch (role) {
      case "super_admin":
    switch (selected) {
    case "Statistics":
      return <StatisticsPage />;
    case "Service Management":
      return <ServiceManagementPage />;
    case "Manage Admin":
      return <ManageAdminPage />;
    case "Logout":
      window.location.href = "/";
      return null;
    default:
      return <DefaultContent selected={selected} />;
  }
      case "admin":
        switch (selected) {
          case "Profile":
            return <AdminProfilePage user={user} />; // Pass user to profile page
          case "Service Management":
            return <ServiceManagementPage />;
          case "Staff Management":
            return <StaffManagementPage />;
          case "Booking Management":
            return <BookingManagementPage />;
          case "Payment Management":
            return <PaymentManagementPage />;
          case "Users Management":
            return <UserManagementPage />;
          case "Logout":
            window.location.href = "/";
            return null
          default:
            return <DefaultContent selected={selected} />;
        }

      // In your dashboard.jsx, update the service_provider case:
case "service_provider":
  switch (selected) {
    case "Profile":
      return <ProviderProfilePage user={user} />;
    case "Jobs":
      return <JobsPage user={user} />; // Pass user here
    case "My Logs":
      return <ProviderLogsPage user={user} />;
    case "Logout":
      window.location.href = "/";
      return null;
    default:
      return <DefaultContent selected={selected} />;
  }

      case "customer":
        switch (selected) {
          case "Profile":
            return <CustomerProfilePage user={user} />; // Pass user to profile page
          case "Services":
            return <ServicePage user={user}/>; // FIXED: Now matches the import
          case "My Bookings":
            return <MyBookingsPage user={user}/>;
          case "My Logs":
            return <CustomerLogsPage user={user} />
          case "Logout":
            window.location.href = "/";
            return null;
          default:
            return <DefaultContent selected={selected} />;
        }

      default:
        return <DefaultContent selected={selected} />;
    }
  };

  return (
    <DashboardLayout 
      role={role} 
      selected={selected} 
      onNavSelect={setSelected}
      user={user} // Pass user to layout if needed
    >
      {renderContent()}
    </DashboardLayout>
  );
}

// Default content for unimplemented pages
function DefaultContent({ selected }) {
  return (
    <div>
      <h1>{selected}</h1>
      <p>Content for "{selected}" will be implemented soon.</p>
    </div>
  );
}

export default Dash;