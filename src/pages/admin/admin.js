// src/pages/admin/admin.js
import express from "express";
const router = express.Router();

const getEnumValues = async (db, column, table = 'services') => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND COLUMN_NAME = ?`;
    
    db.query(sql, [table, column], (err, results) => {
      if (err) {
        const defaultCategories = ['Electrical','Plumbing','Carpentry','Painting','Cleaning','Appliance','HVAC','Washing'];
        const defaultSubcategories = ['Wiring','Switch & Socket','Lighting','Fan Installation','MCB/DB','Leak Repair','Pipe Install','Tap/Faucet','Clog/Cleaning','Water Heater','Furniture Assembly','Door/Window','Repair','Polish','Interior','Exterior','Touch-up','Home Deep Clean','Kitchen Clean','Bathroom Clean','AC Service','AC Install','Fridge Repair','Washing Machine','HVAC Service','Duct Clean'];
        if (column === 'category') resolve(defaultCategories);
        else if (column === 'subcategory') resolve(defaultSubcategories);
        else resolve([]);
        return;
      }
      
      if (results.length > 0) {
        const enumStr = results[0].COLUMN_TYPE;
        const values = enumStr.replace(/^enum\(|\)$/g, '').split(',').map(val => val.replace(/'/g, '').trim());
        resolve(values);
      } else resolve([]);
    });
  });
};

const formatProfileData = (userData) => ({
  user_id: userData.user_id,
  name: userData.name,
  email: userData.email,
  phone: userData.phone || "Not provided",
  role: userData.role,
  joinDate: new Date(userData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
});

router.get("/profile", (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    db.query(`SELECT user_id, name, email, phone, role, created_at FROM users WHERE role = 'admin' LIMIT 1`, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      
      if (results.length === 0) {
        return res.json({
          user_id: 1, name: "Admin User", email: "admin@handyman.com", phone: "+1 234 567 8900",
          role: "admin", joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        });
      }
      res.json(formatProfileData(results[0]));
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Invalid email format" });

    db.query(`SELECT user_id FROM users WHERE role = 'admin' LIMIT 1`, (getErr, adminResults) => {
      if (getErr) return res.status(500).json({ error: "Database error", details: getErr.message });
      if (adminResults.length === 0) return res.status(404).json({ error: "Admin user not found" });

      const adminUserId = adminResults[0].user_id;
      db.query(`SELECT user_id FROM users WHERE email = ? AND user_id != ?`, [email, adminUserId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error during email validation", details: err.message });
        if (results.length > 0) return res.status(400).json({ error: "Email already exists" });

        db.query(`UPDATE users SET name = ?, email = ?, phone = ? WHERE user_id = ?`, [name, email, phone, adminUserId], (updateErr, updateResults) => {
          if (updateErr) return res.status(500).json({ error: "Failed to update profile", details: updateErr.message });
          if (updateResults.affectedRows === 0) return res.status(404).json({ error: "Admin user not found" });

          db.query(`SELECT user_id, name, email, phone, role, created_at FROM users WHERE user_id = ?`, [adminUserId], (getErr, getResults) => {
            if (getErr) return res.status(500).json({ error: "Profile updated but failed to fetch updated data", details: getErr.message });
            res.json({ message: "Profile updated successfully", profile: formatProfileData(getResults[0]) });
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.put("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    if (!currentPassword || !newPassword || !confirmPassword) return res.status(400).json({ error: "All password fields are required" });
    if (newPassword !== confirmPassword) return res.status(400).json({ error: "New passwords do not match" });
    if (newPassword.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters long" });

    db.query(`SELECT user_id, password_hash FROM users WHERE role = 'admin' LIMIT 1`, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      if (results.length === 0) return res.status(404).json({ error: "Admin user not found" });

      const adminUserId = results[0].user_id;
      const currentStoredPassword = results[0].password_hash;
      if (currentPassword !== currentStoredPassword) return res.status(400).json({ error: "Current password is incorrect" });

      db.query(`UPDATE users SET password_hash = ? WHERE user_id = ?`, [newPassword, adminUserId], (updateErr, updateResults) => {
        if (updateErr) return res.status(500).json({ error: "Failed to update password", details: updateErr.message });
        if (updateResults.affectedRows === 0) return res.status(404).json({ error: "Admin user not found" });
        res.json({ message: "Password updated successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/services", (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    db.query(`SELECT service_id, name, category, subcategory, price, description, created_at, status FROM services ORDER BY created_at DESC`, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.delete("/services/:id", (req, res) => {
  try {
    const serviceId = req.params.id;
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    db.query(`DELETE FROM services WHERE service_id = ?`, [serviceId], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      if (results.affectedRows === 0) return res.status(404).json({ error: "Service not found" });
      res.json({ message: "Service deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/service-categories", async (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const [categories, subcategories, mappingResults] = await Promise.all([
      getEnumValues(db, 'category'),
      getEnumValues(db, 'subcategory'),
      new Promise((resolve) => {
        db.query(`SELECT DISTINCT category, subcategory FROM services ORDER BY category, subcategory`, (err, results) => {
          resolve(err ? [] : results);
        });
      })
    ]);

    const categoryMapping = {};
    mappingResults.forEach(row => {
      if (!categoryMapping[row.category]) categoryMapping[row.category] = [];
      if (row.subcategory && !categoryMapping[row.category].includes(row.subcategory)) categoryMapping[row.category].push(row.subcategory);
    });

    res.json({ categories, subcategories, categoryMapping });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

const validateAndAddEnum = async (db, column, newValue, table = 'services') => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentValues = await getEnumValues(db, column, table);
      
      if (currentValues.includes(newValue)) {
        resolve({ success: true, message: `${column} already exists`, exists: true });
        return;
      }
      
      if (!newValue || newValue.trim().length === 0) {
        reject(new Error(`${column} cannot be empty`));
        return;
      }
      
      if (newValue.length > 50) {
        reject(new Error(`${column} must be less than 50 characters`));
        return;
      }
      
      const newEnumValues = [...currentValues, newValue].map(val => `'${val}'`).join(',');
      const alterSql = `ALTER TABLE ${table} MODIFY ${column} ENUM(${newEnumValues})`;
      
      db.query(alterSql, (err) => {
        if (err) {
          reject(new Error(`Failed to add ${column}: ${err.message}`));
        } else {
          resolve({ 
            success: true, 
            message: `${column} added successfully`,
            exists: false,
            newValue: newValue
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

router.post("/services/validate-category", async (req, res) => {
  try {
    const { category, subcategory, isNewCategory = false, isNewSubcategory = false } = req.body;
    const db = req.app.get('db');
    
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const validationResults = {
      category: { isValid: true, message: '', requiresApproval: false },
      subcategory: { isValid: true, message: '', requiresApproval: false }
    };

    if (isNewCategory) {
      if (!category || category.trim().length === 0) {
        validationResults.category.isValid = false;
        validationResults.category.message = "Category name is required";
      } else if (category.length > 50) {
        validationResults.category.isValid = false;
        validationResults.category.message = "Category must be less than 50 characters";
      } else {
        const currentCategories = await getEnumValues(db, 'category');
        if (currentCategories.includes(category)) {
          validationResults.category.isValid = false;
          validationResults.category.message = "Category already exists";
        } else {
          validationResults.category.requiresApproval = true;
          validationResults.category.message = "New category will be added to the system";
        }
      }
    } else {
      if (!category) {
        validationResults.category.isValid = false;
        validationResults.category.message = "Please select a category";
      } else {
        const currentCategories = await getEnumValues(db, 'category');
        if (!currentCategories.includes(category)) {
          validationResults.category.isValid = false;
          validationResults.category.message = "Invalid category selected";
        }
      }
    }

    if (isNewSubcategory) {
      if (!subcategory || subcategory.trim().length === 0) {
        validationResults.subcategory.isValid = false;
        validationResults.subcategory.message = "Subcategory name is required";
      } else if (subcategory.length > 50) {
        validationResults.subcategory.isValid = false;
        validationResults.subcategory.message = "Subcategory must be less than 50 characters";
      } else {
        const currentSubcategories = await getEnumValues(db, 'subcategory');
        if (currentSubcategories.includes(subcategory)) {
          validationResults.subcategory.isValid = false;
          validationResults.subcategory.message = "Subcategory already exists";
        } else {
          validationResults.subcategory.requiresApproval = true;
          validationResults.subcategory.message = "New subcategory will be added to the system";
        }
      }
    } else {
      if (!subcategory) {
        validationResults.subcategory.isValid = false;
        validationResults.subcategory.message = "Please select a subcategory";
      } else {
        const currentSubcategories = await getEnumValues(db, 'subcategory');
        if (!currentSubcategories.includes(subcategory)) {
          validationResults.subcategory.isValid = false;
          validationResults.subcategory.message = "Invalid subcategory selected";
        }
      }
    }

    res.json(validationResults);
  } catch (error) {
    res.status(500).json({ error: "Validation error", details: error.message });
  }
});

router.post("/services", async (req, res) => {
  try {
    const { 
      name, 
      category, 
      subcategory, 
      price, 
      description, 
      isNewCategory = false, 
      isNewSubcategory = false,
      confirmNewCategory = false,
      confirmNewSubcategory = false
    } = req.body;
    
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    if (!name || !category || !subcategory || !price) {
      return res.status(400).json({ error: "Name, category, subcategory, and price are required" });
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ error: "Price must be a valid positive number" });
    }

    let finalCategory = category;
    let finalSubcategory = subcategory;

    if (isNewCategory) {
      if (!confirmNewCategory) {
        return res.status(400).json({ 
          error: "Category creation not confirmed",
          requiresConfirmation: true,
          field: 'category'
        });
      }
      
      try {
        await validateAndAddEnum(db, 'category', category);
        finalCategory = category;
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    if (isNewSubcategory) {
      if (!confirmNewSubcategory) {
        return res.status(400).json({ 
          error: "Subcategory creation not confirmed",
          requiresConfirmation: true,
          field: 'subcategory'
        });
      }
      
      try {
        await validateAndAddEnum(db, 'subcategory', subcategory);
        finalSubcategory = subcategory;
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    const [currentCategories, currentSubcategories] = await Promise.all([
      getEnumValues(db, 'category'),
      getEnumValues(db, 'subcategory')
    ]);

    if (!currentCategories.includes(finalCategory)) {
      return res.status(400).json({ 
        error: "Invalid category", 
        validCategories: currentCategories 
      });
    }

    if (!currentSubcategories.includes(finalSubcategory)) {
      return res.status(400).json({ 
        error: "Invalid subcategory", 
        validSubcategories: currentSubcategories 
      });
    }

    db.query(
      `INSERT INTO services (name, category, subcategory, price, description, status) VALUES (?, ?, ?, ?, ?, 'Active')`, 
      [name, finalCategory, finalSubcategory, price, description], 
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Failed to create service", details: err.message });
        }
        
        db.query(`SELECT * FROM services WHERE service_id = ?`, [results.insertId], (getErr, getResults) => {
          if (getErr) {
            return res.status(500).json({ 
              error: "Service created but failed to fetch data", 
              details: getErr.message 
            });
          }
          
          res.status(201).json({ 
            message: "Service created successfully", 
            service: getResults[0],
            newCategoryAdded: isNewCategory,
            newSubcategoryAdded: isNewSubcategory
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.put("/services/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { name, category, subcategory, price, description, status, isNewCategory = false, isNewSubcategory = false } = req.body;
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    if (!name || !category || !subcategory || !price) return res.status(400).json({ error: "Name, category, subcategory, and price are required" });
    if (isNaN(price) || parseFloat(price) <= 0) return res.status(400).json({ error: "Price must be a valid positive number" });

    let finalCategory = category, finalSubcategory = subcategory;
    
    if (isNewCategory) {
      try {
        await validateAndAddEnum(db, 'category', category);
        finalCategory = category;
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
    
    if (isNewSubcategory) {
      try {
        await validateAndAddEnum(db, 'subcategory', subcategory);
        finalSubcategory = subcategory;
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    const [currentCategories, currentSubcategories] = await Promise.all([
      getEnumValues(db, 'category'),
      getEnumValues(db, 'subcategory')
    ]);

    if (!currentCategories.includes(finalCategory)) {
      return res.status(400).json({ error: "Invalid category", validCategories: currentCategories });
    }
    if (!currentSubcategories.includes(finalSubcategory)) {
      return res.status(400).json({ error: "Invalid subcategory", validSubcategories: currentSubcategories });
    }

    db.query(`UPDATE services SET name = ?, category = ?, subcategory = ?, price = ?, description = ?, status = ? WHERE service_id = ?`,
      [name, finalCategory, finalSubcategory, price, description, status, serviceId], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      if (results.affectedRows === 0) return res.status(404).json({ error: "Service not found" });

      db.query(`SELECT * FROM services WHERE service_id = ?`, [serviceId], (getErr, getResults) => {
        if (getErr) return res.status(500).json({ error: "Service updated but failed to fetch updated data", details: getErr.message });
        res.json({ message: "Service updated successfully", service: getResults[0] });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/subcategories/:category", (req, res) => {
  try {
    const db = req.app.get('db');
    const category = req.params.category;
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    db.query("SELECT DISTINCT subcategory FROM services WHERE category = ? ORDER BY subcategory", [category], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      res.json({ subcategories: results.map(r => r.subcategory) });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Staff Management Routes
router.get("/staff", (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const sql = `
      SELECT 
        u.user_id, u.name, u.email, u.phone, u.role, u.created_at,
        sp.provider_id, sp.experience_years, sp.rating,
        (SELECT GROUP_CONCAT(DISTINCT s.category) 
         FROM provider_skills ps 
         JOIN services s ON ps.service_id = s.service_id 
         WHERE ps.provider_id = sp.provider_id) as skills,
        CASE WHEN sp.provider_id IS NOT NULL THEN 'Active' ELSE 'Inactive' END as status
      FROM users u
      LEFT JOIN service_providers sp ON u.user_id = sp.user_id
      WHERE u.role = 'service_provider'
      ORDER BY u.created_at DESC
    `;
    
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      
      const staffWithSkills = results.map(staff => ({
        ...staff,
        skills: staff.skills ? staff.skills.split(',') : []
      }));
      
      res.json(staffWithSkills);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.post("/staff", async (req, res) => {
  try {
    const { name, email, password, phone, selectedSkills, experience_years, rating, status } = req.body;
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });

    db.beginTransaction(async (err) => {
      if (err) return res.status(500).json({ error: "Transaction error", details: err.message });

      try {
        const userSql = `INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, 'service_provider')`;
        db.query(userSql, [name, email, password, phone], (userErr, userResults) => {
          if (userErr) {
            return db.rollback(() => {
              if (userErr.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ error: "Email already exists" });
              } else {
                res.status(500).json({ error: "Failed to create user", details: userErr.message });
              }
            });
          }

          const userId = userResults.insertId;

          const providerSql = `INSERT INTO service_providers (user_id, experience_years, rating) VALUES (?, ?, ?)`;
          db.query(providerSql, [userId, experience_years, rating], (providerErr, providerResults) => {
            if (providerErr) {
              return db.rollback(() => {
                res.status(500).json({ error: "Failed to create service provider", details: providerErr.message });
              });
            }

            const providerId = providerResults.insertId;

            if (selectedSkills && selectedSkills.length > 0) {
              const getServiceIdsSql = `SELECT service_id FROM services WHERE category IN (?)`;
              db.query(getServiceIdsSql, [selectedSkills], (serviceErr, serviceResults) => {
                if (serviceErr) {
                  return db.rollback(() => {
                    res.status(500).json({ error: "Failed to get service IDs", details: serviceErr.message });
                  });
                }

                if (serviceResults.length > 0) {
                  const skillValues = serviceResults.map(service => [providerId, service.service_id]);
                  const insertSkillsSql = `INSERT INTO provider_skills (provider_id, service_id) VALUES ?`;
                  
                  db.query(insertSkillsSql, [skillValues], (skillsErr) => {
                    if (skillsErr) {
                      return db.rollback(() => {
                        res.status(500).json({ error: "Failed to add skills", details: skillsErr.message });
                      });
                    }

                    commitTransaction(db, userId, res);
                  });
                } else {
                  commitTransaction(db, userId, res);
                }
              });
            } else {
              commitTransaction(db, userId, res);
            }
          });
        });
      } catch (error) {
        db.rollback(() => {
          res.status(500).json({ error: "Server error", details: error.message });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.put("/staff/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, selectedSkills, experience_years, rating, status } = req.body;
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

    db.beginTransaction(async (err) => {
      if (err) return res.status(500).json({ error: "Transaction error", details: err.message });

      try {
        const updateUserSql = `UPDATE users SET name = ?, email = ?, phone = ? WHERE user_id = ?`;
        db.query(updateUserSql, [name, email, phone, userId], (userErr, userResults) => {
          if (userErr) {
            return db.rollback(() => {
              if (userErr.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ error: "Email already exists" });
              } else {
                res.status(500).json({ error: "Failed to update user", details: userErr.message });
              }
            });
          }
          if (userResults.affectedRows === 0) return res.status(404).json({ error: "User not found" });

          const updateProviderSql = `UPDATE service_providers SET experience_years = ?, rating = ? WHERE user_id = ?`;
          db.query(updateProviderSql, [experience_years, rating, userId], (updateErr, updateResults) => {
            if (updateErr) return res.status(500).json({ error: "Failed to update service provider", details: updateErr.message });

            const getProviderIdSql = `SELECT provider_id FROM service_providers WHERE user_id = ?`;
            db.query(getProviderIdSql, [userId], (providerErr, providerResults) => {
              if (providerErr) return res.status(500).json({ error: "Failed to get provider ID", details: providerErr.message });
              
              if (providerResults.length === 0) {
                return db.rollback(() => {
                  res.status(404).json({ error: "Service provider not found" });
                });
              }

              const providerId = providerResults[0].provider_id;

              const deleteSkillsSql = `DELETE FROM provider_skills WHERE provider_id = ?`;
              db.query(deleteSkillsSql, [providerId], (deleteErr) => {
                if (deleteErr) return res.status(500).json({ error: "Failed to delete existing skills", details: deleteErr.message });

                if (selectedSkills && selectedSkills.length > 0) {
                  const getServiceIdsSql = `SELECT service_id FROM services WHERE category IN (?)`;
                  db.query(getServiceIdsSql, [selectedSkills], (serviceErr, serviceResults) => {
                    if (serviceErr) {
                      return db.rollback(() => {
                        res.status(500).json({ error: "Failed to get service IDs", details: serviceErr.message });
                      });
                    }

                    if (serviceResults.length > 0) {
                      const skillValues = serviceResults.map(service => [providerId, service.service_id]);
                      const insertSkillsSql = `INSERT INTO provider_skills (provider_id, service_id) VALUES ?`;
                      
                      db.query(insertSkillsSql, [skillValues], (skillsErr) => {
                        if (skillsErr) {
                          return db.rollback(() => {
                            res.status(500).json({ error: "Failed to add skills", details: skillsErr.message });
                          });
                        }

                        commitTransaction(db, userId, res);
                      });
                    } else {
                      commitTransaction(db, userId, res);
                    }
                  });
                } else {
                  commitTransaction(db, userId, res);
                }
              });
            });
          });
        });
      } catch (error) {
        db.rollback(() => {
          res.status(500).json({ error: "Server error", details: error.message });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

const commitTransaction = (db, userId, res) => {
  db.commit((commitErr) => {
    if (commitErr) {
      return db.rollback(() => {
        res.status(500).json({ error: "Commit error", details: commitErr.message });
      });
    }

    const getStaffSql = `
      SELECT 
        u.user_id, u.name, u.email, u.phone, u.role, u.created_at,
        sp.provider_id, sp.experience_years, sp.rating,
        (SELECT GROUP_CONCAT(DISTINCT s.category) 
         FROM provider_skills ps 
         JOIN services s ON ps.service_id = s.service_id 
         WHERE ps.provider_id = sp.provider_id) as skills,
        CASE WHEN sp.provider_id IS NOT NULL THEN 'Active' ELSE 'Inactive' END as status
      FROM users u
      LEFT JOIN service_providers sp ON u.user_id = sp.user_id
      WHERE u.user_id = ?
    `;
    
    db.query(getStaffSql, [userId], (getErr, getResults) => {
      if (getErr) {
        console.error("Fetch staff error:", getErr);
        return res.status(500).json({ error: "Staff updated but failed to fetch data", details: getErr.message });
      }

      const staffWithSkills = {
        ...getResults[0],
        skills: getResults[0].skills ? getResults[0].skills.split(',') : []
      };

      res.json({
        message: "Staff updated successfully",
        staff: staffWithSkills
      });
    });
  });
};

router.delete("/staff/:id", (req, res) => {
  try {
    const userId = req.params.id;
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const sql = `DELETE FROM users WHERE user_id = ? AND role = 'service_provider'`;
    
    db.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      if (results.affectedRows === 0) return res.status(404).json({ error: "Staff member not found" });
      
      res.json({ message: "Staff member deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.patch("/staff/:id/status", async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    const db = req.app.get('db');
    
    if (!db) return res.status(500).json({ error: "Database connection not available" });
    if (!status) return res.status(400).json({ error: "Status is required" });

    const getProviderSql = `SELECT provider_id FROM service_providers WHERE user_id = ?`;
    
    db.query(getProviderSql, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      
      if (results.length === 0 && status === "Active") {
        const insertSql = `INSERT INTO service_providers (user_id, experience_years, rating) VALUES (?, 0, 0)`;
        db.query(insertSql, [userId], (insertErr, insertResults) => {
          if (insertErr) return res.status(500).json({ error: "Failed to activate staff", details: insertErr.message });
          
          res.json({ 
            message: "Staff activated successfully",
            status: "Active"
          });
        });
      } else if (results.length > 0 && status === "Inactive") {
        const deleteSql = `DELETE FROM service_providers WHERE user_id = ?`;
        db.query(deleteSql, [userId], (deleteErr, deleteResults) => {
          if (deleteErr) return res.status(500).json({ error: "Failed to deactivate staff", details: deleteErr.message });
          
          res.json({ 
            message: "Staff deactivated successfully",
            status: "Inactive"
          });
        });
      } else {
        res.json({ 
          message: `Staff is already ${status}`,
          status: status
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Bookings Routes
router.get("/bookings", (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const sql = `
      SELECT 
        b.booking_id,
        b.customer_id,
        b.service_id,
        b.booking_date,
        b.status,
        b.total_amount,
        b.created_at,
        u_customer.name as customer_name,
        u_customer.phone as customer_phone,
        s.name as service_name,
        s.category as service_category,
        s.price as service_price,
        sp.provider_id as assigned_staff_id,
        u_staff.name as assigned_staff_name
      FROM bookings b
      LEFT JOIN customers cus ON b.customer_id = cus.customer_id
      LEFT JOIN users u_customer ON cus.user_id = u_customer.user_id
      LEFT JOIN services s ON b.service_id = s.service_id
      LEFT JOIN service_providers sp ON b.assigned_staff_id = sp.provider_id
      LEFT JOIN users u_staff ON sp.user_id = u_staff.user_id
      ORDER BY b.created_at DESC
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ 
          error: "Database error", 
          details: err.message,
          sqlError: err.sqlMessage,
          errorCode: err.code
        });
      }
      
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Server error", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.patch("/bookings/:id/status", (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    const db = req.app.get('db');
    
    if (!db) return res.status(500).json({ error: "Database connection not available" });
    if (!status) return res.status(400).json({ error: "Status is required" });

    const sql = `UPDATE bookings SET status = ? WHERE booking_id = ?`;
    
    db.query(sql, [status, bookingId], (err, results) => {
      if (err) {
        return res.status(500).json({ 
          error: "Database error", 
          details: err.message,
          sqlError: err.sqlMessage
        });
      }
      
      if (results.affectedRows === 0) return res.status(404).json({ error: "Booking not found" });
      
      res.json({ 
        message: "Booking status updated successfully",
        status: status
      });
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Server error", 
      details: error.message
    });
  }
});

