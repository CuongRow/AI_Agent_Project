-- Seed ROLE_STUDENT
INSERT INTO roles (name) VALUES ('ROLE_STUDENT');

-- Seed Admin User
-- Password is 'admin123' (BCrypt hash: $2a$10$OoI.UTX3g6Yj8.ujYqd3kufpIiUTMxN5NBje92F23J6bl/5cJTn.G)
INSERT INTO users (username, email, password, enabled, created_by, last_modified_by)
VALUES ('admin', 'admin@javamastery.com', '$2a$10$OoI.UTX3g6Yj8.ujYqd3kufpIiUTMxN5NBje92F23J6bl/5cJTn.G', TRUE, 'system', 'system');

-- Associate Admin User with ROLE_ADMIN
INSERT INTO user_roles (user_id, role_id)
VALUES (
    (SELECT id FROM users WHERE username = 'admin'),
    (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')
);
