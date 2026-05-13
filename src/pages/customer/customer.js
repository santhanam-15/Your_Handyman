import express from "express";
const router = express.Router();

// GET profile
router.get("/profile/:user_id", (req, res) => {
  console.log('🔧 GET /profile/:user_id - Started');
  const db = req.app.get('db');
  const userId = req.params.user_id;
  console.log('👤 User ID:', userId);

  const sql = `
    SELECT 
      u.user_id,
      u.name, 
      u.email, 
      u.phone, 
      u.created_at,
      c.address,
      COUNT(b.booking_id) AS total_bookings,
      COUNT(CASE WHEN b.status = 'completed' THEN 1 END) AS completed_bookings,
      COUNT(CASE WHEN b.status IN ('pending', 'confirmed') THEN 1 END) AS pending_bookings
    FROM users u
    LEFT JOIN customers c ON u.user_id = c.user_id
    LEFT JOIN bookings b ON c.customer_id = b.customer_id
    WHERE u.user_id = ?
    GROUP BY u.user_id, u.name, u.email, u.phone, u.created_at, c.address
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('💥 Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    if (!results || results.length === 0) {
      console.log('❌ Customer not found');
      return res.status(404).json({ error: "Customer not found" });
    }

    const customer = results[0];
    const response = {
      user_id: customer.user_id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || "Not specified",
      totalBookings: customer.total_bookings || 0,
      completedBookings: customer.completed_bookings || 0,
      pendingBookings: customer.pending_bookings || 0,
      joinDate: new Date(customer.created_at).toLocaleDateString()
    };

    console.log('📤 Sending response:', response);
    res.json(response);
  });
});

// PUT profile (update)
router.put("/profile/:user_id", (req, res) => {
  console.log('🔧 PUT /profile/:user_id - Started');
  const db = req.app.get('db');
  const userId = req.params.user_id;
  const { name, email, phone, address } = req.body;

  console.log('👤 User ID:', userId);
  console.log('📦 Request body:', req.body);

  db.beginTransaction(err => {
    if (err) {
      console.error('💥 Transaction error:', err);
      return res.status(500).json({ error: err.message });
    }

    const updateUserSql = `
      UPDATE users
      SET name = ?, email = ?, phone = ?
      WHERE user_id = ?
    `;
    db.query(updateUserSql, [name, email, phone, userId], (err, userRes) => {
      if (err) {
        console.error('💥 Database error (users):', err);
        return db.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }

      const updateCustomerSql = `
        INSERT INTO customers (user_id, address)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE address = VALUES(address)
      `;
      db.query(updateCustomerSql, [userId, address], (err, custRes) => {
        if (err) {
          console.error('💥 Database error (customers):', err);
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        db.commit(err => {
          if (err) {
            console.error('💥 Commit error:', err);
            return db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }
          console.log('✅ Profile updated successfully');
          res.json({
            message: "Profile updated successfully",
            updatedFields: { name, email, phone, address }
          });
        });
      });
    });
  });
});

// PUT change-password
router.put("/change-password", (req, res) => {
  console.log('🔧 PUT /change-password - Started');
  const db = req.app.get('db');
  const { user_id, currentPassword, newPassword } = req.body;

  console.log('👤 User ID:', user_id);
  console.log('📦 Request body:', { user_id, currentPassword: '***', newPassword: '***' });

  if (!user_id || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const verifySql = `SELECT password_hash FROM users WHERE user_id = ?`;
  db.query(verifySql, [user_id], (err, results) => {
    if (err) {
      console.error('💥 Database error (verify):', err);
      return res.status(500).json({ error: err.message });
    }

    if (!results || results.length === 0) {
      console.log('❌ User not found');
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    if (user.password_hash !== currentPassword) {
      console.log('❌ Current password is incorrect');
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const updateSql = `
      UPDATE users
      SET password_hash = ?
      WHERE user_id = ?
    `;
    db.query(updateSql, [newPassword, user_id], (err, updRes) => {
      if (err) {
        console.error('💥 Database error (update):', err);
        return res.status(500).json({ error: err.message });
      }

      if (updRes.affectedRows === 0) {
        console.error('❌ Failed to update password');
        return res.status(500).json({ error: "Failed to update password" });
      }

      console.log('✅ Password updated successfully');
      res.json({ message: "Password updated successfully" });
    });
  });
});

// GET bookings of a user
router.get("/bookings/:user_id", (req, res) => {
  console.log('🔧 GET /bookings/:user_id - Started');
  const db = req.app.get('db');
  const userId = req.params.user_id;
  console.log('👤 User ID:', userId);

  const sql = `
    SELECT 
      b.booking_id,
      b.booking_date,
      b.status,
      b.total_amount,
      s.name AS service_name,
      s.description AS service_description,
      b.assigned_staff_id,
      c.address AS service_address,
      b.created_at
    FROM bookings b
    INNER JOIN customers c ON b.customer_id = c.customer_id
    INNER JOIN users u ON c.user_id = u.user_id
    INNER JOIN services s ON b.service_id = s.service_id
    WHERE u.user_id = ?
    ORDER BY b.booking_date DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('💥 Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    const bookings = (results || []).map(booking => ({
      booking_id: booking.booking_id,
      service_name: booking.service_name,
      service_description: booking.service_description,
      booking_date: booking.booking_date,
      status: booking.status,
      total_amount: booking.total_amount,
      assigned_staff_id: booking.assigned_staff_id,
      service_address: booking.service_address,
      created_at: booking.created_at
    }));

    console.log('📤 Sending response:', bookings);
    res.json(bookings);
  });
});

