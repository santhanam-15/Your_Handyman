import express from "express";
const router = express.Router();

// Get comprehensive system statistics
router.get("/statistics", async (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const statistics = {};

    // 1. Total Users Count
    const usersQuery = "SELECT COUNT(*) as count FROM users";
    const [usersResult] = await db.promise().query(usersQuery);
    statistics.totalUsers = usersResult[0].count;

    // 2. Users by Role
    const rolesQuery = `
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `;
    const [rolesResult] = await db.promise().query(rolesQuery);
    statistics.usersByRole = rolesResult;

    // 3. Total Bookings Count
    const bookingsQuery = "SELECT COUNT(*) as count FROM bookings";
    const [bookingsResult] = await db.promise().query(bookingsQuery);
    statistics.totalBookings = bookingsResult[0].count;

    // 4. Bookings by Status
    const bookingsStatusQuery = `
      SELECT status, COUNT(*) as count 
      FROM bookings 
      GROUP BY status
    `;
    const [bookingsStatusResult] = await db.promise().query(bookingsStatusQuery);
    statistics.bookingsByStatus = bookingsStatusResult;

    // 5. Total Revenue (from completed payments)
    const revenueQuery = `
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM payments 
      WHERE status = 'completed'
    `;
    const [revenueResult] = await db.promise().query(revenueQuery);
    statistics.totalRevenue = parseFloat(revenueResult[0].total) || 0;

    // 6. Monthly Revenue (last 6 months)
    const monthlyRevenueQuery = `
      WITH RECURSIVE months AS (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m') AS month,
               DATE_SUB(CURDATE(), INTERVAL 5 MONTH) AS d
        UNION ALL
        SELECT DATE_FORMAT(DATE_ADD(d, INTERVAL 1 MONTH), '%Y-%m'),
               DATE_ADD(d, INTERVAL 1 MONTH)
        FROM months
        WHERE d < DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 0 DAY
      )
      SELECT m.month,
             COALESCE(SUM(p.amount), 0) AS revenue
      FROM months m
      LEFT JOIN payments p
        ON DATE_FORMAT(p.payment_date, '%Y-%m') = m.month
       AND p.status = 'completed'
      GROUP BY m.month
      ORDER BY m.month;
    `;
    const [monthlyRevenueResult] = await db.promise().query(monthlyRevenueQuery);
    statistics.monthlyRevenue = monthlyRevenueResult;

    // 7. Active Services Count
    const activeServicesQuery = `
      SELECT COUNT(*) as count 
      FROM services 
      WHERE status = 'Active'
    `;
    const [activeServicesResult] = await db.promise().query(activeServicesQuery);
    statistics.activeServices = activeServicesResult[0].count;

    // 8. Services by Category
    const servicesByCategoryQuery = `
      SELECT category, COUNT(*) as count 
      FROM services 
      WHERE status = 'Active'
      GROUP BY category
    `;
    const [servicesByCategoryResult] = await db.promise().query(servicesByCategoryQuery);
    statistics.servicesByCategory = servicesByCategoryResult;

    // 9. Pending Bookings Count
    const pendingBookingsQuery = `
      SELECT COUNT(*) as count 
      FROM bookings 
      WHERE status = 'pending'
    `;
    const [pendingBookingsResult] = await db.promise().query(pendingBookingsQuery);
    statistics.pendingBookings = pendingBookingsResult[0].count;

    // 10. Completed Bookings Count
    const completedBookingsQuery = `
      SELECT COUNT(*) as count 
      FROM bookings 
      WHERE status = 'completed'
    `;
    const [completedBookingsResult] = await db.promise().query(completedBookingsQuery);
    statistics.completedBookings = completedBookingsResult[0].count;

    // 11. Service Providers Statistics - FIXED to handle null values
    const providersQuery = `
      SELECT 
        COUNT(*) as totalProviders,
        COALESCE(AVG(rating), 0) as avgRating,
        COALESCE(AVG(experience_years), 0) as avgExperience
      FROM service_providers
    `;
    const [providersResult] = await db.promise().query(providersQuery);
    statistics.providersStats = {
      totalProviders: providersResult[0].totalProviders,
      avgRating: parseFloat(providersResult[0].avgRating) || 0,
      avgExperience: parseFloat(providersResult[0].avgExperience) || 0
    };

    // 12. Recent User Registrations (last 30 days)
    const recentUsersQuery = `
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `;
    const [recentUsersResult] = await db.promise().query(recentUsersQuery);
    statistics.recentRegistrations = recentUsersResult[0].count;

    // 13. Payment Methods Distribution
    const paymentMethodsQuery = `
      SELECT 
        payment_method,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM payments 
      WHERE status = 'completed'
      GROUP BY payment_method
    `;
    const [paymentMethodsResult] = await db.promise().query(paymentMethodsQuery);
    statistics.paymentMethods = paymentMethodsResult;

    // 14. Top Services by Bookings
    const topServicesQuery = `
      SELECT 
        s.name,
        s.category,
        COUNT(b.booking_id) as booking_count,
        COALESCE(SUM(p.amount), 0) as total_revenue
      FROM services s
      LEFT JOIN bookings b ON s.service_id = b.service_id
      LEFT JOIN payments p ON b.booking_id = p.booking_id AND p.status = 'completed'
      GROUP BY s.service_id, s.name, s.category
      ORDER BY booking_count DESC
      LIMIT 10
    `;
    const [topServicesResult] = await db.promise().query(topServicesQuery);
    statistics.topServices = topServicesResult;

    res.json(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});
// Add these routes to your superadmin.js file

// Get all admins
router.get("/admins", async (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const query = `
      SELECT user_id, name, email, phone, created_at 
      FROM users 
      WHERE role = 'admin' 
      ORDER BY created_at DESC
    `;
    
    const [results] = await db.promise().query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
});

// Create new admin (NO PASSWORD HASHING)


// Delete admin
router.delete("/admins/:id", async (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const adminId = req.params.id;

    // Check if admin exists and is not super admin
    const checkQuery = "SELECT role FROM users WHERE user_id = ?";
    const [users] = await db.promise().query(checkQuery, [adminId]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (users[0].role === 'super_admin') {
      return res.status(403).json({ error: "Cannot delete super admin" });
    }

    // Delete only admin users
    const deleteQuery = "DELETE FROM users WHERE user_id = ? AND role = 'admin'";
    const [result] = await db.promise().query(deleteQuery, [adminId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: "Failed to delete admin" });
  }
});

// Update admin information
router.put("/admins/:id", async (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const adminId = req.params.id;
    const { name, email, phone } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if email already exists for other users
    const emailCheckQuery = "SELECT user_id FROM users WHERE email = ? AND user_id != ?";
    const [existingUsers] = await db.promise().query(emailCheckQuery, [email, adminId]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const updateQuery = `
      UPDATE users 
      SET name = ?, email = ?, phone = ?
      WHERE user_id = ? AND role = 'admin'
    `;
    
    const [result] = await db.promise().query(updateQuery, [
      name, 
      email, 
      phone || null,
      adminId
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json({ 
      message: "Admin updated successfully"
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "Failed to update admin" });
  }
});

// Get admin by ID
router.get("/admins/:id", async (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const adminId = req.params.id;

    const query = `
      SELECT user_id, name, email, phone, created_at 
      FROM users 
      WHERE user_id = ? AND role = 'admin'
    `;
    
    const [results] = await db.promise().query(query, [adminId]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).json({ error: "Failed to fetch admin" });
  }
});
// Create new admin (store password as plain text)
router.post("/create-admin", async (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // Check if email already exists
    const emailCheckQuery = "SELECT user_id FROM users WHERE email = ?";
    const [existingUsers] = await db.promise().query(emailCheckQuery, [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Insert admin with PLAIN TEXT PASSWORD (no hashing)
    const insertQuery = `
      INSERT INTO users (name, email, password_hash, phone, role) 
      VALUES (?, ?, ?, ?, 'admin')
    `;
    
    const [result] = await db.promise().query(insertQuery, [
      name, 
      email, 
      password, // Storing plain text password directly
      phone || null
    ]);
    
    res.json({ 
      message: "Admin created successfully", 
      adminId: result.insertId 
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ error: "Failed to create admin" });
  }
});

// Add this new route for custom date range revenue
router.get("/statistics/revenue", async (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }

    const customRevenueQuery = `
      WITH RECURSIVE dates AS (
        SELECT ? as date
        UNION ALL
        SELECT DATE_ADD(date, INTERVAL 1 DAY)
        FROM dates
        WHERE date < ?
      )
      SELECT 
        DATE_FORMAT(d.date, '%Y-%m-%d') as date,
        COALESCE(SUM(p.amount), 0) as revenue
      FROM dates d
      LEFT JOIN payments p ON DATE(p.payment_date) = d.date 
        AND p.status = 'completed'
      GROUP BY d.date
      ORDER BY d.date;
    `;


    const [customRevenueResult] = await db.promise().query(customRevenueQuery, [startDate, endDate]);
    res.json(customRevenueResult);
  } catch (error) {
    console.error("Error fetching custom range revenue:", error);
    res.status(500).json({ error: "Failed to fetch custom range revenue" });
  }
});
export default router;
// ... rest of the routes remain the same