import express from "express";
import mysql from "mysql2";
import cors from "cors";
import adminRoutes from "./pages/admin/admin.js";
import customerRoutes from "./pages/customer/customer.js";
import serviceProviderRoutes from "./pages/serviceProvider/serviceProvider.js";
import superAdminRoutes from "./pages/superadmin/superadmin.js"; 
const app = express();

app.use(cors());
app.use(express.json());

// Mount role-based routes
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/provider", serviceProviderRoutes);
app.use("/api/superadmin", superAdminRoutes ); 
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "santhanam",
  database: "handyservices"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// ADD THIS LINE to make db available in all routes via req.app.get('db')
app.set('db', db);

// 1. Get all unique categories
app.get("/api/categories", (req, res) => {
  const sql = "SELECT DISTINCT category FROM services where status = 'Active'";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.map((r) => r.category));
  });
});

// 2. Get all services in a given category
app.get("/api/services/:category", (req, res) => {
  const { category } = req.params;
  const sql = "SELECT * FROM services WHERE category = ?";
  db.query(sql, [category], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Register user (store plain password in password_hash column)
app.post("/api/register", (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  const userSql = `
    INSERT INTO users (name, email, password_hash, phone, role)
    VALUES (?, ?, ?, ?, 'customer')
  `;
  db.query(userSql, [name, email, password, phone], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Email already registered" });
      }
      return res.status(500).json({ error: err.message });
    }

    const user_id = result.insertId;
    const custSql = `
      INSERT INTO customers (user_id, address)
      VALUES (?, ?)
    `;
    db.query(custSql, [user_id, address], (err2) => {
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }
      res.status(201).json({ message: "Registration successful" });
    });
  });
});

// Login user (compare with password_hash column)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const sql = "SELECT user_id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });

    const user = results[0];
    // Compare with the password_hash column (storing plain password)
    if (password !== user.password_hash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    console.log(user.password_hash);
    console.log(password);
    res.json({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      num :user.phone,
    });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});