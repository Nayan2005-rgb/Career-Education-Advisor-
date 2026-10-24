require('dotenv').config();
const aisheRoutes = require('./routes/aishe');
const db = require('./config/db');
const express = require('express');
const cors = require('cors');

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

// Test MySQL connection
db.getConnection()
  .then(connection => {
    console.log('MySQL connected successfully');
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('MySQL connection failed:', error.message);
    process.exit(1);
  });
