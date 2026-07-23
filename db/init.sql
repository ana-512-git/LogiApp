-- users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'staff'
);

-- Insert an initial test user
INSERT INTO users (email, password_hash, role)
VALUES ('admin@test.com', 'pass123', 'admin');