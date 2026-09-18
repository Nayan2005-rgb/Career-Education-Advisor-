const { Course, SavedCourse } = require('../models/Course');

/**
 * Search courses with filters
 */
exports.searchCourses = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      duration: req.query.duration,
      career: req.query.career,
      entranceExam: req.query.entranceExam,
      college: req.query.college,
      skill: req.query.skill
    };

    const courses = Course.search(filters);
    
    // Remove undefined filters for cleaner query
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    res.json({
      courses,
      filters: Object.keys(filters).length > 0 ? filters : null,
      count: courses.length
    });
  } catch (err) {
    console.error('Error searching courses:', err);
    res.status(500).json({ 
      message: 'Unable to search courses. Please try again.' 
    });
  }
};

/**
 * Get courses by career recommendation
 */
exports.getCoursesByCareer = async (req, res) => {
  try {
    const { careerTitle } = req.params;
    
    const courses = Course.getByCareer(careerTitle);
    
    res.json({
      careerTitle,
      courses,
      count: courses.length
    });
  } catch (err) {
    console.error('Error getting courses by career:', err);
    res.status(500).json({ 
      message: 'Unable to get courses by career. Please try again.' 
    });
  }
};

/**
 * Get courses by duration
 */
exports.getCoursesByDuration = async (req, res) => {
  try {
    const { duration } = req.params;
    
    const courses = Course.getByDuration(duration);
    
    res.json({
      duration,
      courses,
      count: courses.length
    });
  } catch (err) {
    console.error('Error getting courses by duration:', err);
    res.status(500).json({ 
      message: 'Unable to get courses by duration. Please try again.' 
    });
  }
};

/**
 * Get courses by entrance exam
 */
exports.getCoursesByEntranceExam = async (req, res) => {
  try {
    const { exam } = req.params;
    
    const courses = Course.getByEntranceExam(exam);
    
    res.json({
      exam,
      courses,
      count: courses.length
    });
  } catch (err) {
    console.error('Error getting courses by entrance exam:', err);
    res.status(500).json({ 
      message: 'Unable to get courses by entrance exam. Please try again.' 
    });
  }
};

/**
 * Get course details by ID
 */
exports.getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ 
        message: 'Course not found' 
      });
    }

    res.json(course);
  } catch (err) {
    console.error('Error getting course details:', err);
    res.status(500).json({ 
      message: 'Unable to get course details. Please try again.' 
    });
  }
};

/**
 * Get all available durations
 */
exports.getDurations = async (req, res) => {
  try {
    const courses = Course.findAll();
    const durations = [...new Set(courses.map(course => course.duration))].sort();
    
    res.json({ durations });
  } catch (err) {
    console.error('Error getting durations:', err);
    res.status(500).json({ 
      message: 'Unable to get durations. Please try again.' 
    });
  }
};

/**
 * Get all available careers
 */
exports.getCareers = async (req, res) => {
  try {
    const courses = Course.findAll();
    const careers = [...new Set(courses.flatMap(course => course.relatedCareers))].sort();
    
    res.json({ careers });
  } catch (err) {
    console.error('Error getting careers:', err);
    res.status(500).json({ 
      message: 'Unable to get careers. Please try again.' 
    });
  }
};

/**
 * Get all available entrance exams
 */
exports.getEntranceExams = async (req, res) => {
  try {
    const courses = Course.findAll();
    const entranceExams = [...new Set(courses.flatMap(course => course.entranceExams))].sort();
    
    res.json({ entranceExams });
  } catch (err) {
    console.error('Error getting entrance exams:', err);
    res.status(500).json({ 
      message: 'Unable to get entrance exams. Please try again.' 
    });
  }
};

/**
 * Get all available colleges
 */
exports.getColleges = async (req, res) => {
  try {
    const courses = Course.findAll();
    const colleges = [...new Set(courses.flatMap(course => course.colleges))].sort();
    
    res.json({ colleges });
  } catch (err) {
    console.error('Error getting colleges:', err);
    res.status(500).json({ 
      message: 'Unable to get colleges. Please try again.' 
    });
  }
};

/**
 * Save a course for the current user
 */
