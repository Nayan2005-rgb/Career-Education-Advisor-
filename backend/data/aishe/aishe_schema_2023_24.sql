-- AISHE 2023-24 database schema for the One-Stop Personalized Career & Education Advisor
-- IMPORTANT:
-- The supplied AISHE Final Report 2023-24 workbook is an AGGREGATE REPORT.
-- It contains state/type/programme/discipline statistics, not an individual college/university directory.
-- Therefore the importer populates statistics/programme/discipline tables and does NOT invent institution names.

USE defaultdb;

CREATE TABLE IF NOT EXISTS data_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL,
    source_type VARCHAR(100),
    academic_year VARCHAR(20),
    source_url TEXT,
    last_verified_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_source_year (source_name, academic_year)
);

CREATE TABLE IF NOT EXISTS universities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    aishe_code VARCHAR(50),
    university_name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(150),
    management_type VARCHAR(150),
    state VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    source_id INT,
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_university_name (university_name),
    INDEX idx_university_state (state),
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE TABLE IF NOT EXISTS colleges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    aishe_code VARCHAR(50),
    college_name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(150),
    management_type VARCHAR(150),
    university_name VARCHAR(255),
    state VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    source_id INT,
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_college_name (college_name),
    INDEX idx_college_state (state),
    INDEX idx_college_district (district),
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    course_level VARCHAR(100),
    discipline VARCHAR(255),
    duration VARCHAR(100),
    eligibility TEXT,
    description TEXT,
    source_id INT,
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_course_name (course_name),
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE TABLE IF NOT EXISTS programmes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    programme_name VARCHAR(255) NOT NULL,
    source_id INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_programme_source_year (programme_name, source_id, academic_year),
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE TABLE IF NOT EXISTS disciplines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    discipline_name VARCHAR(255) NOT NULL,
    discipline_level ENUM('UG','PG','PHD','MPHIL','OTHER') NOT NULL,
    source_id INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_discipline_level_source_year
        (discipline_name, discipline_level, source_id, academic_year),
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE TABLE IF NOT EXISTS university_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    central_university INT DEFAULT 0,
    central_open_university INT DEFAULT 0,
    institute_national_importance INT DEFAULT 0,
    state_public_university INT DEFAULT 0,
    institute_state_legislature_act INT DEFAULT 0,
    state_open_university INT DEFAULT 0,
    state_private_university INT DEFAULT 0,
    deemed_university_government INT DEFAULT 0,
    deemed_university_government_aided INT DEFAULT 0,
    deemed_university_private INT DEFAULT 0,
    grand_total INT DEFAULT 0,
    private_total INT DEFAULT 0,
    public_total INT DEFAULT 0,
    total INT DEFAULT 0,
    source_id INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_univ_stat (state_name, source_id, academic_year),
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE TABLE IF NOT EXISTS college_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    total_districts_with_institution INT DEFAULT 0,
    districts_with_universities INT DEFAULT 0,
    universities_in_those_districts INT DEFAULT 0,
    districts_with_colleges INT DEFAULT 0,
    colleges_in_those_districts INT DEFAULT 0,
    number_of_colleges INT DEFAULT 0,
    colleges_per_lakh_population DECIMAL(12,4) DEFAULT NULL,
    colleges_responded INT DEFAULT 0,
    average_enrolment DECIMAL(14,4) DEFAULT NULL,
    source_id INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_college_stat (state_name, source_id, academic_year),
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE TABLE IF NOT EXISTS programme_enrolment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    programme_id BIGINT NOT NULL,
    all_male BIGINT DEFAULT 0,
    all_female BIGINT DEFAULT 0,
    all_total BIGINT DEFAULT 0,
    sc_male BIGINT DEFAULT 0,
    sc_female BIGINT DEFAULT 0,
    sc_total BIGINT DEFAULT 0,
    st_male BIGINT DEFAULT 0,
    st_female BIGINT DEFAULT 0,
    st_total BIGINT DEFAULT 0,
    obc_male BIGINT DEFAULT 0,
    obc_female BIGINT DEFAULT 0,
    obc_total BIGINT DEFAULT 0,
    source_id INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_programme_enrolment (programme_id, source_id, academic_year),
    FOREIGN KEY (programme_id) REFERENCES programmes(id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE TABLE IF NOT EXISTS discipline_enrolment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    discipline_id BIGINT NOT NULL,
    level_type ENUM('UG','PG','PHD','MPHIL') NOT NULL,
    male BIGINT DEFAULT 0,
    female BIGINT DEFAULT 0,
    total BIGINT DEFAULT 0,
    source_id INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_discipline_enrolment
        (discipline_id, level_type, source_id, academic_year),
    FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE TABLE IF NOT EXISTS hostel_statistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    boys_hostel_number INT DEFAULT 0,
    boys_hostel_intake BIGINT DEFAULT 0,
    boys_hostel_residing BIGINT DEFAULT 0,
    girls_hostel_number INT DEFAULT 0,
    girls_hostel_intake BIGINT DEFAULT 0,
    girls_hostel_residing BIGINT DEFAULT 0,
    other_hostel_number INT DEFAULT 0,
    other_hostel_intake BIGINT DEFAULT 0,
    other_hostel_residing BIGINT DEFAULT 0,
    total_hostel_number INT DEFAULT 0,
    total_hostel_intake BIGINT DEFAULT 0,
    total_hostel_residing BIGINT DEFAULT 0,
    source_id INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_hostel_stat (state_name, source_id, academic_year),
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);