router.patch("/bookings/:id/assign-staff", (req, res) => {
  try {
    const bookingId = req.params.id;
    const { staffId } = req.body; // This is user_id from frontend
    const db = req.app.get('db');
    
    if (!db) return res.status(500).json({ error: "Database connection not available" });
    if (!staffId) return res.status(400).json({ error: "Staff ID is required" });

    // First, get the service category for this booking to find qualified staff
    const getServiceSql = `
      SELECT s.category, s.service_id
      FROM bookings b 
      JOIN services s ON b.service_id = s.service_id 
      WHERE b.booking_id = ?
    `;
    
    db.query(getServiceSql, [bookingId], (serviceErr, serviceResults) => {
      if (serviceErr) {
        return res.status(500).json({ 
          error: "Database error", 
          details: serviceErr.message
        });
      }
      
      if (serviceResults.length === 0) {
        return res.status(404).json({ error: "Booking or service not found" });
      }
      
      const serviceCategory = serviceResults[0].category;
      const serviceId = serviceResults[0].service_id;
      
      // Get the provider_id for this user_id and verify skills
      const getProviderSql = `
        SELECT sp.provider_id 
        FROM service_providers sp
        JOIN provider_skills ps ON sp.provider_id = ps.provider_id
        JOIN services s ON ps.service_id = s.service_id
        WHERE sp.user_id = ? AND s.service_id = ?
      `;
      
      db.query(getProviderSql, [staffId, serviceId], (providerErr, providerResults) => {
        if (providerErr) {
          return res.status(500).json({ 
            error: "Database error", 
            details: providerErr.message
          });
        }
        
        if (providerResults.length === 0) {
          return res.status(400).json({ 
            error: "This staff member doesn't have skills for this service",
            serviceCategory: serviceCategory
          });
        }
        
        const providerId = providerResults[0].provider_id;
        
        // Update the booking with the provider_id (correct foreign key)
        const updateSql = `UPDATE bookings SET assigned_staff_id = ?, status = 'confirmed' WHERE booking_id = ?`;
        
        db.query(updateSql, [providerId, bookingId], (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ 
              error: "Database error", 
              details: updateErr.message,
              sqlError: updateErr.sqlMessage
            });
          }
          
          if (updateResults.affectedRows === 0) return res.status(404).json({ error: "Booking not found" });
          
          res.json({ 
            message: "Staff assigned successfully",
            assigned_staff_id: providerId
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Server error", 
      details: error.message
    });
  }
});
// Add this route to admin.js
router.get("/qualified-staff/:serviceId", (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const db = req.app.get('db');
    
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const sql = `
      SELECT 
        u.user_id, u.name, u.email, u.phone,
        sp.provider_id, sp.experience_years, sp.rating,
        s.category
      FROM users u
      JOIN service_providers sp ON u.user_id = sp.user_id
      JOIN provider_skills ps ON sp.provider_id = ps.provider_id
      JOIN services s ON ps.service_id = s.service_id
      WHERE s.service_id = ?
      ORDER BY sp.rating DESC, sp.experience_years DESC
    `;
    
    db.query(sql, [serviceId], (err, results) => {
      if (err) {
        return res.status(500).json({ 
          error: "Database error", 
          details: err.message
        });
      }
      
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Server error", 
      details: error.message
    });
  }
});
// Payment Management Routes
router.get("/payments", (req, res) => {
  try {
    const db = req.app.get('db');
    
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const sql = `
      SELECT 
        p.payment_id,
        p.booking_id,
        p.amount,
        p.status as payment_status,
        p.payment_date,
        p.transaction_id,
        p.payment_method,
        b.customer_id,
        u_customer.name as customer_name,
        u_customer.phone as customer_phone,
        s.name as service_name,
        s.category as service_category,
        b.booking_date,
        b.status as booking_status,
        b.total_amount,
        sp.provider_id as assigned_staff_id,
        u_staff.name as assigned_staff_name
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.booking_id
      LEFT JOIN customers cus ON b.customer_id = cus.customer_id
      LEFT JOIN users u_customer ON cus.user_id = u_customer.user_id
      LEFT JOIN services s ON b.service_id = s.service_id
      LEFT JOIN service_providers sp ON b.assigned_staff_id = sp.provider_id
      LEFT JOIN users u_staff ON sp.user_id = u_staff.user_id
      ORDER BY 
        CASE 
          WHEN p.status = 'pending' THEN 1
          WHEN p.status = 'completed' THEN 2
          ELSE 3
        END,
        p.payment_date DESC
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ 
          error: "Database error", 
          details: err.message,
          sqlError: err.sqlMessage,
          errorCode: err.code
        });
      }
      
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Server error", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.get("/payment-stats", (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const sql = `
      SELECT 
        COUNT(*) as total_payments,
        SUM(amount) as total_revenue,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_payments,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
        AVG(amount) as average_payment
      FROM payments
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ 
          error: "Database error", 
          details: err.message
        });
      }
      
      const stats = results[0] || {};
      
      res.json({
        total: stats.total_revenue || 0,
        completed: stats.completed_payments || 0,
        pending: stats.pending_payments || 0,
        failed: stats.failed_payments || 0,
        average: stats.average_payment || 0,
        totalCount: stats.total_payments || 0
      });
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Server error", 
      details: error.message
    });
  }
});

