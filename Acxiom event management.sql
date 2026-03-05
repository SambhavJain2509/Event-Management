show databases;
CREATE DATABASE event_management_system;
USE event_management_system;

DROP TABLE memberships;
DROP TABLE users;
DROP TABLE transactions;

create TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users 
MODIFY role ENUM('admin','user','vendor') DEFAULT 'user';

CREATE TABLE memberships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  membership_number VARCHAR(50) UNIQUE,
  full_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  age INT,
  duration VARCHAR(20),
  amount DECIMAL(10,2),
  start_date DATETIME,
  end_date DATETIME,
  status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    membership_id INT,
    membership_number VARCHAR(20),
    transaction_type ENUM('new','extend','cancel'),
    amount DECIMAL(10,2),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (membership_id) REFERENCES memberships(id)
);

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    membership_number VARCHAR(20),
    report_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendor_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    availability BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    event_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status ENUM('Pending','Confirmed','Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES vendor_services(id) ON DELETE CASCADE
);

DELETE FROM users;

select * from users;
select * from memberships;
select * from transactions;