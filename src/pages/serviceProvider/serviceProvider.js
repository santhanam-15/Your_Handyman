// src/pages/serviceProvider/serviceProvider.js
import express from "express";
const router = express.Router();
let pid;
// Add middleware to log all requests
router.use((req, res, next) => {
  console.log(`📥 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('📦 Request body:', req.body);
  console.log('🔍 Request params:', req.params);
  console.log('❓ Request query:', req.query);
  next();
});

// Helper function to get provider_id from user_id
const getProviderId = (db, userId, callback) => {
  const sql = `SELECT provider_id FROM service_providers WHERE user_id = ?`;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      callback(err, null);
    } else if (results.length === 0) {
      callback(new Error("Service provider not found"), null);
    } else {
      pid=results[0].provider_id;
      callback(null, results[0].provider_id);
    }
  });
};

// Service Provider Profile
router.get("/profile/:user_id", (req, res) => {
  console.log('🔧 GET /profile/:user_id - Started');
  const db = req.app.get('db');
  const userId = req.params.user_id;
  
  console.log('👤 User ID:', userId);

  const sql = `
    SELECT u.name, u.email, u.phone, u.created_at,
           sp.provider_id, sp.experience_years, sp.rating,
           (SELECT GROUP_CONCAT(DISTINCT s.category) 
            FROM provider_skills ps 
            JOIN services s ON ps.service_id = s.service_id 
            WHERE ps.provider_id = sp.provider_id) as skills
    FROM users u
    LEFT JOIN service_providers sp ON u.user_id = sp.user_id
    WHERE u.user_id = ?
  `;

  console.log('📊 Executing SQL:', sql);
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('💥 Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('✅ Query results:', results);
    
    if (results.length === 0) {
      console.log('❌ User not found');
      return res.status(404).json({ error: "User not found" });
    }
    
    const user = results[0];
    const response = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      specialty: "Service Provider",
      experience: user.experience_years ? `${user.experience_years} years` : "Not specified",
      rating: user.rating ? `${user.rating}/5` : "Not rated",
      completedJobs: 0,
      ongoingJobs: 0, 
      totalEarnings: "₹0",
      skills: user.skills ? user.skills.split(',') : [],
      address: "Not specified",
      joinDate: new Date(user.created_at).toLocaleDateString(),
      availability: "Available",
      provider_id: user.provider_id
    };
    
    console.log('📤 Sending response:', response);
    res.json(response);
  });
});

// Get Jobs assigned to Service Provider with customer details - FIXED
router.get("/jobs/:user_id", (req, res) => {
  console.log('🔧 GET /jobs/:user_id - Started');
  const db = req.app.get('db');
  const userId = req.params.user_id;
  
  console.log('👤 User ID:', userId);

  // First get the provider_id for this user
  getProviderId(db, userId, (err, providerId) => {
    if (err) {
      console.error('💥 Error getting provider ID:', err);
      return res.status(404).json({ error: "Service provider not found" });
    }

    console.log('🔑 Provider ID:', providerId);

    const sql = `
      SELECT 
        b.booking_id as id,
        s.name as serviceName,
        CONCAT('JB', LPAD(b.booking_id, 6, '0')) as jobId,
        u.name as customer,
        DATE(b.booking_date) as date,
        DATE_FORMAT(b.booking_date, '%h:%i %p') as time,
        CONCAT('₹', b.total_amount) as amount,
        CASE 
          WHEN b.status = 'pending' THEN 'Assigned'
          WHEN b.status = 'confirmed' THEN 'In Progress'
          WHEN b.status = 'completed' THEN 'Completed'
          WHEN b.status = 'cancelled' THEN 'Cancelled'
          ELSE b.status 
        END as status,
        c.address,
        u.phone,
        COALESCE(b.notes, 'No additional notes') as notes,
        u.email as customer_email
      FROM bookings b
      INNER JOIN services s ON b.service_id = s.service_id
      INNER JOIN customers c ON b.customer_id = c.customer_id
      INNER JOIN users u ON c.user_id = u.user_id
      WHERE b.assigned_staff_id = ?
      ORDER BY 
        CASE 
          WHEN b.status = 'pending' THEN 1
          WHEN b.status = 'confirmed' THEN 2
          WHEN b.status = 'completed' THEN 3
          ELSE 4
        END,
        CASE 
          WHEN b.priority = 'high' THEN 1
          WHEN b.priority = 'medium' THEN 2
          WHEN b.priority = 'low' THEN 3
          ELSE 4
        END,
        b.booking_date ASC
    `;

    console.log('📊 Executing SQL:', sql);
    
    db.query(sql, [providerId], (err, results) => {
      if (err) {
        console.error('💥 Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('✅ Query results count:', results.length);
      
      // Transform the data to match the frontend format
      const jobs = results.map(job => ({
        ...job,
        time: `${job.time} - ${job.time}`,
        address: job.address || "Address not specified",
        phone: job.phone || "Phone not available"
      }));

      console.log('📤 Sending jobs:', jobs.length, 'jobs found');
      res.json(jobs);
    });
  });
});

// Start Job (from Assigned to In Progress) - FIXED
router.post("/jobs/:job_id/start", (req, res) => {
  console.log('🔧 POST /jobs/:job_id/start - Started');
  const db = req.app.get('db');
  const jobId = req.params.job_id;
  const { user_id } = req.body;
  
  console.log('📋 Job ID:', jobId);
  console.log('👤 User ID:', user_id);

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // First get the provider_id for this user
  getProviderId(db, user_id, (err, providerId) => {
    if (err) {
      console.error('💥 Error getting provider ID:', err);
      return res.status(404).json({ error: "Service provider not found" });
    }

    const sql = `
      UPDATE bookings 
      SET status = 'confirmed' 
      WHERE booking_id = ? AND assigned_staff_id = ? AND status = 'pending'
    `;

    console.log('📊 Executing SQL:', sql);
    
    db.query(sql, [jobId, providerId], (err, results) => {
      if (err) {
        console.error('💥 Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('✅ Update results:', results);
      
      if (results.affectedRows === 0) {
        console.log('❌ Job not found or cannot be started');
        return res.status(404).json({ error: "Job not found or cannot be started" });
      }

      const response = { 
        message: "Job started successfully",
        jobId: jobId,
        status: "In Progress"
      };
      
      console.log('📤 Sending response:', response);
      res.json(response);
    });
  });
});

// Complete Job (from In Progress to Completed) - FIXED
router.post("/jobs/:job_id/complete", (req, res) => {
  console.log('🔧 POST /jobs/:job_id/complete - Started');
  const db = req.app.get('db');
  const jobId = req.params.job_id;
  const { user_id } = req.body;
  
  console.log('📋 Job ID:', jobId);
  console.log('👤 User ID:', user_id);

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // First get the provider_id for this user
  getProviderId(db, user_id, (err, providerId) => {
    if (err) {
      console.error('💥 Error getting provider ID:', err);
      return res.status(404).json({ error: "Service provider not found" });
    }

    const sql = `
      UPDATE bookings 
      SET status = 'completed' 
      WHERE booking_id = ? AND assigned_staff_id = ? AND status = 'confirmed';
      
    `;

    console.log('📊 Executing SQL:', sql);
    
    db.query(sql, [jobId, providerId], (err, results) => {
      if (err) {
        console.error('💥 Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('✅ Update results:', results);
      
      if (results.affectedRows === 0) {
        console.log('❌ Job not found or cannot be completed');
        return res.status(404).json({ error: "Job not found or cannot be completed" });
      }

      const response = { 
        message: "Job completed successfully",
        jobId: jobId,
        status: "Completed"
      };
      
      console.log('📤 Sending response:', response);
      res.json(response);
    });
  });
});

// Cancel Job - FIXED
router.post("/jobs/:job_id/cancel", (req, res) => {
  console.log('🔧 POST /jobs/:job_id/cancel - Started');
  const db = req.app.get('db');
  const jobId = req.params.job_id;
  const { reason, user_id } = req.body;
  
  console.log('📋 Job ID:', jobId);
  console.log('👤 User ID:', user_id);
  console.log('🗑️ Cancellation reason:', reason);

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // First get the provider_id for this user
  getProviderId(db, user_id, (err, providerId) => {
    if (err) {
      console.error('💥 Error getting provider ID:', err);
      return res.status(404).json({ error: "Service provider not found" });
    }

    const sql = `
      UPDATE bookings 
      SET status = 'cancelled', notes = CONCAT(COALESCE(notes, ''), ' Cancelled by service provider: ', ?)
      WHERE booking_id = ? AND assigned_staff_id = ? AND status IN ('pending', 'confirmed')
    `;

    console.log('📊 Executing SQL:', sql);
    
    db.query(sql, [reason || 'No reason provided', jobId, providerId], (err, results) => {
      if (err) {
        console.error('💥 Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('✅ Update results:', results);
      
      if (results.affectedRows === 0) {
        console.log('❌ Job not found or cannot be cancelled');
        return res.status(404).json({ error: "Job not found or cannot be cancelled" });
      }

      const response = { 
        message: "Job cancelled successfully",
        jobId: jobId,
        status: "Cancelled"
      };
      
      console.log('📤 Sending response:', response);
      res.json(response);
    });
  });
});

// Get Job Details with complete customer information - FIXED
router.get("/jobs/:job_id/details", (req, res) => {
  console.log('🔧 GET /jobs/:job_id/details - Started');
  const db = req.app.get('db');
  const jobId = req.params.job_id;
  const { user_id } = req.query; // Get user_id from query params
  
  console.log('📋 Job ID:', jobId);
  console.log('👤 User ID from query:', user_id);

  const sql = `
    SELECT 
      b.booking_id,
      s.name as service_name,
      s.description as service_description,
      b.booking_date,
      b.total_amount,
      b.status,
      b.notes,
      b.assigned_staff_id,
      u.name as customer_name,
      u.email as customer_email,
      u.phone as customer_phone,
      c.address as customer_address,
      u2.name as assigned_staff_name,
      u2.phone as staff_phone
    FROM bookings b
    INNER JOIN services s ON b.service_id = s.service_id
    INNER JOIN customers c ON b.customer_id = c.customer_id
    INNER JOIN users u ON c.user_id = u.user_id
    LEFT JOIN service_providers sp ON b.assigned_staff_id = sp.provider_id
    LEFT JOIN users u2 ON sp.user_id = u2.user_id
    WHERE b.booking_id = ?
  `;

  console.log('📊 Executing SQL:', sql);
  
  db.query(sql, [jobId], (err, results) => {
    if (err) {
      console.error('💥 Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('✅ Query results:', results);
    
    if (results.length === 0) {
      console.log('❌ Job not found');
      return res.status(404).json({ error: "Job not found" });
    }

    const job = results[0];
    
    // If user_id is provided, verify this job belongs to the service provider
    if (user_id) {
      getProviderId(db, user_id, (err, providerId) => {
        if (err || job.assigned_staff_id !== providerId) {
          console.log('❌ Access denied - job not assigned to this provider');
          return res.status(403).json({ error: "Access denied - job not assigned to you" });
        }
        
        sendJobDetails(res, job);
      });
    } else {
      sendJobDetails(res, job);
    }
  });
});

// Helper function to send job details
const sendJobDetails = (res, job) => {
  const formattedJob = {
    id: job.booking_id,
    serviceName: job.service_name,
    jobId: `JB${String(job.booking_id).padStart(6, '0')}`,
    customer: job.customer_name,
    date: new Date(job.booking_date).toISOString().split('T')[0],
    time: new Date(job.booking_date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    amount: `₹${job.total_amount}`,
    status: job.status === 'pending' ? 'Assigned' : 
            job.status === 'confirmed' ? 'In Progress' : 
            job.status === 'completed' ? 'Completed' : 'Cancelled',
    address: job.customer_address,
    phone: job.customer_phone,
    email: job.customer_email,
    notes: job.notes,
    serviceDescription: job.service_description,
    assignedStaff: job.assigned_staff_name,
    staffPhone: job.staff_phone
  };

  console.log('📤 Sending job details:', formattedJob);
  res.json(formattedJob);
};

// Get Job Statistics for Service Provider - FIXED
router.get("/stats/:user_id", (req, res) => {
  console.log('🔧 GET /stats/:user_id - Started');
  const db = req.app.get('db');
  const userId = req.params.user_id;
  
  console.log('👤 User ID:', userId);

  // First get the provider_id for this user
  getProviderId(db, userId, (err, providerId) => {
    if (err) {
      console.error('💥 Error getting provider ID:', err);
      return res.status(404).json({ error: "Service provider not found" });
    }

    const sql = `
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_jobs,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as assigned_jobs,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as in_progress_jobs,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_jobs,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END), 0) as total_earnings
      FROM bookings 
      WHERE assigned_staff_id = ?
    `;

    console.log('📊 Executing SQL:', sql);
    
    db.query(sql, [providerId], (err, results) => {
      if (err) {
        console.error('💥 Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('✅ Stats results:', results[0]);
      
      const stats = results[0] || {};
      
      const response = {
        totalJobs: stats.total_jobs || 0,
        completedJobs: stats.completed_jobs || 0,
        assignedJobs: stats.assigned_jobs || 0,
        inProgressJobs: stats.in_progress_jobs || 0,
        cancelledJobs: stats.cancelled_jobs || 0,
        totalEarnings: `₹${stats.total_earnings || 0}`
      };
      
      console.log('📤 Sending stats:', response);
      res.json(response);
    });
  });
});

// Get payment information for a job
router.get("/payments/:job_id", (req, res) => {
  console.log('🔧 GET /payments/:job_id - Started');
  const db = req.app.get('db');
  const jobId = req.params.job_id;
  
  console.log('📋 Job ID:', jobId);

  const sql = `
    SELECT 
      p.payment_id,
      p.amount,
      p.status,
      p.payment_method,
      p.transaction_id,
      p.payment_date
    FROM payments p
    WHERE p.booking_id = ?
  `;

  console.log('📊 Executing SQL:', sql);
  
  db.query(sql, [jobId], (err, results) => {
    if (err) {
      console.error('💥 Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('✅ Payment results:', results);
    
    if (results.length === 0) {
      // Return default payment info if no payment record exists
      const defaultPayment = {
        amount: '₹0',
        status: 'pending',
        payment_method: 'Cash',
        transaction_id: null,
        payment_date: null
      };
      return res.json(defaultPayment);
    }

    const payment = results[0];
    const response = {
      amount: `₹${payment.amount}`,
      status: payment.status,
      payment_method: payment.payment_method,
      transaction_id: payment.transaction_id,
      payment_date: payment.payment_date
    };

    console.log('📤 Sending payment info:', response);
    res.json(response);
  });
});

// Complete payment (for cash payments)
router.patch("/payments/:job_id/complete", (req, res) => {
  console.log('🔧 PATCH /payments/:job_id/complete - Started');
  const db = req.app.get('db');
  const jobId = req.params.job_id;
  const { user_id } = req.body;
  
  console.log('📋 Job ID:', jobId);
  console.log('👤 User ID:', user_id);

  const sql = `
    UPDATE payments 
    SET status = 'completed', payment_date = NOW()
    WHERE booking_id = ? AND status = 'pending'
  `;

  console.log('📊 Executing SQL:', sql);
  
  db.query(sql, [jobId], (err, results) => {
    if (err) {
      console.error('💥 Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('✅ Payment update results:', results);
    
    const response = { 
      message: "Payment status updated to completed",
      jobId: jobId
    };
    
    console.log('📤 Sending response:', response);
    res.json(response);
  });
});

// GET provider logs (only completed jobs with reviews)
router.get("/logs/:user_id", (req, res) => {
  console.log('🔧 GET /logs/:user_id - Started');
  console.log('User ID:', req.params.user_id);
  const db = req.app.get('db');
  const userId = req.params.user_id;
  
  console.log('👤 User ID:', userId);

  // First get the provider_id for this user
  getProviderId(db, userId, (err, providerId) => {
    if (err) {
      console.error('💥 Error getting provider ID:', err);
      return res.status(404).json({ error: "Service provider not found" });
    }

    console.log('🔑 Provider ID:', providerId);

    const sql = `
      SELECT 
        b.booking_id as id,
        s.name as serviceName,
        DATE(b.booking_date) as date,
        u.name as customer,
        CONCAT('₹', b.total_amount) as amount,
        'Completed' as status,
        r.rating,
        COALESCE(r.comment, 'No feedback provided') as feedback,
        b.booking_date as completed_date
      FROM bookings b
      INNER JOIN services s ON b.service_id = s.service_id
      INNER JOIN customers c ON b.customer_id = c.customer_id
      INNER JOIN users u ON c.user_id = u.user_id
      LEFT JOIN reviews r ON b.booking_id = r.booking_id
      WHERE b.assigned_staff_id = ?
        AND b.status = 'completed'
      ORDER BY b.booking_date DESC
    `;

    console.log('📊 Executing SQL for logs:', sql);
    
    db.query(sql, [providerId], (err, results) => {
      if (err) {
        console.error('💥 Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('✅ Logs results count:', results.length);
      
      const logs = results.map(log => ({
        id: log.id,
        serviceName: log.serviceName,
        date: log.date,
        customer: log.customer,
        amount: log.amount,
        status: log.status,
        rating: log.rating,
        feedback: log.feedback,
        completedDate: log.completed_date
      }));

      console.log('📤 Sending logs:', logs.length, 'completed jobs found');
      res.json(logs);
    });
  });
});

// Add error handling middleware
router.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({ 
    error: "Internal server error",
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle 404 for service provider routes
router.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: "Service provider route not found",
    path: req.originalUrl,
    method: req.method
  });
});
router.put("/change-password", (req, res) => {
  console.log('🔧 PUT /change-password - Started');
  const db = req.app.get('db');
  const { user_id, currentPassword, newPassword } = req.body;

  if (!user_id || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "user_id, currentPassword and newPassword are required" });
  }
  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ error: "newPassword must be at least 6 characters long" });
  }

  const sql = `SELECT password_hash FROM users WHERE user_id = ? LIMIT 1`;
  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ error: "User not found" });

    const stored = results[0].password_hash || "";
    if (stored !== currentPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const updateSql = `UPDATE users SET password_hash = ? WHERE user_id = ?`;
    db.query(updateSql, [newPassword, user_id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      console.log('✅ Password updated (plain text) for user_id:', user_id);
      return res.json({ message: "Password changed successfully" });
    });
  });
});

// Handle 404 for service provider routes (keep this last)
router.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: "Service provider route not found",
    path: req.originalUrl,
    method: req.method
  });
});
export default router;