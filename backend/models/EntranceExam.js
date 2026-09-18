const JsonDB = require('../config/jsonDb');

const entranceExamDb = new JsonDB('entranceExams.json');

const EntranceExam = {
  create: (data) => entranceExamDb.create(data),
  
  findOne: (query) => entranceExamDb.findOne(query),
  
  findById: (id) => entranceExamDb.findById(id),
  
  findAll: () => entranceExamDb.findAll(),
  
  find: (query) => {
    const items = entranceExamDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => entranceExamDb.updateById(id, updates),
  
  deleteById: (id) => entranceExamDb.deleteById(id),

  // Search entrance exams with filters
  search: (filters) => {
    const exams = entranceExamDb.findAll();
    return exams.filter(exam => {
      // Text search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          exam.name.toLowerCase().includes(searchTerm) ||
          exam.fullName.toLowerCase().includes(searchTerm) ||
          exam.purpose.toLowerCase().includes(searchTerm) ||
          exam.subjects.some(subject => subject.toLowerCase().includes(searchTerm)) ||
          exam.relatedCourses.some(course => course.toLowerCase().includes(searchTerm)) ||
          exam.relatedColleges.some(college => college.toLowerCase().includes(searchTerm));
        if (!matchesSearch) return false;
      }

      // Subject filter
      if (filters.subject && !exam.subjects.includes(filters.subject)) return false;

      // Course filter
      if (filters.course && !exam.relatedCourses.includes(filters.course)) return false;

      // College filter
      if (filters.college && !exam.relatedColleges.includes(filters.college)) return false;

      return true;
    });
  },

  // Get entrance exams by course
  getByCourse: (courseName) => {
    const exams = entranceExamDb.findAll();
    return exams.filter(exam => {
      return exam.relatedCourses.includes(courseName);
    });
  },

  // Get entrance exams by subject
  getBySubject: (subject) => {
    const exams = entranceExamDb.findAll();
    return exams.filter(exam => {
      return exam.subjects.includes(subject);
    });
  },

  // Get entrance exams by college
  getByCollege: (collegeName) => {
    const exams = entranceExamDb.findAll();
    return exams.filter(exam => {
      return exam.relatedColleges.includes(collegeName);
    });
  },

  // Get entrance exams by career (through related courses)
  getByCareer: (careerTitle) => {
    const exams = entranceExamDb.findAll();
    return exams.filter(exam => {
      // Check if any related course is associated with this career
      // This requires looking up courses, but for now we'll filter by name patterns
      return exam.relatedCourses.some(course => 
        course.toLowerCase().includes(careerTitle.toLowerCase().split(' ')[0])
      );
    });
  }
};

module.exports = EntranceExam;