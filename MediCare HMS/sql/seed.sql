-- ============================================
-- MEDICARE HMS SEED DATA SCRIPT (20+ USERS)
-- ============================================

-- Ensure pgcrypto extension is installed for password hashing (blowfish/bcrypt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Insert Users (20 users total)
-- Password for Admin: Admin@123
-- Password for Doctors: Doctor@123
-- Password for Patients: Patient@123
INSERT INTO users (full_name, email, password_hash, role, phone, is_active)
VALUES
    -- Admin (1 user)
    ('Admin User', 'admin@medicare.com', crypt('Admin@123', gen_salt('bf')), 'ADMIN', '555-0100', TRUE),

    -- Doctors (7 users)
    ('Dr. Alice Carter', 'alice.carter@medicare.com', crypt('Doctor@123', gen_salt('bf')), 'DOCTOR', '555-0200', TRUE),
    ('Dr. Brian Patel', 'brian.patel@medicare.com', crypt('Doctor@123', gen_salt('bf')), 'DOCTOR', '555-0201', TRUE),
    ('Dr. Michael Chen', 'michael.chen@medicare.com', crypt('Doctor@123', gen_salt('bf')), 'DOCTOR', '555-0202', TRUE),
    ('Dr. Emily Watson', 'emily.watson@medicare.com', crypt('Doctor@123', gen_salt('bf')), 'DOCTOR', '555-0203', TRUE),
    ('Dr. James Anderson', 'james.anderson@medicare.com', crypt('Doctor@123', gen_salt('bf')), 'DOCTOR', '555-0204', TRUE),
    ('Dr. Lisa Vance', 'lisa.vance@medicare.com', crypt('Doctor@123', gen_salt('bf')), 'DOCTOR', '555-0205', TRUE),
    ('Dr. Robert Vance', 'robert.vance@medicare.com', crypt('Doctor@123', gen_salt('bf')), 'DOCTOR', '555-0206', TRUE),

    -- Patients (12 users)
    ('John Doe', 'john.doe@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0300', TRUE),
    ('Mary Lane', 'mary.lane@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0301', TRUE),
    ('Alexander Pierce', 'alexander.pierce@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0302', TRUE),
    ('Emma Wilson', 'emma.wilson@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0303', TRUE),
    ('David Miller', 'david.miller@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0304', TRUE),
    ('Clara Vance', 'clara.vance@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0305', TRUE),
    ('Robert Smith', 'robert.smith@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0306', TRUE),
    ('Sarah Connor', 'sarah.connor@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0307', TRUE),
    ('Bruce Wayne', 'bruce.wayne@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0308', TRUE),
    ('Clark Kent', 'clark.kent@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0309', TRUE),
    ('Diana Prince', 'diana.prince@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0310', TRUE),
    ('Barry Allen', 'barry.allen@medicare.com', crypt('Patient@123', gen_salt('bf')), 'PATIENT', '555-0311', TRUE);

-- 2. Insert Departments
INSERT INTO departments (name, description)
VALUES
    ('Cardiology', 'Heart and vascular care.'),
    ('Neurology', 'Brain and nervous system care.'),
    ('Pediatrics', 'Medical care for infants, children, and adolescents.'),
    ('Orthopedics', 'Bones, muscles, and joints care.'),
    ('Dermatology', 'Skin, hair, and nail clinical care.'),
    ('General Medicine', 'Comprehensive primary health care services.')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- 3. Insert Patients (12 patients total)
INSERT INTO patients (user_id, date_of_birth, gender, blood_group, address, emergency_contact_name, emergency_contact_phone, allergies, medical_history_summary)
VALUES
    ((SELECT id FROM users WHERE email = 'john.doe@medicare.com'), '1987-08-15', 'Male', 'A+', '123 Main St, Seattle, WA', 'Jane Doe', '555-0111', 'Penicillin', 'No major illnesses.'),
    ((SELECT id FROM users WHERE email = 'mary.lane@medicare.com'), '1994-02-28', 'Female', 'B-', '456 Oak Ave, Portland, OR', 'Tom Lane', '555-0112', 'None', 'Asthma diagnosed in childhood.'),
    ((SELECT id FROM users WHERE email = 'alexander.pierce@medicare.com'), '1988-03-08', 'Male', 'B+', '789 Maple Ave, Austin, TX', 'Martha Pierce', '555-0113', 'None', 'No major medical history.'),
    ((SELECT id FROM users WHERE email = 'emma.wilson@medicare.com'), '1995-09-02', 'Female', 'AB+', '101 Cedar Ln, Denver, CO', 'Jack Wilson', '555-0114', 'Lactose', 'Lactose intolerant.'),
    ((SELECT id FROM users WHERE email = 'david.miller@medicare.com'), '1980-04-12', 'Male', 'O-', '202 Birch Rd, Boston, MA', 'Sarah Miller', '555-0115', 'Sulfa Drugs', 'Hypertension diagnosed in 2022.'),
    ((SELECT id FROM users WHERE email = 'clara.vance@medicare.com'), '1991-07-22', 'Female', 'A-', '303 Elm St, Chicago, IL', 'Robert Vance', '555-0116', 'Peanuts', 'None.'),
    ((SELECT id FROM users WHERE email = 'robert.smith@medicare.com'), '1975-11-30', 'Male', 'O+', '404 Walnut Dr, San Francisco, CA', 'Linda Smith', '555-0117', 'Dust mites', 'Type 2 Diabetes.'),
    ((SELECT id FROM users WHERE email = 'sarah.connor@medicare.com'), '1985-05-14', 'Female', 'AB-', '505 Cherry Ln, Los Angeles, CA', 'John Connor', '555-0118', 'None', 'Mild seasonal allergies.'),
    ((SELECT id FROM users WHERE email = 'bruce.wayne@medicare.com'), '1982-02-19', 'Male', 'A+', '1007 Mountain Dr, Gotham, NJ', 'Alfred Pennyworth', '555-0119', 'None', 'Multiple orthopedic fractures and surgeries.'),
    ((SELECT id FROM users WHERE email = 'clark.kent@medicare.com'), '1984-06-18', 'Male', 'O+', '344 Clinton St, Metropolis, NY', 'Martha Kent', '555-0120', 'Kryptonite', 'Physically extremely resilient.'),
    ((SELECT id FROM users WHERE email = 'diana.prince@medicare.com'), '1989-10-12', 'Female', 'O-', '777 Gateway Blvd, Washington, DC', 'Hippolyta', '555-0121', 'None', 'No major medical history.'),
    ((SELECT id FROM users WHERE email = 'barry.allen@medicare.com'), '1992-03-14', 'Male', 'AB+', '525 Flash Ave, Central City, MO', 'Iris West', '555-0122', 'None', 'High metabolic rate, fast healing.');

-- 4. Insert Doctors (7 doctors total)
INSERT INTO doctors (user_id, department_id, specialization, qualification, experience_years, consultation_fee, license_number, bio, is_available)
VALUES
    ((SELECT id FROM users WHERE email = 'alice.carter@medicare.com'), (SELECT id FROM departments WHERE name = 'Cardiology'), 'Cardiologist', 'MD, Cardiology', 12, 120.00, 'DOC-1001', 'Specializes in non-invasive cardiology and preventive care.', TRUE),
    ((SELECT id FROM users WHERE email = 'brian.patel@medicare.com'), (SELECT id FROM departments WHERE name = 'Neurology'), 'Neurologist', 'MD, Neurology', 9, 135.00, 'DOC-1002', 'Experienced in migraine and epilepsy management.', TRUE),
    ((SELECT id FROM users WHERE email = 'michael.chen@medicare.com'), (SELECT id FROM departments WHERE name = 'Pediatrics'), 'Pediatrician', 'MD, FAAP', 11, 100.00, 'DOC-1003', 'Dedicated to clinical childhood development.', TRUE),
    ((SELECT id FROM users WHERE email = 'emily.watson@medicare.com'), (SELECT id FROM departments WHERE name = 'Neurology'), 'Neuroscientist', 'MD, PhD', 14, 180.00, 'DOC-1004', 'Specializes in neuro-degenerative pathologies.', TRUE),
    ((SELECT id FROM users WHERE email = 'james.anderson@medicare.com'), (SELECT id FROM departments WHERE name = 'General Medicine'), 'Internal Medicine', 'MBBS, MD', 9, 80.00, 'DOC-1005', 'Focuses on preventative adult clinical medicine.', TRUE),
    ((SELECT id FROM users WHERE email = 'lisa.vance@medicare.com'), (SELECT id FROM departments WHERE name = 'Dermatology'), 'Dermatologist', 'MD, FAAD', 12, 120.00, 'DOC-1006', 'Specializes in clinical and oncological dermatology.', TRUE),
    ((SELECT id FROM users WHERE email = 'robert.vance@medicare.com'), (SELECT id FROM departments WHERE name = 'Orthopedics'), 'Orthopedic Surgeon', 'MD, FAAOS', 15, 160.00, 'DOC-1007', 'Specializes in arthroscopy and joint reconstruction.', TRUE);

-- 5. Insert Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, reason, notes)
VALUES
    -- Cardiology
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'john.doe@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'alice.carter@medicare.com'),
     '2026-06-22', '09:00:00', 'COMPLETED', 'Chest discomfort and shortness of breath', 'Aspirin prescribed.'),
     
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'david.miller@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'alice.carter@medicare.com'),
     '2026-06-23', '10:00:00', 'BOOKED', 'Hypertension follow-up', 'Check daily BP log.'),

    -- Neurology
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'mary.lane@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'brian.patel@medicare.com'),
     '2026-06-22', '11:00:00', 'COMPLETED', 'Recurring headaches and dizziness', 'Migraine preventative advised.'),

    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'alexander.pierce@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'emily.watson@medicare.com'),
     '2026-06-24', '14:30:00', 'BOOKED', 'Frequent migraine aura check', 'Follow up after trigger diary review.'),

    -- Pediatrics
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'emma.wilson@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'michael.chen@medicare.com'),
     '2026-06-22', '15:00:00', 'BOOKED', 'Pediatric checkup for child growth concerns', 'None.'),

    -- Orthopedics
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'bruce.wayne@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'robert.vance@medicare.com'),
     '2026-06-22', '13:00:00', 'COMPLETED', 'Follow up on joint fractures', 'Physical therapy recommended.'),

    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'clark.kent@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'robert.vance@medicare.com'),
     '2026-06-25', '16:00:00', 'BOOKED', 'Annual physical musculoskeletal check', 'Routine checkup.'),

    -- Dermatology
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'clara.vance@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'lisa.vance@medicare.com'),
     '2026-06-22', '10:30:00', 'COMPLETED', 'Severe skin rash', 'Antihistamines prescribed.'),

    -- General Medicine
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'robert.smith@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'james.anderson@medicare.com'),
     '2026-06-22', '14:00:00', 'COMPLETED', 'Type 2 Diabetes checkup', 'Metformin dosage adjusted.'),

    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'barry.allen@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'james.anderson@medicare.com'),
     '2026-06-26', '09:00:00', 'CANCELLED', 'Extreme metabolism fatigue', 'Cancelled by patient.');

