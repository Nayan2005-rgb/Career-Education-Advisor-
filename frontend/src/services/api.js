import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const assessmentAPI = {
  submit: (data) => api.post('/assessment', data),
  getHistory: () => api.get('/assessment/history'),
};

export const recommendationAPI = {
  getRecommendations: (data) => api.post('/recommendation', data),
  getCareerDetails: (careerTitle) => api.get(`/recommendation/${encodeURIComponent(careerTitle)}`),
};

export const roadmapAPI = {
  createOrGet: (data) => api.post('/roadmap', data),
  getRoadmap: (careerTitle) => api.get(`/roadmap/career/${encodeURIComponent(careerTitle)}`),
  getUserRoadmaps: () => api.get('/roadmap'),
  updateStepStatus: (roadmapId, stepId, status) => api.put(`/roadmap/${roadmapId}/steps/${stepId}`, { status }),
  deleteRoadmap: (roadmapId) => api.delete(`/roadmap/${roadmapId}`),
};

export const skillGapAPI = {
  generateSkillGap: (careerTitle) => api.post(`/skillgap/career/${encodeURIComponent(careerTitle)}`),
  getSkillGap: (careerTitle) => api.get(`/skillgap/career/${encodeURIComponent(careerTitle)}`),
  getUserSkillGaps: () => api.get('/skillgap'),
  deleteSkillGap: (id) => api.delete(`/skillgap/${id}`),
  generateLearningPath: (careerTitle) => api.post(`/skillgap/learning-path/career/${encodeURIComponent(careerTitle)}`),
  getLearningPath: (careerTitle) => api.get(`/skillgap/learning-path/career/${encodeURIComponent(careerTitle)}`),
  updateLearningItem: (careerTitle, itemIndex, completed) => api.put(`/skillgap/learning-path/career/${encodeURIComponent(careerTitle)}/item/${itemIndex}`, { completed }),
  getUserLearningPaths: () => api.get('/skillgap/learning-path'),
};

export const schoolAPI = {
  searchSchools: (filters) => api.get('/school/search', { params: filters }),
  getSchoolsByCategory: (category) => api.get(`/school/category/${encodeURIComponent(category)}`),
  getSchoolDetails: (id) => api.get(`/school/details/${id}`),
  getStates: () => api.get('/school/states'),
  getCitiesByState: (state) => api.get(`/school/states/${encodeURIComponent(state)}/cities`),
  getFilterOptions: () => api.get('/school/filters'),
  saveSchool: (schoolId) => api.post(`/school/save/${schoolId}`),
  getSavedSchools: () => api.get('/school/saved'),
  removeSavedSchool: (schoolId) => api.delete(`/school/saved/${schoolId}`),
  compareSchools: (schoolIds) => api.post('/school/compare', { schoolIds }),
};

export const govtResidentialSchoolAPI = {
  searchSchools: (filters) => api.get('/govt-residential-school/search', { params: filters }),
  getSchoolsByCategory: (category) => api.get(`/govt-residential-school/category/${encodeURIComponent(category)}`),
  getSchoolDetails: (id) => api.get(`/govt-residential-school/details/${id}`),
  getStates: () => api.get('/govt-residential-school/states'),
  getDistrictsByState: (state) => api.get(`/govt-residential-school/states/${encodeURIComponent(state)}/districts`),
  getFilterOptions: () => api.get('/govt-residential-school/filters'),
};

export const collegeAPI = {
  searchColleges: (filters) => api.get('/college/search', { params: filters }),
  getCollegesByCareer: (careerTitle) => api.get(`/college/career/${encodeURIComponent(careerTitle)}`),
  getCollegesByStream: (stream) => api.get(`/college/stream/${encodeURIComponent(stream)}`),
  getCollegeDetails: (id) => api.get(`/college/details/${id}`),
  getStates: () => api.get('/college/states'),
  getCitiesByState: (state) => api.get(`/college/states/${encodeURIComponent(state)}/cities`),
  getFilterOptions: () => api.get('/college/filters'),
  saveCollege: (collegeId) => api.post(`/college/save/${collegeId}`),
  getSavedColleges: () => api.get('/college/saved'),
  removeSavedCollege: (collegeId) => api.delete(`/college/saved/${collegeId}`),
  compareColleges: (collegeIds) => api.post('/college/compare', { collegeIds }),
};

export const courseAPI = {
  searchCourses: (filters) => api.get('/course/search', { params: filters }),
  getCoursesByCareer: (careerTitle) => api.get(`/course/career/${encodeURIComponent(careerTitle)}`),
  getCoursesByDuration: (duration) => api.get(`/course/duration/${encodeURIComponent(duration)}`),
  getCoursesByEntranceExam: (exam) => api.get(`/course/entrance-exam/${encodeURIComponent(exam)}`),
  getCourseDetails: (id) => api.get(`/course/details/${id}`),
  getDurations: () => api.get('/course/durations'),
  getCareers: () => api.get('/course/careers'),
  getEntranceExams: () => api.get('/course/entrance-exams'),
  getColleges: () => api.get('/course/colleges'),
  getFilterOptions: () => api.get('/course/filters'),
  saveCourse: (courseId) => api.post(`/course/save/${courseId}`),
  getSavedCourses: () => api.get('/course/saved'),
  removeSavedCourse: (courseId) => api.delete(`/course/saved/${courseId}`),
  compareCourses: (courseIds) => api.post('/course/compare', { courseIds }),
};

export const entranceExamAPI = {
  searchEntranceExams: (filters) => api.get('/entrance-exam/search', { params: filters }),
  getEntranceExamsByCourse: (courseName) => api.get(`/entrance-exam/course/${encodeURIComponent(courseName)}`),
  getEntranceExamsBySubject: (subject) => api.get(`/entrance-exam/subject/${encodeURIComponent(subject)}`),
  getEntranceExamsByCollege: (collegeName) => api.get(`/entrance-exam/college/${encodeURIComponent(collegeName)}`),
  getEntranceExamsByCareer: (careerTitle) => api.get(`/entrance-exam/career/${encodeURIComponent(careerTitle)}`),
  getEntranceExamDetails: (id) => api.get(`/entrance-exam/details/${id}`),
  getAllEntranceExams: () => api.get('/entrance-exam/all'),
  getSubjects: () => api.get('/entrance-exam/subjects'),
  getCourses: () => api.get('/entrance-exam/courses'),
  getColleges: () => api.get('/entrance-exam/colleges'),
  getFilterOptions: () => api.get('/entrance-exam/filters'),
};

export const scholarshipAPI = {
  searchScholarships: (filters) => api.get('/scholarship/search', { params: filters }),
  getScholarshipsByCourse: (course) => api.get(`/scholarship/course/${encodeURIComponent(course)}`),
  getScholarshipsByState: (state) => api.get(`/scholarship/state/${encodeURIComponent(state)}`),
  getScholarshipsByCategory: (category) => api.get(`/scholarship/category/${encodeURIComponent(category)}`),
  getScholarshipDetails: (id) => api.get(`/scholarship/details/${id}`),
  getFilterOptions: () => api.get('/scholarship/filters'),
};

export const aisheAPI = {
  getCollegeStatistics: (state) => {
    const params = state ? { state } : {};
    return api.get('/aishe/colleges', { params });
  },
  getProgrammeStatistics: (discipline) => {
    const params = discipline ? { discipline } : {};
    return api.get('/aishe/programme-statistics', { params });
  },
};

export default api;