// PUT cancel booking
router.put("/bookings/:booking_id/cancel", (req, res) => {
  console.log('🔧 PUT /bookings/:booking_id/cancel - Started');
  const db = req.app.get('db');
  const bookingId = req.params.booking_id;
  console.log('📋 Booking ID:', bookingId);

  const sql = `
    UPDATE bookings
    SET status = 'cancelled'
    WHERE booking_id = ? AND status IN ('pending', 'confirmed')
  `;
  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error('💥 Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    if (!result || result.affectedRows === 0) {
      console.log('❌ Booking not found or cannot be cancelled');
      return res.status(404).json({ error: "Booking not found or cannot be cancelled" });
    }

    console.log('✅ Booking cancelled successfully');
    res.json({ message: "Booking cancelled successfully" });
  });
});

// POST book a service

// ...existing code...
// POST book a service — accept user_id in URL: POST /book/:user_id
router.post("/book/:user_id", (req, res) => {
  const db = req.app.get("db");
  const userId = req.params.user_id;
  const { service_id } = req.body;

  console.log("🔧 POST /book/:user_id - Started");
  console.log("👤 user_id (from URL):", userId);
  console.log("📥 Request body:", req.body);

  if (!userId || !service_id) {
    console.warn("⚠️ Missing user_id (URL) or service_id (body)");
    return res.status(400).json({ error: "Missing user_id in URL or service_id in body" });
  }

  // Resolve or create customer_id for this user_id
  const findCustSql = `SELECT customer_id FROM customers WHERE user_id = ?`;
  db.query(findCustSql, [userId], (err, custRows) => {
    if (err) {
      console.error("💥 Database error (find customer):", err);
      return res.status(500).json({ error: err.message });
    }
console.log(userId);

    const proceedWithCustomerId = (customerId) => {
      // Get service price
      const getPriceSql = `SELECT price FROM services WHERE service_id = ?`;
      db.query(getPriceSql, [service_id], (err, priceResults) => {
        if (err) {
          console.log("💥 [ERROR] Failed to fetch service price:", err.message);
          return res.status(500).json({ error: "Database error while fetching service details." });
        }
        if (!priceResults || priceResults.length === 0) {
          return res.status(404).json({ error: "Service not found" });
        }
        const servicePrice = priceResults[0].price;
        console.log(customerId);
        const insertSql = `
          INSERT INTO bookings (customer_id, service_id, booking_date, status, total_amount)
          VALUES (?, ?, NOW(), 'pending', ?)
        `;
        db.query(insertSql, [customerId, service_id, servicePrice], (err, result) => {
          if (err) {
            console.log("💥 [ERROR] Failed to insert booking:", err.message);
            return res.status(500).json({ error: "Database error while booking service." });
          }
          if (!result.insertId) {
            console.log("💥 [ERROR] Booking insert succeeded but no insertId returned.");
            return res.status(500).json({ error: "Unexpected database behavior." });
          }
          console.log("✅ Booking created. booking_id:", result.insertId, "customer_id:", customerId);
          res.json({
            message: "✅ Service booked successfully!",
            booking_id: result.insertId,
            total_amount: servicePrice,
            customer_id: customerId
          });
        });
      });
    };

    if (custRows && custRows.length > 0) {
      proceedWithCustomerId(custRows[0].customer_id);
    } else {
      // create customer record for this user_id
      const insertCustSql = `INSERT INTO customers (user_id) VALUES (?)`;
      db.query(insertCustSql, [userId], (err2, result2) => {
        if (err2) {
          console.error("💥 Database error (create customer):", err2);
          return res.status(500).json({ error: err2.message });
        }
        const newCustomerId = result2.insertId;
        console.log("🆕 Created customer record:", newCustomerId, "for user_id:", userId);
        proceedWithCustomerId(newCustomerId);
      });
    }
  });
});
// ...existing code...
// POST payments
router.post("/payments", (req, res) => {
  console.log('🔧 POST /payments - Started');
  const db = req.app.get('db');
  const { booking_id, amount, payment_method, status } = req.body;

  console.log('📦 Payment data:', { booking_id, amount, payment_method, status });

  if (!booking_id || !amount || !payment_method) {
    console.log('❌ Missing required payment fields');
    return res.status(400).json({ error: "Missing required payment fields" });
  }

  const allowedPaymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];
  if (!allowedPaymentMethods.includes(payment_method)) {
    console.log('❌ Invalid payment method:', payment_method);
    return res.status(400).json({ error: "Invalid payment method" });
  }

  const sql = `
    INSERT INTO payments (booking_id, amount, status, payment_method, payment_date)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(sql, [booking_id, amount, status, payment_method], (err, results) => {
    if (err) {
      console.error('💥 Database error (payments):', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('✅ Payment recorded successfully, ID:', results.insertId);
    res.json({
      message: "Payment recorded successfully",
      payment_id: results.insertId
    });
  });
});

// GET active services
router.get("/services", (req, res) => {
  const db = req.app.get("db");
  const sql = "SELECT * FROM services WHERE status = 'Active' ORDER BY category, name";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("💥 [ERROR] Failed to fetch services:", err.message);
      return res.status(500).json({ error: "Database error while fetching services." });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ error: "No services available." });
    }
    res.json(results);
  });
});

// POST review for a booking
router.post("/bookings/:booking_id/review", (req, res) => {
  console.log('🔧 POST /bookings/:booking_id/review - Started');
  const db = req.app.get('db');
  const bookingId = req.params.booking_id;
  const { rating, comment } = req.body;
  console.log('📦 Review data:', { bookingId, rating, comment });

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error('💥 Transaction error:', err);
      return res.status(500).json({ error: err.message });
    }

    const getBookingSql = `
      SELECT assigned_staff_id AS provider_id, status
      FROM bookings
      WHERE booking_id = ?
    `;
    db.query(getBookingSql, [bookingId], (err, bookingResults) => {
      if (err) {
        console.error('💥 Database error:', err);
        return db.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }

      if (!bookingResults || bookingResults.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: "Booking not found" });
        });
      }

      const booking = bookingResults[0];
      if (booking.status !== 'completed') {
        return db.rollback(() => {
          res.status(400).json({ error: "Only completed bookings can be reviewed" });
        });
      }
      if (!booking.provider_id) {
        return db.rollback(() => {
          res.status(400).json({ error: "No service provider assigned to this booking" });
        });
      }

      const checkReviewSql = `SELECT * FROM reviews WHERE booking_id = ?`;
      db.query(checkReviewSql, [bookingId], (err, reviewResults) => {
        if (err) {
          console.error('💥 Database error:', err);
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        let reviewAction;
        if (reviewResults && reviewResults.length > 0) {
          reviewAction = 'updated';
          const updateSql = `
            UPDATE reviews
            SET rating = ?, comment = ?, created_at = NOW()
            WHERE booking_id = ?
          `;
          db.query(updateSql, [rating, comment, bookingId], (err) => {
            if (err) {
              console.error('💥 Database error:', err);
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }
            updateProviderRating(db, booking.provider_id, res, reviewAction);
          });
        } else {
          reviewAction = 'submitted';
          const insertSql = `
            INSERT INTO reviews (booking_id, provider_id, rating, comment, created_at)
            VALUES (?, ?, ?, ?, NOW())
          `;
          db.query(insertSql, [bookingId, booking.provider_id, rating, comment], (err, insertResults) => {
            if (err) {
              console.error('💥 Database error:', err);
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }
            updateProviderRating(db, booking.provider_id, res, reviewAction);
          });
        }
      });
    });
  });
});

// Helper: update provider rating
function updateProviderRating(db, providerId, res, reviewAction) {
  const avgRatingSql = `
    SELECT AVG(rating) AS average_rating, COUNT(*) AS total_reviews
    FROM reviews
    WHERE provider_id = ?
  `;
  db.query(avgRatingSql, [providerId], (err, ratingResults) => {
    if (err) {
      console.error('💥 Database error:', err);
      return db.rollback(() => {
        res.status(500).json({ error: err.message });
      });
    }

    const averageRating = ratingResults[0].average_rating || 0;
    const totalReviews = ratingResults[0].total_reviews || 0;

    const updateProviderSql = `
      UPDATE service_providers
      SET rating = ROUND(?, 1)
      WHERE provider_id = ?
    `;
    db.query(updateProviderSql, [averageRating, providerId], (err) => {
      if (err) {
        console.error('💥 Database error:', err);
        return db.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }

      db.commit(err => {
        if (err) {
          console.error('💥 Commit error:', err);
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }
        console.log('✅ Review', reviewAction, 'successfully');
        res.json({
          message: `Review ${reviewAction} successfully`,
          average_rating: parseFloat(averageRating).toFixed(1),
          total_reviews: totalReviews
        });
      });
    });
  });
}

// GET logs of completed/cancelled bookings
router.get("/bookings/:user_id/logs", (req, res) => {
  console.log('🔧 GET /bookings/:user_id/logs - Started');
  const db = req.app.get('db');
  const userId = req.params.user_id;
  console.log('👤 User ID:', userId);

  const sql = `
    SELECT 
      b.booking_id AS id,
      DATE(b.booking_date) AS date,
      b.status,
      b.total_amount,
      s.name AS serviceName,
      u_provider.name AS provider,
      c.address,
      r.rating,
      r.comment AS feedback
    FROM bookings b
      INNER JOIN customers c ON b.customer_id = c.customer_id
      INNER JOIN users u_customer ON c.user_id = u_customer.user_id
      INNER JOIN services s ON b.service_id = s.service_id
      LEFT JOIN service_providers sp ON b.assigned_staff_id = sp.provider_id
      LEFT JOIN users u_provider ON sp.user_id = u_provider.user_id
      LEFT JOIN reviews r ON b.booking_id = r.booking_id
    WHERE u_customer.user_id = ?
      AND b.status IN ('completed', 'cancelled')
    ORDER BY b.booking_date DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('💥 Database error:', err);
      return res.status(500).json({ error: err.message });
    }

    const serviceLogs = (results || []).map(booking => ({
      id: booking.id,
      serviceName: booking.serviceName,
      date: booking.date,
      provider: booking.provider || 'Not assigned',
      amount: booking.total_amount != null ? `₹${booking.total_amount}` : '₹0',
      status: booking.status[0].toUpperCase() + booking.status.slice(1),
      rating: booking.rating,
      feedback: booking.feedback || 'No feedback provided'
    }));

    console.log('📤 Sending response:', serviceLogs);
    res.json(serviceLogs);
  });
});

export default router;