-- 6. Insert Medical Records
INSERT INTO medical_records (patient_id, doctor_id, appointment_id, symptoms, diagnosis, prescription, treatment_notes, follow_up_date)
VALUES
    -- John Doe Cardiology
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'john.doe@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'alice.carter@medicare.com'),
     (SELECT a.id FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE u.email = 'john.doe@medicare.com' AND a.appointment_date = '2026-06-22'),
     'Mild chest pain, fatigue', 'Stage 1 Essential Hypertension', 'Lisinopril 10mg once daily', 'Advised low sodium diet and regular moderate exercise.', '2026-07-06'),
     
    -- Mary Lane Neurology
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'mary.lane@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'brian.patel@medicare.com'),
     (SELECT a.id FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE u.email = 'mary.lane@medicare.com' AND a.appointment_date = '2026-06-22'),
     'Headaches, nausea', 'Tension headache with possible migraine', 'Ibuprofen 400mg as needed, Sumatriptan 50mg', 'Track headaches in trigger diary.', '2026-07-20'),

    -- Bruce Wayne Orthopedics
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'bruce.wayne@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'robert.vance@medicare.com'),
     (SELECT a.id FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE u.email = 'bruce.wayne@medicare.com' AND a.appointment_date = '2026-06-22'),
     'Right knee stiffness, joint pain', 'Post-traumatic Osteoarthritis', 'Glucosamine 500mg daily, Ibuprofen 200mg', 'Prescribed physical therapy twice a week for joint stabilization.', '2026-08-15'),

    -- Clara Vance Dermatology
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'clara.vance@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'lisa.vance@medicare.com'),
     (SELECT a.id FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE u.email = 'clara.vance@medicare.com' AND a.appointment_date = '2026-06-22'),
     'Severe skin rash on arms, itching', 'Contact Dermatitis', 'Hydrocortisone cream 1%, Cetirizine 10mg daily', 'Avoid synthetic soaps. Return if inflammation persists.', '2026-06-29'),

    -- Robert Smith General Medicine
    ((SELECT p.id FROM patients p JOIN users u ON p.user_id = u.id WHERE u.email = 'robert.smith@medicare.com'),
     (SELECT d.id FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'james.anderson@medicare.com'),
     (SELECT a.id FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id WHERE u.email = 'robert.smith@medicare.com' AND a.appointment_date = '2026-06-22'),
     'Increased thirst, frequent urination', 'Type 2 Diabetes Mellitus', 'Metformin 850mg twice daily', 'Advised strict low glycemic diet, daily fasting blood glucose check.', '2026-07-13');
