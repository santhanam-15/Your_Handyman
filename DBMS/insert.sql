use handyservices;
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('Alice Smith', 'alice@example.com', 'hash1', '1234567890', 'customer'),
('Bob Johnson', 'bob@example.com', 'hash2', '0987654321', 'service_provider'),
('Carol Davis', 'carol@example.com', 'hash3', '5555555555', 'admin');
select * from services;
INSERT INTO service_providers (user_id, skills, experience_years, rating) VALUES
(9, 'Electrical, Plumbing', 5, 4.5),
(10, 'Carpentry, Painting', 7, 4.8),
(12, 'Cleaning, Appliance Repair', 3, 4.2);
INSERT INTO customers (user_id, address) VALUES
(1, '123 Apple St, New York, NY'),
(1, '456 Orange Ave, Los Angeles, CA'),
(1, '789 Banana Blvd, Chicago, IL');
INSERT INTO bookings (customer_id, service_id, booking_date, status, total_amount, assigned_staff_id) VALUES
(2, 1, '2024-07-01 10:00:00', 'pending', 250.00, NULL),
(2, 2, '2024-07-02 14:00:00', 'confirmed', 75.00, NULL),
(11, 5, '2024-07-03 09:00:00', 'completed', 150.00, NULL);
INSERT INTO payments (booking_id, amount, status, payment_date) VALUES
(1, 250.00, 'pending', NOW()),
(2, 75.00, 'pending', NOW()),
(3, 150.00, 'pending', NOW());
INSERT INTO services (category, subcategory, name, description, price, status) VALUES
('Electrical', 'Wiring', 'Home Wiring Installation', 'Complete wiring setup for new homes', 250.00, 'Active'),
('Plumbing', 'Leak Repair', 'Leak Fix', 'Fixing leaks in pipes and faucets', 75.00, 'Active'),
('Cleaning', 'Home Deep Clean', 'Deep Home Cleaning', 'Thorough cleaning of entire house', 150.00, 'Active');
select * from provider_skills;
select * from users;
select * from services;
select * from bookings;
select * from customers;
INSERT INTO provider_skills (provider_id, service_id) VALUES
(10, 6);
(9, 2),
(11, 8);