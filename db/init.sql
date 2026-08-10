-- users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'staff'
);

-- objects table
CREATE TABLE IF NOT EXISTS objects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  observations TEXT,
  source_url TEXT,
  category TEXT NOT NULL CHECK (
    category in ('Bar', 'Bucatarie', 'Curatenie', 'Birotica', 'Papetarie', 'Boardgames', 'Diverse')
  )
);

CREATE TABLE IF NOT EXISTS object_stock (
  id SERIAL PRIMARY KEY,
  object_id INT NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  location VARCHAR(10) NOT NULL CHECK (
    location in ('EC 105', 'EC 004', 'Precis', 'P16')
  ),
  quantity NUMERIC,
  quantity_measurement TEXT,
  is_quantity_aproximation BOOLEAN,

  UNIQUE (object_id, location)
);