const pool = require('../config/db');

const createTables = async () => {
  try {
    console.log('Connecting to MySQL...');

    const connection = await pool.getConnection();

    console.log('MySQL connection successful.');

    // 1. Data sources
    await connection.query(`
      CREATE TABLE IF NOT EXISTS data_sources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        source_name VARCHAR(255) NOT NULL,
        source_type VARCHAR(100),
        academic_year VARCHAR(20),
        source_url TEXT,
        last_verified_at DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Universities
    await connection.query(`
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        INDEX idx_university_name (university_name),
        INDEX idx_university_state (state),
        INDEX idx_university_type (institution_type),

        FOREIGN KEY (source_id)
          REFERENCES data_sources(id)
      )
    `);

    // 3. Colleges
    await connection.query(`
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        INDEX idx_college_name (college_name),
        INDEX idx_college_state (state),
        INDEX idx_college_district (district),
        INDEX idx_college_type (institution_type),

        FOREIGN KEY (source_id)
          REFERENCES data_sources(id)
      )
    `);

    // 4. Courses
    await connection.query(`
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
        INDEX idx_course_level (course_level),
        INDEX idx_course_discipline (discipline),

        FOREIGN KEY (source_id)
          REFERENCES data_sources(id)
      )
    `);

    // 5. College-Course relationship
    await connection.query(`
      CREATE TABLE IF NOT EXISTS college_courses (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        college_id BIGINT NOT NULL,
        course_id BIGINT NOT NULL,

        UNIQUE KEY unique_college_course (college_id, course_id),

        FOREIGN KEY (college_id)
          REFERENCES colleges(id)
          ON DELETE CASCADE,

        FOREIGN KEY (course_id)
          REFERENCES courses(id)
          ON DELETE CASCADE
      )
    `);

    // 6. Add AISHE source
    const [existingSource] = await connection.query(`
      SELECT id
      FROM data_sources
      WHERE source_name = 'All India Survey on Higher Education (AISHE)'
        AND academic_year = '2023-24'
      LIMIT 1
    `);

    if (existingSource.length === 0) {
      await connection.query(`
        INSERT INTO data_sources
        (
          source_name,
          source_type,
          academic_year,
          source_url,
          last_verified_at
        )
        VALUES
        (
          'All India Survey on Higher Education (AISHE)',
          'Government of India',
          '2023-24',
          'https://aishe.gov.in/documents/',
          CURDATE()
        )
      `);

      console.log('AISHE data source added.');
    } else {
      console.log('AISHE data source already exists.');
    }

    connection.release();

    console.log('');
    console.log('======================================');
    console.log('AISHE tables created successfully!');
    console.log('======================================');

    process.exit(0);

  } catch (error) {
    console.error('');
    console.error('ERROR creating AISHE tables:');
    console.error(error.message);

    process.exit(1);
  }
};

createTables();