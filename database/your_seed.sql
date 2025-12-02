USE healthcare_db;

-- Note: Register new users through the website
-- Old users removed for fresh start

-- Insert Sample Doctors
INSERT INTO doctors (name, specialization, qualification, experience_years, consultation_fee, phone, city, available_days, available_time, rating) VALUES
('Dr. Rajesh Sharma', 'Ayurvedic Physician', 'BAMS, MD (Ayurveda)', 15, 500, '9876543210', 'Dhule', 'Mon-Sat', '10:00 AM - 6:00 PM', 4.5),
('Dr. Priya Deshmukh', 'General Physician', 'MBBS, MD', 10, 400, '9988776655', 'Pune', 'Mon-Fri', '9:00 AM - 5:00 PM', 4.7),
('Dr. Amit Patil', 'Ayurvedic Specialist', 'BAMS', 8, 350, '8899001122', 'Nashik', 'Tue-Sun', '11:00 AM - 7:00 PM', 4.3),
('Dr. Sneha Kulkarni', 'Pediatrician', 'MBBS, DCH', 12, 450, '7766554433', 'Mumbai', 'Mon-Sat', '10:00 AM - 4:00 PM', 4.8);

INSERT INTO symptoms (disease_name, symptom_desc, marathi_name, minglish_name) VALUES
('Cold & Cough', 'Sneezing, throat irritation, mild fever', 'सर्दी-खोकला', 'sardi-khokla'),
('Acidity', 'Burning chest, indigestion, sour belching', 'अम्लपित्त', 'amlapitta'),
('Headache', 'Pain in head, heaviness, stress', 'डोकेदुखी', 'dokedukhi'),
('Fever', 'High temperature, body ache', 'ताप', 'taap'),
('Stomach Pain', 'Abdominal discomfort', 'पोटदुखी', 'potdukhi');

INSERT INTO home_remedies (symptom_id, remedy_name, ingredients, dosage) VALUES
(1, 'Tulsi Ginger Kadha', 'Tulsi, Ginger, Black pepper', 'Twice daily after meals'),
(1, 'Honey-Turmeric Mix', 'Honey, Turmeric', '1 tsp morning'),
(2, 'Jeera Water', 'Cumin seeds, Warm water', 'Empty stomach daily'),
(2, 'Amla Juice', 'Fresh Amla', '20 ml in morning'),
(3, 'Dry Ginger Paste', 'Sunthi powder + water', 'Apply on forehead'),
(3, 'Peppermint Tea', 'Mint leaves', 'One cup when headache starts');

INSERT INTO medicines (medicine_name, company_name, composition, price, image_url) VALUES
('Sitopaladi Churna', 'Dhootpapeshwar', 'Pippali, Vanshalochan, Elaichi, Dalchini', 120, 'img/sito.png'),
('Triphala Tablet', 'Patanjali', 'Haritaki, Bibhitaki, Amalaki', 90, 'img/triphala.png'),
('Avipattikar Churna', 'Baidyanath', 'Triphala, Musta, Pippali', 150, 'img/avi.png'),
('Pain Relief Oil', 'Himalaya', 'Gandhpurna, Mint, Sesame oil', 110, 'img/oil.png'),
('Paracetamol 500mg', 'Cipla', 'Paracetamol', 15, 'img/para.png'),
('Cetirizine 10mg', 'Sun Pharma', 'Cetirizine HCl', 25, 'img/ceti.png');

INSERT INTO symptom_medicine_map (symptom_id, medicine_id) VALUES
(1, 1), (1, 2), (1, 6),
(2, 3),
(3, 4), (3, 5),
(4, 5);

INSERT INTO medical_store (store_name, address, contact_no, location) VALUES
('Herbal Life Medicals', 'Near Bus Stand, Dhule', '9876543210', 'Dhule'),
('Ayush Ayurved Bhandar', 'Mandai Road, Pune', '9988776655', 'Pune'),
('GreenLeaf Ayurveda Store', 'College Road, Nashik', '7766554433', 'Nashik'),
('Nature Care Medicals', 'Station Road, Dhule', '8899001122', 'Dhule');

INSERT INTO store_inventory (store_id, medicine_id, stock_quantity, expiry_date, is_available) VALUES
(1, 1, 50, '2025-12-31', TRUE),
(1, 2, 30, '2025-11-30', TRUE),
(1, 3, 20, '2026-01-15', TRUE),
(2, 4, 40, '2025-10-20', TRUE),
(2, 5, 100, '2026-03-10', TRUE);

INSERT INTO emergency_contacts (hospital_name, phone_no, location) VALUES
('Ayush Hospital', '1001', 'Dhule'),
('Patanjali Chikitsalaya', '1002', 'Pune'),
('Kerala Ayurveda Clinic', '1003', 'Nashik'),
('Emergency Ambulance', '108', 'All India');
