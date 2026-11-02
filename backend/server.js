require('dotenv').config();
const aisheRoutes = require('./routes/aishe');
const db = require('./config/db');
const express = require('express');
const cors = require('cors');

// Security: Validate critical environment variables
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is not set');
  console.error('Please set JWT_SECRET in your .env file with a strong, random value');
  process.exit(1);
}

if (process.env.JWT_SECRET === 'your-development-secret' || process.env.JWT_SECRET === 'your-existing-jwt-secret') {
  console.error('ERROR: JWT_SECRET is set to a placeholder value');
  console.error('Please replace JWT_SECRET with a strong, random value in your .env file');
  console.error('You can generate a secure secret using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  process.exit(1);
}

const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessment');
const recommendationRoutes = require('./routes/recommendation');
const roadmapRoutes = require('./routes/roadmap');
const skillGapRoutes = require('./routes/skillGap');
const schoolRoutes = require('./routes/school');
const govtResidentialSchoolRoutes = require('./routes/govtResidentialSchool');
const collegeRoutes = require('./routes/college');
const courseRoutes = require('./routes/course');
const entranceExamRoutes = require('./routes/entranceExam');
const scholarshipRoutes = require('./routes/scholarship');
const resumeRoutes = require('./routes/resume');
const opportunityRoutes = require('./routes/opportunity');

// Seed data
const { seedGovtResidentialSchools } = require('./data/govtResidentialSchoolSeeder');
const { seedColleges } = require('./data/collegeSeeder');
const { seedScholarships } = require('./data/scholarshipSeeder');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/aishe', aisheRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/skillgap', skillGapRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/govt-residential-school', govtResidentialSchoolRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/entrance-exam', entranceExamRoutes);
app.use('/api/scholarship', scholarshipRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/opportunity', opportunityRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Career & Education Advisor API is running' });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error. Please try again later.' });
});

// Seed government residential schools data
seedGovtResidentialSchools();

// Seed colleges data
seedColleges();

// Seed scholarships data
seedScholarships();


const PORT = process.env.PORT || 5000;

// Test MySQL connection (optional - allow server to start even if MySQL fails)
db.getConnection()
  .then(connection => {
    console.log('MySQL connected successfully');
    connection.release();
  })
  .catch(error => {
    console.warn('MySQL connection failed (optional for govt-residential-school features):', error.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