router.patch("/payments/:id/status", (req, res) => {
  try {
    const paymentId = req.params.id;
    const { status } = req.body;
    const db = req.app.get('db');
    
    if (!db) return res.status(500).json({ error: "Database connection not available" });
    if (!status) return res.status(400).json({ error: "Status is required" });

    const validStatuses = ['pending', 'completed', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status", 
        validStatuses: validStatuses 
      });
    }

    const sql = `UPDATE payments SET status = ? WHERE payment_id = ?`;
    
    db.query(sql, [status, paymentId], (err, results) => {
      if (err) {
        return res.status(500).json({ 
          error: "Database error", 
          details: err.message,
          sqlError: err.sqlMessage
        });
      }
      
      if (results.affectedRows === 0) return res.status(404).json({ error: "Payment not found" });
      
      res.json({ 
        message: "Payment status updated successfully",
        status: status
      });
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Server error", 
      details: error.message
    });
  }
});

// Customer Management Routes
router.get("/customers", (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const sql = `
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.phone,
        u.role,
        u.created_at,
        c.customer_id,
        c.address
      FROM users u
      LEFT JOIN customers c ON u.user_id = c.user_id
      WHERE u.role = 'customer'
      ORDER BY u.created_at DESC
    `;
    
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/customers/:id/bookings", (req, res) => {
  try {
    const userId = req.params.id;
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const sql = `
      SELECT 
        b.booking_id,
        b.booking_date,
        b.status,
        b.total_amount,
        b.created_at,
        s.name as service_name,
        s.category as service_category,
        s.price as service_price
      FROM bookings b
      JOIN services s ON b.service_id = s.service_id
      JOIN customers c ON b.customer_id = c.customer_id
      WHERE c.user_id = ?
      ORDER BY b.created_at DESC
    `;
    
    db.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.delete("/customers/:id", (req, res) => {
  try {
    const userId = req.params.id;
    const db = req.app.get('db');
    if (!db) return res.status(500).json({ error: "Database connection not available" });

    const sql = `DELETE FROM users WHERE user_id = ? AND role = 'customer'`;
    
    db.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error", details: err.message });
      if (results.affectedRows === 0) return res.status(404).json({ error: "Customer not found" });
      
      res.json({ message: "Customer deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

export default router;