CREATE DATABASE IF NOT EXISTS healthcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE healthcare_db;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    email VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255),
    location VARCHAR(200),
    role ENUM('user', 'pharmacist', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE symptoms (
    symptom_id INT AUTO_INCREMENT PRIMARY KEY,
    disease_name VARCHAR(200) UNIQUE NOT NULL,
    symptom_desc TEXT,
    marathi_name VARCHAR(200),
    minglish_name VARCHAR(200)
);

CREATE TABLE home_remedies (
    remedy_id INT AUTO_INCREMENT PRIMARY KEY,
    symptom_id INT,
    remedy_name VARCHAR(255),
    ingredients TEXT,
    dosage TEXT,
    FOREIGN KEY (symptom_id) REFERENCES symptoms(symptom_id)
);

CREATE TABLE medicines (
    medicine_id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_name VARCHAR(255),
    company_name VARCHAR(200),
    composition TEXT,
    price DECIMAL(10,2),
    image_url VARCHAR(255),
    type ENUM('ayurvedic', 'allopathic') DEFAULT 'ayurvedic'
);

CREATE TABLE symptom_medicine_map (
    map_id INT AUTO_INCREMENT PRIMARY KEY,
    symptom_id INT,
    medicine_id INT,
    FOREIGN KEY (symptom_id) REFERENCES symptoms(symptom_id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id)
);

CREATE TABLE medical_store (
    store_id INT AUTO_INCREMENT PRIMARY KEY,
    store_name VARCHAR(255),
    address TEXT,
    contact_no VARCHAR(20),
    location VARCHAR(200),
    owner_user_id INT,
    FOREIGN KEY (owner_user_id) REFERENCES users(user_id)
);

CREATE TABLE store_inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT,
    medicine_id INT,
    stock_quantity INT DEFAULT 0,
    expiry_date DATE,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (store_id) REFERENCES medical_store(store_id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id)
);

CREATE TABLE user_health_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    medicine_id INT,
    contact_no VARCHAR(20),
    location VARCHAR(200),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id)
);

CREATE TABLE search_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    symptom_id INT,
    search_query VARCHAR(255),
    feedback_rating INT CHECK (feedback_rating BETWEEN 1 AND 5),
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (symptom_id) REFERENCES symptoms(symptom_id)
);

CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    specialization VARCHAR(100),
    qualification VARCHAR(200),
    experience_years INT,
    consultation_fee DECIMAL(10,2),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    city VARCHAR(50),
    available_days VARCHAR(100),
    available_time VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0,
    image_url VARCHAR(255)
);

CREATE TABLE consultations (
    consultation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    doctor_id INT,
    appointment_date DATE,
    appointment_time TIME,
    symptoms TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    consultation_fee DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

CREATE TABLE user_feedback_log (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    feedback TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE cart_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    medicine_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    store_id INT,
    total_amount DECIMAL(10,2),
    delivery_address TEXT,
    contact_number VARCHAR(20),
    status ENUM('pending', 'confirmed', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (store_id) REFERENCES medical_store(store_id)
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    medicine_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id)
);

CREATE TABLE emergency_contacts (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(255),
    phone_no VARCHAR(20),
    location VARCHAR(200)
);
