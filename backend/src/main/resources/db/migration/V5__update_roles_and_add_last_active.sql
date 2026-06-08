-- Remove ROLE_USER from roles and user_roles associations
DELETE FROM user_roles WHERE role_id = (SELECT id FROM roles WHERE name = 'ROLE_USER');
DELETE FROM roles WHERE name = 'ROLE_USER';

-- Insert new roles
INSERT INTO roles (name) VALUES ('ROLE_INSTRUCTOR');

-- Add columns to users table
ALTER TABLE users ADD COLUMN last_active_at DATETIME NULL;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) NULL;

-- Seed demo instructor user
-- Password is 'instructor123'
INSERT INTO users (username, email, password, enabled, created_by, last_modified_by) VALUES ('instructor', 'instructor@javamastery.com', 'instructor123', TRUE, 'system', 'system');

-- Associate instructor with ROLE_INSTRUCTOR
INSERT INTO user_roles (user_id, role_id)
VALUES (
    (SELECT id FROM users WHERE username = 'instructor'),
    (SELECT id FROM roles WHERE name = 'ROLE_INSTRUCTOR')
);

-- Update default student last_active_at to 20 days ago for testing inactivity reminders
UPDATE users SET last_active_at = DATE_SUB(NOW(), INTERVAL 20 DAY) WHERE username = 'student';
