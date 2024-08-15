-- Insert into users
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, dob, country, is_active)
VALUES 
('john.doe@example.com', 'hashedpassword1', 'John', 'Doe', '+1234567890', '1985-06-15', 'USA', TRUE),
('jane.smith@example.com', 'hashedpassword2', 'Jane', 'Smith', '+0987654321', '1990-12-05', 'Canada', TRUE),
('alice.johnson@example.com', 'hashedpassword3', 'Alice', 'Johnson', '+1122334455', '1988-03-22', 'UK', TRUE);

-- Insert into events
INSERT INTO events (name, description, start_time, end_time, venue, created_by)
VALUES 
('Concert of the Year', 'A grand music concert featuring top artists.', '2024-09-15 19:00:00', '2024-09-15 23:00:00', 'Madison Square Garden', (SELECT id FROM users WHERE email = 'john.doe@example.com')),
('Tech Conference 2024', 'Annual conference on emerging tech trends.', '2024-10-05 09:00:00', '2024-10-07 17:00:00', 'Convention Center', (SELECT id FROM users WHERE email = 'jane.smith@example.com'));

-- Insert into ticket_categories
INSERT INTO ticket_categories (event_id, category, max_count, price)
VALUES 
((SELECT id FROM events WHERE name = 'Concert of the Year'), 'VIP', 100, 250.00),
((SELECT id FROM events WHERE name = 'Concert of the Year'), 'General Admissions', 500, 75.00),
((SELECT id FROM events WHERE name = 'Tech Conference 2024'), 'Early Bird', 200, 150.00),
((SELECT id FROM events WHERE name = 'Tech Conference 2024'), 'General Admission', 300, 100.00);

-- Insert into tickets
INSERT INTO tickets (event_id, user_id, ticket_category_id, price, purchased_at)
VALUES 
((SELECT id FROM events WHERE name = 'Concert of the Year'), (SELECT id FROM users WHERE email = 'john.doe@example.com'), (SELECT id FROM ticket_categories WHERE category = 'VIP'), 250.00, '2024-08-01 14:30:00'),
((SELECT id FROM events WHERE name = 'Concert of the Year'), (SELECT id FROM users WHERE email = 'jane.smith@example.com'), (SELECT id FROM ticket_categories WHERE category = 'General Admissions'), 75.00, '2024-08-05 16:00:00'),
((SELECT id FROM events WHERE name = 'Tech Conference 2024'), (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), (SELECT id FROM ticket_categories WHERE category = 'Early Bird'), 150.00, '2024-08-10 10:00:00');

-- Insert into access_token
INSERT INTO access_token (token, user_id, expiry, invalidated, user_agent, registration_datetime)
VALUES 
('token1', (SELECT id FROM users WHERE email = 'john.doe@example.com'), '2024-09-01 00:00:00', FALSE, 'Mozilla/5.0', '2024-07-01 12:00:00'),
('token2', (SELECT id FROM users WHERE email = 'jane.smith@example.com'), '2024-09-01 00:00:00', FALSE, 'Chrome/91.0', '2024-07-05 12:00:00');
