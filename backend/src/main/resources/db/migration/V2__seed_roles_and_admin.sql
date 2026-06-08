-- Seed ROLE_STUDENT
INSERT INTO roles (name) VALUES ('ROLE_STUDENT');

-- Seed Admin User
-- Password is 'admin123'
INSERT INTO users (username, email, password, enabled, created_by, last_modified_by)
VALUES ('admin', 'admin@javamastery.com', 'admin123', TRUE, 'system', 'system');

-- Associate Admin User with ROLE_ADMIN
INSERT INTO user_roles (user_id, role_id)
VALUES (
    (SELECT id FROM users WHERE username = 'admin'),
    (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')
);

-- Seed Demo Student User
-- Password is 'student123'
INSERT INTO users (username, email, password, enabled, created_by, last_modified_by)
VALUES ('student', 'student@javamastery.com', 'student123', TRUE, 'system', 'system');

-- Associate Demo Student with ROLE_STUDENT
INSERT INTO user_roles (user_id, role_id)
VALUES (
    (SELECT id FROM users WHERE username = 'student'),
    (SELECT id FROM roles WHERE name = 'ROLE_STUDENT')
);
