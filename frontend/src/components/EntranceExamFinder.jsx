import React, { useState, useEffect } from 'react';
import { entranceExamAPI } from '../services/api';

export default function EntranceExamFinder() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    course: '',
    college: ''
  });
  
  // Available options
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    courses: [],
    colleges: []
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadFilterOptions();
    loadAllExams();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const { data } = await entranceExamAPI.getFilterOptions();
      setFilterOptions(data);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  const loadAllExams = async () => {
    setLoading(true);
    try {
      const { data } = await entranceExamAPI.getAllEntranceExams();
      setExams(data.exams || []);
    } catch (err) {
      setError('Unable to load entrance exams. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await entranceExamAPI.searchEntranceExams(filters);
      setExams(data.exams || []);
    } catch (err) {
      setError('Unable to search entrance exams. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      subject: '',
      course: '',
      college: ''
    });
    loadAllExams();
  };

  const handleExamClick = async (examId) => {
    try {
      const { data } = await entranceExamAPI.getEntranceExamDetails(examId);
      setSelectedExam(data);
    } catch (err) {
      setError('Unable to load exam details. Please try again.');
    }
  };

  const getExamColor = (examName) => {
    if (examName.includes('JEE')) return '#dc2626';
    if (examName.includes('NEET')) return '#16a34a';
    if (examName.includes('CUET')) return '#2563eb';
    if (examName.includes('NDA') || examName.includes('CDS')) return '#9333ea';
    if (examName.includes('CAT')) return '#ea580c';
    if (examName.includes('GATE')) return '#0891b2';
    if (examName.includes('MHT')) return '#ca8a04';
    return '#6b7280';
  };

  if (loading && !selectedExam) {
    return (
      <div className="entrance-exam-finder">
        <div className="loading-state">
          <p>Loading entrance exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="entrance-exam-finder">
      <div className="entrance-exam-finder-header">
        <h1>Entrance Exam Guidance</h1>
        <p>Explore entrance exams for your desired courses and careers</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-bar">
          <input
            type="text"
            name="search"
            placeholder="Search exams by name, subject, course, or college..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
          <button onClick={handleSearch} className="btn-primary search-button">
            Search
          </button>
        </div>

        <button 
          className="toggle-filters-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showFilters && (
          <div className="filters-container">
            <div className="filter-row">
              <div className="filter-group">
                <label>Subject</label>
                <select
                  name="subject"
                  value={filters.subject}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Subjects</option>
                  {filterOptions.subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Course</label>
                <select
                  name="course"
                  value={filters.course}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Courses</option>
                  {filterOptions.courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>College</label>
                <select
                  name="college"
                  value={filters.college}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Colleges</option>
                  {filterOptions.colleges.map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <button onClick={handleSearch} className="btn-primary">Apply Filters</button>
              <button onClick={handleClearFilters} className="btn-secondary">Clear All</button>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p className="error">{error}</p>
        </div>
      )}

      {/* Exams Grid */}
      <div className="exams-section">
        <div className="exams-header">
          <h3>
            All Entrance Exams
            <span className="results-count">({exams.length} results)</span>
          </h3>
        </div>

        {exams.length === 0 ? (
          <div className="empty-state">
            <p>No entrance exams found matching your criteria.</p>
            <button onClick={handleClearFilters} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="exams-grid">
            {exams.map(exam => (
              <div key={exam.id} className="exam-card">
                <div className="exam-card-header">
                  <h4>{exam.name}</h4>
                  <div className="exam-badges">
                    <span 
                      className="exam-badge"
                      style={{ backgroundColor: getExamColor(exam.name) }}
                    >
                      {exam.name}
                    </span>
                  </div>
                </div>

                <div className="exam-full-name">
                  <span>{exam.fullName}</span>
                </div>

                <div className="exam-purpose">
                  <span>📋 {exam.purpose.substring(0, 120)}...</span>
                </div>

                <div className="exam-subjects-preview">
                  <div className="subject-tags">
                    {exam.subjects.slice(0, 3).map((subject, index) => (
                      <span key={index} className="subject-tag">
                        {subject}
                      </span>
                    ))}
                    {exam.subjects.length > 3 && (
                      <span className="more-indicator">+{exam.subjects.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="exam-card-actions">
                  <button 
                    onClick={() => handleExamClick(exam.id)}
                    className="btn-primary view-details-button"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exam Details Modal */}
      {selectedExam && (
        <div className="modal-overlay" onClick={() => setSelectedExam(null)}>
          <div className="modal-content exam-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedExam.name}</h2>
              <button 
                onClick={() => setSelectedExam(null)}
                className="close-button"
              >
                ✕
              </button>
            </div>

            <div className="exam-details-body">
              <div className="detail-section">
                <h3>Full Name</h3>
                <p>{selectedExam.fullName}</p>
              </div>

              <div className="detail-section">
                <h3>Purpose</h3>
                <p>{selectedExam.purpose}</p>
              </div>

              <div className="detail-section">
                <h3>Eligibility</h3>
                <p>{selectedExam.eligibility}</p>
              </div>

              <div className="detail-section">
                <h3>Subjects</h3>
                <div className="subjects-list">
                  {selectedExam.subjects.map((subject, index) => (
                    <span key={index} className="subject-tag">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Exam Pattern</h3>
                <div className="exam-pattern-details">
                  <div className="pattern-item">
                    <span className="pattern-label">Mode:</span>
                    <span className="pattern-value">{selectedExam.examPattern.mode}</span>
                  </div>
                  <div className="pattern-item">
                    <span className="pattern-label">Duration:</span>
                    <span className="pattern-value">{selectedExam.examPattern.duration}</span>
                  </div>
                  <div className="pattern-item">
                    <span className="pattern-label">Total Marks:</span>
                    <span className="pattern-value">{selectedExam.examPattern.totalMarks}</span>
                  </div>
                  <div className="pattern-item">
                    <span className="pattern-label">Question Types:</span>
                    <div className="question-types">
                      {selectedExam.examPattern.questionTypes.map((type, index) => (
                        <span key={index} className="question-type-tag">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pattern-item">
                    <span className="pattern-label">Marking Scheme:</span>
                    <span className="pattern-value">{selectedExam.examPattern.markingScheme}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Preparation Roadmap</h3>
                <div className="preparation-roadmap">
                  <ol>
                    {selectedExam.preparationRoadmap.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="detail-section">
                <h3>Related Courses</h3>
                <div className="courses-list">
                  {selectedExam.relatedCourses.map((course, index) => (
                    <span key={index} className="course-tag">
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Related Colleges</h3>
                <div className="colleges-list">
                  {selectedExam.relatedColleges.map((college, index) => (
                    <span key={index} className="college-tag">
                      {college}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}