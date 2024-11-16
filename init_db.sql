-- Crear tabla de pacientes
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de especialidades
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Crear tabla de médicos
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    specialty_id INT NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de citas
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    date_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (doctor_id, date_time),
    UNIQUE (patient_id, date_time)
);

-- Insertar pacientes
INSERT INTO patients (name, email, password) VALUES
('John Doe', 'john.doe@example.com', 'password123'),
('Jane Smith', 'jane.smith@example.com', 'password123'),
('Michael Brown', 'michael.brown@example.com', 'password123'),
('Emily Davis', 'emily.davis@example.com', 'password123'),
('David Wilson', 'david.wilson@example.com', 'password123'),
('Sophia Martinez', 'sophia.martinez@example.com', 'password123'),
('James Anderson', 'james.anderson@example.com', 'password123'),
('Olivia Taylor', 'olivia.taylor@example.com', 'password123'),
('William Thomas', 'william.thomas@example.com', 'password123'),
('Isabella Jackson', 'isabella.jackson@example.com', 'password123');

-- Insertar especialidades
INSERT INTO specialties (name) VALUES
('Medicina General'),
('Cardiología'),
('Urología'),
('Fisiología'),
('Pediatría');

-- Insertar médicos
INSERT INTO doctors (name, email, specialty_id) VALUES
('Dr. Juan Rendon', 'juan.rendon@example.com', 1),
('Dra. Ana Cristina', 'ana.cristina@example.com', 2),
('Dr. Carlos Ramírez', 'carlos.ramirez@example.com', 3),
('Dra. Ana González', 'ana.gonzalez@example.com', 4),
('Dr. Luis Torres', 'luis.torres@example.com', 5);

