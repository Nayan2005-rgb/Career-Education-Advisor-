const JsonDB = require('../config/jsonDb');

const courseDb = new JsonDB('courses.json');
const savedCoursesDb = new JsonDB('savedCourses.json');

const Course = {
  create: (data) => courseDb.create(data),
  
  findOne: (query) => courseDb.findOne(query),
  
  findById: (id) => courseDb.findById(id),
  
  findAll: () => courseDb.findAll(),
  
  find: (query) => {
    const items = courseDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => courseDb.updateById(id, updates),
  
  deleteById: (id) => courseDb.deleteById(id),

  // Search courses with filters
  search: (filters) => {
    const courses = courseDb.findAll();
    return courses.filter(course => {
      // Text search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          course.name.toLowerCase().includes(searchTerm) ||
          course.subjects.some(subject => subject.toLowerCase().includes(searchTerm)) ||
          course.relatedCareers.some(career => career.toLowerCase().includes(searchTerm)) ||
          course.entranceExams.some(exam => exam.toLowerCase().includes(searchTerm));
        if (!matchesSearch) return false;
      }

      // Duration filter
      if (filters.duration && course.duration !== filters.duration) return false;

      // Career filter
      if (filters.career && !course.relatedCareers.includes(filters.career)) return false;

      // Entrance exam filter
      if (filters.entranceExam && !course.entranceExams.includes(filters.entranceExam)) return false;

      // College filter
      if (filters.college && !course.colleges.includes(filters.college)) return false;

      // Skill filter
      if (filters.skill && !course.requiredSkills.some(skill => 
        skill.toLowerCase().includes(filters.skill.toLowerCase())
      )) return false;

      return true;
    });
  },

  // Get courses by career
  getByCareer: (careerTitle) => {
    const courses = courseDb.findAll();
    return courses.filter(course => {
      return course.relatedCareers.includes(careerTitle);
    });
  },

  // Get courses by duration
  getByDuration: (duration) => {
    const courses = courseDb.findAll();
    return courses.filter(course => course.duration === duration);
  },

  // Get courses by entrance exam
  getByEntranceExam: (exam) => {
    const courses = courseDb.findAll();
    return courses.filter(course => course.entranceExams.includes(exam));
  }
};

const SavedCourse = {
  create: (data) => savedCoursesDb.create(data),
  
  findOne: (query) => savedCoursesDb.findOne(query),
  
  findById: (id) => savedCoursesDb.findById(id),
  
  findAll: () => savedCoursesDb.findAll(),
  
  find: (query) => {
    const items = savedCoursesDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => savedCoursesDb.updateById(id, updates),
  
  deleteById: (id) => savedCoursesDb.deleteById(id),

  // Get saved courses for a user
  getUserSavedCourses: (userId) => {
    const savedCourses = savedCoursesDb.findAll();
    return savedCourses.filter(item => item.user === userId);
  },

  // Check if course is saved by user
  isCourseSaved: (userId, courseId) => {
    const savedCourses = savedCoursesDb.findAll();
    return savedCourses.some(item => item.user === userId && item.courseId === courseId);
  },

  // Remove saved course
  removeSavedCourse: (userId, courseId) => {
    const savedCourses = savedCoursesDb.findAll();
    const index = savedCourses.findIndex(item => item.user === userId && item.courseId === courseId);
    if (index === -1) return false;
    
    savedCourses.splice(index, 1);
    savedCoursesDb.write(savedCourses);
    return true;
  }
};

module.exports = { Course, SavedCourse };
