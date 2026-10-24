import React, { useState, useEffect } from 'react';
import { courseAPI, aisheAPI } from '../services/api';

export default function CourseFinder() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);

  // AISHE statistics state
  const [aisheData, setAisheData] = useState(null);
  const [aisheLoading, setAisheLoading] = useState(false);
  const [aisheError, setAisheError] = useState('');
  const [aisheDiscipline, setAisheDiscipline] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    duration: '',
    career: '',
    entranceExam: '',
    college: '',
    skill: ''
  });
  
  // Available options
  const [filterOptions, setFilterOptions] = useState({
    durations: [],
    careers: [],
    entranceExams: [],
    colleges: [],
    skills: []
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadFilterOptions();
    loadSavedCourses();
    loadAllCourses();
    loadAisheStatistics();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const { data } = await courseAPI.getFilterOptions();
      setFilterOptions(data);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  const loadSavedCourses = async () => {
    try {
      const { data } = await courseAPI.getSavedCourses();
      setSavedCourses(data.savedCourses || []);
    } catch (err) {
      // If not authenticated, just set empty array
      setSavedCourses([]);
    }
  };

  const loadAllCourses = async () => {
    setLoading(true);
    try {
      const { data } = await courseAPI.searchCourses({});
      setCourses(data.courses || []);
    } catch (err) {
      setError('Unable to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadAisheStatistics = async (discipline = '') => {
    setAisheLoading(true);
    setAisheError('');
    try {
      const { data } = await aisheAPI.getProgrammeStatistics(discipline);
      if (data.success) {
        setAisheData(data);
      } else {
        setAisheError('Unable to load AISHE statistics.');
      }
    } catch (err) {
      console.error('Error loading AISHE statistics:', err);
      setAisheError('Unable to load AISHE statistics.');
    } finally {
      setAisheLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await courseAPI.searchCourses(filters);
      setCourses(data.courses || []);
    } catch (err) {
      setError('Unable to search courses. Please try again.');
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
      duration: '',
      career: '',
      entranceExam: '',
      college: '',
      skill: ''
    });
    loadAllCourses();
  };

  const handleCourseClick = async (courseId) => {
    try {
      const { data } = await courseAPI.getCourseDetails(courseId);
      setSelectedCourse(data);
    } catch (err) {
      setError('Unable to load course details. Please try again.');
    }
  };

  const handleSaveCourse = async (courseId) => {
    try {
      await courseAPI.saveCourse(courseId);
      await loadSavedCourses();
      alert('Course saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to save course. Please try again.');
    }
  };

  const handleRemoveSavedCourse = async (courseId) => {
    try {
      await courseAPI.removeSavedCourse(courseId);
      await loadSavedCourses();
      alert('Course removed from saved list.');
    } catch (err) {
      alert('Unable to remove course. Please try again.');
    }
  };

  const handleCompareToggle = (courseId) => {
    if (selectedForCompare.includes(courseId)) {
      setSelectedForCompare(prev => prev.filter(id => id !== courseId));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare up to 4 courses at a time.');
        return;
      }
      setSelectedForCompare(prev => [...prev, courseId]);
    }
  };

  const handleCompare = async () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 courses to compare.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await courseAPI.compareCourses(selectedForCompare);
      setComparisonData(data);
      setCompareMode(true);
    } catch (err) {
      setError('Unable to compare courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isCourseSaved = (courseId) => {
    return savedCourses.some(saved => saved.courseId === courseId);
  };

  const getDurationColor = (duration) => {
    if (duration.includes('4')) return '#0891b2';
    if (duration.includes('3')) return '#8b5cf6';
    if (duration.includes('2')) return '#eab308';
    if (duration.includes('5')) return '#dc2626';
    return '#6b7280';
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return Number(value).toLocaleString('en-IN');
  };

  if (loading && !selectedCourse) {
    return (
      <div className="course-finder">
        <div className="loading-state">
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-finder">
      <div className="course-finder-header">
        <h1>Course Finder</h1>
        <p>Explore courses that match your career goals and interests</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-bar">
          <input
            type="text"
            name="search"
            placeholder="Search courses by name, subject, career, or entrance exam..."
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
                <label>Duration</label>
                <select
                  name="duration"
                  value={filters.duration}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Durations</option>
                  {filterOptions.durations.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Career</label>
                <select
                  name="career"
                  value={filters.career}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Careers</option>
                  {filterOptions.careers.map(career => (
                    <option key={career} value={career}>{career}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Entrance Exam</label>
                <select
                  name="entranceExam"
                  value={filters.entranceExam}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Exams</option>
                  {filterOptions.entranceExams.map(exam => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-row">
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

              <div className="filter-group">
                <label>Skill</label>
                <select
                  name="skill"
                  value={filters.skill}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Skills</option>
                  {filterOptions.skills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
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

      {/* Compare Section */}
      {selectedForCompare.length > 0 && (
        <div className="compare-bar">
          <div className="compare-info">
            <span>{selectedForCompare.length} course(s) selected for comparison</span>
          </div>
          <div className="compare-actions">
            <button 
              onClick={handleCompare}
              className="btn-primary"
              disabled={selectedForCompare.length < 2}
            >
              Compare Now
            </button>
            <button 
              onClick={() => setSelectedForCompare([])}
              className="btn-secondary"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p className="error">{error}</p>
        </div>
      )}

      {/* Comparison View */}
      {compareMode && comparisonData && (
        <div className="comparison-view">
          <div className="comparison-header">
            <h2>Course Comparison</h2>
            <button onClick={() => setCompareMode(false)} className="btn-secondary">
              Back to Results
            </button>
          </div>
          <div className="comparison-table">
            <div className="comparison-row header">
              <div className="comparison-cell label">Feature</div>
              {comparisonData.courses.map(course => (
                <div key={course.id} className="comparison-cell course-name">
                  {course.name}
                </div>
              ))}
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Duration</div>
              {comparisonData.comparison.duration.map((item, index) => (
                <div key={index} className="comparison-cell">
                  <span className="duration-badge" style={{ backgroundColor: getDurationColor(item.duration) }}>
                    {item.duration}
                  </span>
                </div>
              ))}
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Eligibility</div>
              {comparisonData.comparison.eligibility.map((item, index) => (
                <div key={index} className="comparison-cell eligibility-cell">
                  {item.eligibility}
                </div>
              ))}
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Required Skills</div>
              {comparisonData.comparison.skills.map((item, index) => (
                <div key={index} className="comparison-cell">
                  <div className="skills-list">
                    {item.skills.map((skill, sIndex) => (
                      <span key={sIndex} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Related Careers</div>
              {comparisonData.comparison.careers.map((item, index) => (
                <div key={index} className="comparison-cell">
                  <div className="careers-list">
                    {item.careers.map((career, cIndex) => (
                      <span key={cIndex} className="career-tag">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Entrance Exams</div>
              {comparisonData.comparison.entranceExams.map((item, index) => (
                <div key={index} className="comparison-cell">
                  <div className="exams-list">
                    {item.exams.map((exam, eIndex) => (
                      <span key={eIndex} className="exam-tag">
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Colleges</div>
              {comparisonData.comparison.colleges.map((item, index) => (
                <div key={index} className="comparison-cell">
                  <div className="colleges-list">
                    {item.colleges.slice(0, 5).map((college, cIndex) => (
                      <span key={cIndex} className="college-tag">
                        {college}
                      </span>
                    ))}
                    {item.colleges.length > 5 && (
                      <span className="more-indicator">+{item.colleges.length - 5} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {!compareMode && (
        <div className="courses-section">
          <div className="courses-header">
            <h3>
              All Courses
              <span className="results-count">({courses.length} results)</span>
            </h3>
          </div>

          {courses.length === 0 ? (
            <div className="empty-state">
              <p>No courses found matching your criteria.</p>
              <button onClick={handleClearFilters} className="btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-card-header">
                    <h4>{course.name}</h4>
                    <div className="course-badges">
                      <span 
                        className="duration-badge"
                        style={{ backgroundColor: getDurationColor(course.duration) }}
                      >
                        {course.duration}
                      </span>
                    </div>
                  </div>

                  <div className="course-eligibility">
                    <span>📚 {course.eligibility.substring(0, 80)}...</span>
                  </div>

                  <div className="course-subjects-preview">
                    <div className="subject-tags">
                      {course.subjects.slice(0, 3).map((subject, index) => (
                        <span key={index} className="subject-tag">
                          {subject}
                        </span>
                      ))}
                      {course.subjects.length > 3 && (
                        <span className="more-indicator">+{course.subjects.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="course-careers-preview">
                    <div className="career-tags">
                      {course.relatedCareers.slice(0, 2).map((career, index) => (
                        <span key={index} className="career-tag-small">
                          {career}
                        </span>
                      ))}
                      {course.relatedCareers.length > 2 && (
                        <span className="more-indicator">+{course.relatedCareers.length - 2}</span>
                      )}
                    </div>
                  </div>

                  <div className="course-card-actions">
                    <button 
                      onClick={() => handleCourseClick(course.id)}
                      className="btn-primary view-details-button"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleCompareToggle(course.id)}
                      className={`btn-secondary compare-button ${selectedForCompare.includes(course.id) ? 'selected' : ''}`}
                    >
                      {selectedForCompare.includes(course.id) ? '✓ Selected' : 'Compare'}
                    </button>
                    <button 
                      onClick={() => isCourseSaved(course.id) ? handleRemoveSavedCourse(course.id) : handleSaveCourse(course.id)}
                      className={`btn-secondary save-button ${isCourseSaved(course.id) ? 'saved' : ''}`}
                    >
                      {isCourseSaved(course.id) ? '♥ Saved' : '♡ Save'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AISHE 2023-24 Programme Statistics Section */}
      {!compareMode && (
        <div className="aishe-statistics-section">
          <div className="aishe-header">
            <h3>AISHE 2023-24 Programme Statistics</h3>
            <p className="aishe-subtitle">Programme and discipline statistics from All India Survey on Higher Education</p>
          </div>

          {/* AISHE Discipline Selector */}
          <div className="aishe-state-selector">
            <label htmlFor="aishe-discipline">Select Discipline</label>
            <select
              id="aishe-discipline"
              value={aisheDiscipline}
              onChange={(e) => {
                setAisheDiscipline(e.target.value);
                loadAisheStatistics(e.target.value);
              }}
              className="filter-select"
            >
              <option value="">All Disciplines</option>
              {aisheData && aisheData.disciplines && aisheData.disciplines.map(discipline => (
                <option key={discipline} value={discipline}>{discipline}</option>
              ))}
            </select>
          </div>

          {/* AISHE Loading */}
          {aisheLoading && (
            <div className="aishe-loading">
              <p>Loading AISHE statistics...</p>
            </div>
          )}

          {/* AISHE Error */}
          {!aisheLoading && aisheError && (
            <div className="aishe-error">
              <p>{aisheError}</p>
            </div>
          )}

          {/* AISHE Statistics Display */}
          {!aisheLoading && !aisheError && aisheData && aisheData.data && aisheData.data.length > 0 && (
            <div className="aishe-statistics-display">
              <div className="aishe-cards-grid">
                <div className="aishe-card">
                  <p className="aishe-card-label">Total Programmes</p>
                  <p className="aishe-card-value">{formatNumber(aisheData.totalProgrammes || aisheData.count)}</p>
                </div>

                <div className="aishe-card">
                  <p className="aishe-card-label">Disciplines</p>
                  <p className="aishe-card-value">{formatNumber(aisheData.disciplineCount)}</p>
                </div>

                <div className="aishe-card">
                  <p className="aishe-card-label">Academic Year</p>
                  <p className="aishe-card-value">{aisheData.academicYear}</p>
                </div>

                <div className="aishe-card">
                  <p className="aishe-card-label">Source</p>
                  <p className="aishe-card-value">AISHE</p>
                </div>
              </div>

              {/* All Programmes Table */}
              {aisheData.data.length > 0 && (
                <div className="aishe-table-container">
                  <table className="aishe-table">
                    <thead>
                      <tr>
                        <th>Programme Name</th>
                        <th>Academic Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aisheData.data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.programme_name}</td>
                          <td>{item.academic_year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Source */}
              <div className="aishe-source">
                <p>Source: All India Survey on Higher Education (AISHE), Academic Year {aisheData.academicYear}</p>
                <p>Showing {aisheData.data.length} of {aisheData.totalProgrammes || aisheData.count} programmes</p>
              </div>
            </div>
          )}

          {!aisheLoading && !aisheError && (!aisheData || !aisheData.data || aisheData.data.length === 0) && (
            <div className="aishe-no-data">
              <p>No AISHE programme statistics available.</p>
            </div>
          )}
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="modal-content course-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCourse.name}</h2>
              <button 
                onClick={() => setSelectedCourse(null)}
                className="close-button"
              >
                ✕
              </button>
            </div>

            <div className="course-details-body">
              <div className="detail-section">
                <h3>Duration</h3>
                <span className="duration-badge" style={{ backgroundColor: getDurationColor(selectedCourse.duration) }}>
                  {selectedCourse.duration}
                </span>
              </div>

              <div className="detail-section">
                <h3>Eligibility</h3>
                <p>{selectedCourse.eligibility}</p>
              </div>

              <div className="detail-section">
                <h3>Subjects</h3>
                <div className="subjects-list">
                  {selectedCourse.subjects.map((subject, index) => (
                    <span key={index} className="subject-tag">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Required Skills</h3>
                <div className="skills-list">
                  {selectedCourse.requiredSkills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Related Careers</h3>
                <div className="careers-list">
                  {selectedCourse.relatedCareers.map((career, index) => (
                    <span key={index} className="career-tag">
                      {career}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Entrance Exams</h3>
                <div className="exams-list">
                  {selectedCourse.entranceExams.map((exam, index) => (
                    <span key={index} className="exam-tag">
                      {exam}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Colleges Offering This Course</h3>
                <div className="colleges-list">
                  {selectedCourse.colleges.map((college, index) => (
                    <span key={index} className="college-tag">
                      {college}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Career Opportunities</h3>
                <p>{selectedCourse.careerOpportunities}</p>
              </div>

              <div className="modal-actions">
                <button 
                  onClick={() => isCourseSaved(selectedCourse.id) ? handleRemoveSavedCourse(selectedCourse.id) : handleSaveCourse(selectedCourse.id)}
                  className={`btn-primary ${isCourseSaved(selectedCourse.id) ? 'saved' : ''}`}
                >
                  {isCourseSaved(selectedCourse.id) ? '♥ Remove from Saved' : '♡ Save Course'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}