exports.saveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        message: 'Course not found' 
      });
    }

    // Check if already saved
    const alreadySaved = SavedCourse.isCourseSaved(userId, courseId);
    if (alreadySaved) {
      return res.status(400).json({ 
        message: 'Course already saved' 
      });
    }

    // Save the course
    const savedCourse = await SavedCourse.create({
      user: userId,
      courseId: courseId,
      savedAt: new Date().toISOString()
    });

    res.json({
      message: 'Course saved successfully',
      savedCourse
    });
  } catch (err) {
    console.error('Error saving course:', err);
    res.status(500).json({ 
      message: 'Unable to save course. Please try again.' 
    });
  }
};

/**
 * Get saved courses for the current user
 */
exports.getSavedCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const savedCourses = SavedCourse.getUserSavedCourses(userId);
    
    // Get full course details for each saved course
    const coursesWithDetails = await Promise.all(
      savedCourses.map(async (savedCourse) => {
        const course = Course.findById(savedCourse.courseId);
        return {
          ...savedCourse,
          courseDetails: course
        };
      })
    );

    // Sort by most recently saved
    coursesWithDetails.sort((a, b) => 
      new Date(b.savedAt) - new Date(a.savedAt)
    );

    res.json({
      savedCourses: coursesWithDetails,
      count: coursesWithDetails.length
    });
  } catch (err) {
    console.error('Error getting saved courses:', err);
    res.status(500).json({ 
      message: 'Unable to get saved courses. Please try again.' 
    });
  }
};

/**
 * Remove a saved course
 */
exports.removeSavedCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const removed = SavedCourse.removeSavedCourse(userId, courseId);
    
    if (!removed) {
      return res.status(404).json({ 
        message: 'Saved course not found' 
      });
    }

    res.json({ 
      message: 'Course removed from saved list successfully' 
    });
  } catch (err) {
    console.error('Error removing saved course:', err);
    res.status(500).json({ 
      message: 'Unable to remove saved course. Please try again.' 
    });
  }
};

/**
 * Compare multiple courses
 */
exports.compareCourses = async (req, res) => {
  try {
    const { courseIds } = req.body;
    
    if (!Array.isArray(courseIds) || courseIds.length < 2) {
      return res.status(400).json({ 
        message: 'Please provide at least 2 course IDs for comparison' 
      });
    }

    if (courseIds.length > 4) {
      return res.status(400).json({ 
        message: 'Cannot compare more than 4 courses at once' 
      });
    }

    // Get course details for each ID
    const courses = [];
    for (const courseId of courseIds) {
      const course = Course.findById(courseId);
      if (course) {
        courses.push(course);
      }
    }

    if (courses.length < 2) {
      return res.status(404).json({ 
        message: 'Could not find enough valid courses for comparison' 
      });
    }

    // Generate comparison data
    const comparison = {
      courses,
      comparison: {
        duration: courses.map(c => ({ name: c.name, duration: c.duration })),
        eligibility: courses.map(c => ({ name: c.name, eligibility: c.eligibility })),
        subjects: courses.map(c => ({ name: c.name, subjects: c.subjects })),
        skills: courses.map(c => ({ name: c.name, skills: c.requiredSkills })),
        careers: courses.map(c => ({ name: c.name, careers: c.relatedCareers })),
        entranceExams: courses.map(c => ({ name: c.name, exams: c.entranceExams })),
        colleges: courses.map(c => ({ name: c.name, colleges: c.colleges }))
      }
    };

    res.json(comparison);
  } catch (err) {
    console.error('Error comparing courses:', err);
    res.status(500).json({ 
      message: 'Unable to compare courses. Please try again.' 
    });
  }
};

/**
 * Get all available filters/options
 */
exports.getFilterOptions = async (req, res) => {
  try {
    const courses = Course.findAll();
    
    const durations = [...new Set(courses.map(c => c.duration))].sort();
    const careers = [...new Set(courses.flatMap(c => c.relatedCareers))].sort();
    const entranceExams = [...new Set(courses.flatMap(c => c.entranceExams))].sort();
    const colleges = [...new Set(courses.flatMap(c => c.colleges))].sort();
    
    // Get all unique skills
    const allSkills = courses.flatMap(c => c.requiredSkills);
    const skills = [...new Set(allSkills)].sort();

    res.json({
      durations,
      careers,
      entranceExams,
      colleges,
      skills
    });
  } catch (err) {
    console.error('Error getting filter options:', err);
    res.status(500).json({ 
      message: 'Unable to get filter options. Please try again.' 
    });
  }
};
