const EntranceExam = require('../models/EntranceExam');

/**
 * Search entrance exams with filters
 */
exports.searchEntranceExams = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      subject: req.query.subject,
      course: req.query.course,
      college: req.query.college
    };

    const exams = EntranceExam.search(filters);
    
    // Remove undefined filters for cleaner query
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    res.json({
      exams,
      filters: Object.keys(filters).length > 0 ? filters : null,
      count: exams.length
    });
  } catch (err) {
    console.error('Error searching entrance exams:', err);
    res.status(500).json({ 
      message: 'Unable to search entrance exams. Please try again.' 
    });
  }
};

/**
 * Get entrance exams by course
 */
exports.getEntranceExamsByCourse = async (req, res) => {
  try {
    const { courseName } = req.params;
    
    const exams = EntranceExam.getByCourse(courseName);
    
    res.json({
      courseName,
      exams,
      count: exams.length
    });
  } catch (err) {
    console.error('Error getting entrance exams by course:', err);
    res.status(500).json({ 
      message: 'Unable to get entrance exams by course. Please try again.' 
    });
  }
};

/**
 * Get entrance exams by subject
 */
exports.getEntranceExamsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    
    const exams = EntranceExam.getBySubject(subject);
    
    res.json({
      subject,
      exams,
      count: exams.length
    });
  } catch (err) {
    console.error('Error getting entrance exams by subject:', err);
    res.status(500).json({ 
      message: 'Unable to get entrance exams by subject. Please try again.' 
    });
  }
};

/**
 * Get entrance exams by college
 */
exports.getEntranceExamsByCollege = async (req, res) => {
  try {
    const { collegeName } = req.params;
    
    const exams = EntranceExam.getByCollege(collegeName);
    
    res.json({
      collegeName,
      exams,
      count: exams.length
    });
  } catch (err) {
    console.error('Error getting entrance exams by college:', err);
    res.status(500).json({ 
      message: 'Unable to get entrance exams by college. Please try again.' 
    });
  }
};

/**
 * Get entrance exams by career
 */
exports.getEntranceExamsByCareer = async (req, res) => {
  try {
    const { careerTitle } = req.params;
    
    const exams = EntranceExam.getByCareer(careerTitle);
    
    res.json({
      careerTitle,
      exams,
      count: exams.length
    });
  } catch (err) {
    console.error('Error getting entrance exams by career:', err);
    res.status(500).json({ 
      message: 'Unable to get entrance exams by career. Please try again.' 
    });
  }
};

/**
 * Get entrance exam details by ID
 */
exports.getEntranceExamDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const exam = EntranceExam.findById(id);
    
    if (!exam) {
      return res.status(404).json({ 
        message: 'Entrance exam not found' 
      });
    }

    res.json(exam);
  } catch (err) {
    console.error('Error getting entrance exam details:', err);
    res.status(500).json({ 
      message: 'Unable to get entrance exam details. Please try again.' 
    });
  }
};

/**
 * Get all entrance exams
 */
exports.getAllEntranceExams = async (req, res) => {
  try {
    const exams = EntranceExam.findAll();
    
    res.json({
      exams,
      count: exams.length
    });
  } catch (err) {
    console.error('Error getting all entrance exams:', err);
    res.status(500).json({ 
      message: 'Unable to get entrance exams. Please try again.' 
    });
  }
};

/**
 * Get all available subjects
 */
exports.getSubjects = async (req, res) => {
  try {
    const exams = EntranceExam.findAll();
    const subjects = [...new Set(exams.flatMap(exam => exam.subjects))].sort();
    
    res.json({ subjects });
  } catch (err) {
    console.error('Error getting subjects:', err);
    res.status(500).json({ 
      message: 'Unable to get subjects. Please try again.' 
    });
  }
};

/**
 * Get all available courses for entrance exams
 */
exports.getCourses = async (req, res) => {
  try {
    const exams = EntranceExam.findAll();
    const courses = [...new Set(exams.flatMap(exam => exam.relatedCourses))].sort();
    
    res.json({ courses });
  } catch (err) {
    console.error('Error getting courses:', err);
    res.status(500).json({ 
      message: 'Unable to get courses. Please try again.' 
    });
  }
};

/**
 * Get all available colleges for entrance exams
 */
exports.getColleges = async (req, res) => {
  try {
    const exams = EntranceExam.findAll();
    const colleges = [...new Set(exams.flatMap(exam => exam.relatedColleges))].sort();
    
    res.json({ colleges });
  } catch (err) {
    console.error('Error getting colleges:', err);
    res.status(500).json({ 
      message: 'Unable to get colleges. Please try again.' 
    });
  }
};

/**
 * Get all available filter options
 */
exports.getFilterOptions = async (req, res) => {
  try {
    const exams = EntranceExam.findAll();
    
    const subjects = [...new Set(exams.flatMap(e => e.subjects))].sort();
    const courses = [...new Set(exams.flatMap(e => e.relatedCourses))].sort();
    const colleges = [...new Set(exams.flatMap(e => e.relatedColleges))].sort();

    res.json({
      subjects,
      courses,
      colleges
    });
  } catch (err) {
    console.error('Error getting filter options:', err);
    res.status(500).json({ 
      message: 'Unable to get filter options. Please try again.' 
    });
  }
};