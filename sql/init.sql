CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_category') THEN
        CREATE TYPE ticket_category AS ENUM ('VIP', 'General Admissions', 'Early Bird');
    END IF;
END
$$;

CREATE table IF NOT exists users  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    dob DATE,
    country VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE table IF NOT exists events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    venue VARCHAR(255) NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE table IF NOT exists ticket_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL,
    category ticket_category NOT NULL,
    max_count INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE table IF NOT exists tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL,
    user_id UUID NOT NULL,
    ticket_category_id UUID NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_category_id) REFERENCES ticket_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT exists access_token (
    token VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL,
    expiry TIMESTAMP,
    invalidated BOOLEAN DEFAULT false NOT NULL,
    user_agent TEXT,
    registration_datetime TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert into users
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, dob, country, is_active)
VALUES 
('tester111@gmail.com', '$2b$04$txZLz6p6u0AQywRffVqzFeoRTZMohbMAfBamNLHzTkOqQj4LcykO6', 'testerone', 'retset', '+66612341234', '2000-01-01', 'MY', TRUE),
('tester333@gmail.com', '$2b$04$01Pzcy7E0./DYhjvB/38Ge3NHwvpa1QKQKrd6Ai7INigOMQcP7YtS', 'testerthree', 'retset', '+66612341236', '2000-01-03', 'AU', TRUE);

-- Insert into events
INSERT INTO events (name, description, start_time, end_time, venue, created_by)
VALUES 
('Concert of the Year', 'A grand music concert featuring top artists.', '2024-09-15 19:00:00', '2024-09-15 23:00:00', 'Madison Square Garden', (SELECT id FROM users WHERE email = 'tester111@gmail.com')),
('Tech Conference 2024', 'Annual conference on emerging tech trends.', '2024-10-05 09:00:00', '2024-10-07 17:00:00', 'Convention Center', (SELECT id FROM users WHERE email = 'tester333@gmail.com'));

-- Insert into ticket_categories
INSERT INTO ticket_categories (event_id, category, max_count, price)
VALUES 
((SELECT id FROM events WHERE name = 'Concert of the Year'), 'VIP', 100, 250.00),
((SELECT id FROM events WHERE name = 'Concert of the Year'), 'General Admissions', 500, 75.00),
((SELECT id FROM events WHERE name = 'Tech Conference 2024'), 'Early Bird', 200, 150.00),
((SELECT id FROM events WHERE name = 'Tech Conference 2024'), 'General Admissions', 300, 100.00);

-- Insert into tickets
INSERT INTO tickets (event_id, user_id, ticket_category_id, price, purchased_at)
VALUES 
((SELECT id FROM events WHERE name = 'Concert of the Year' limit 1), (SELECT id FROM users WHERE email = 'tester333@gmail.com' limit 1), (SELECT id FROM ticket_categories WHERE category = 'VIP' limit 1), 250.00, '2024-08-01 14:30:00'),
((SELECT id FROM events WHERE name = 'Concert of the Year' limit 1), (SELECT id FROM users WHERE email = 'tester333@gmail.com' limit 1), (SELECT id FROM ticket_categories WHERE category = 'General Admissions' limit 1), 75.00, '2024-08-05 16:00:00'),
((SELECT id FROM events WHERE name = 'Tech Conference 2024' limit 1), (SELECT id FROM users WHERE email = 'tester111@gmail.com' limit 1), (SELECT id FROM ticket_categories WHERE category = 'Early Bird' limit 1), 150.00, '2024-08-10 10:00:00');