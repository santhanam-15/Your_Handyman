use handyservices;
select * from users;
desc bookings;
ALTER TABLE bookings ADD COLUMN priority ENUM('low', 'medium', 'high') DEFAULT 'medium';