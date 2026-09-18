import React, { useState, useEffect } from 'react';
import { collegeAPI } from '../services/api';

export default function CollegeFinder() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [savedColleges, setSavedColleges] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    city: '',
    course: '',
    stream: '',
    collegeType: '',
    entranceExam: '',
    fees: '',
    hostelAvailable: ''
  });
  
  // Available options
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    cities: [],
    streams: [],
    collegeTypes: [],
    courses: [],
    entranceExams: [],
    feeRanges: []
  });

  const [activeStream, setActiveStream] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadFilterOptions();
    loadSavedColleges();
    loadAllColleges();
  }, []);

  useEffect(() => {
    if (filters.state) {
      loadCitiesForState(filters.state);
    }
  }, [filters.state]);

  const loadFilterOptions = async () => {
    try {
      const { data } = await collegeAPI.getFilterOptions();
      setFilterOptions(data);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  const loadSavedColleges = async () => {
    try {
      const { data } = await collegeAPI.getSavedColleges();
      setSavedColleges(data.savedColleges || []);
    } catch (err) {
      // If not authenticated, just set empty array
      setSavedColleges([]);
    }
  };

  const loadAllColleges = async () => {
    setLoading(true);
    try {
      const { data } = await collegeAPI.searchColleges({});
      setColleges(data.colleges || []);
    } catch (err) {
      setError('Unable to load colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadCitiesForState = async (state) => {
    try {
      const { data } = await collegeAPI.getCitiesByState(state);
      setFilterOptions(prev => ({ ...prev, cities: data.cities || [] }));
      setFilters(prev => ({ ...prev, city: '' }));
    } catch (err) {
      console.error('Error loading cities:', err);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await collegeAPI.searchColleges(filters);
      setColleges(data.colleges || []);
      setActiveStream('');
    } catch (err) {
      setError('Unable to search colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStreamClick = async (stream) => {
    setLoading(true);
    setError('');
    setActiveStream(stream);
    try {
      const { data } = await collegeAPI.getCollegesByStream(stream);
      setColleges(data.colleges || []);
      // Reset filters when using stream
      setFilters({
        search: '',
        state: '',
        city: '',
        course: '',
        stream: '',
        collegeType: '',
        entranceExam: '',
        fees: '',
        hostelAvailable: ''
      });
    } catch (err) {
      setError('Unable to load colleges for this stream. Please try again.');
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
      state: '',
      city: '',
      course: '',
      stream: '',
      collegeType: '',
      entranceExam: '',
      fees: '',
      hostelAvailable: ''
    });
    setActiveStream('');
    loadAllColleges();
  };

  const handleCollegeClick = async (collegeId) => {
    try {
      const { data } = await collegeAPI.getCollegeDetails(collegeId);
      setSelectedCollege(data);
    } catch (err) {
      setError('Unable to load college details. Please try again.');
    }
  };

  const handleSaveCollege = async (collegeId) => {
    try {
      await collegeAPI.saveCollege(collegeId);
      await loadSavedColleges();
      alert('College saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to save college. Please try again.');
    }
  };

  const handleRemoveSavedCollege = async (collegeId) => {
    try {
      await collegeAPI.removeSavedCollege(collegeId);
      await loadSavedColleges();
      alert('College removed from saved list.');
    } catch (err) {
      alert('Unable to remove college. Please try again.');
    }
  };

  const handleCompareToggle = (collegeId) => {
    if (selectedForCompare.includes(collegeId)) {
      setSelectedForCompare(prev => prev.filter(id => id !== collegeId));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare up to 4 colleges at a time.');
        return;
      }
      setSelectedForCompare(prev => [...prev, collegeId]);
    }
  };

  const handleCompare = async () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 colleges to compare.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await collegeAPI.compareColleges(selectedForCompare);
      setComparisonData(data);
      setCompareMode(true);
    } catch (err) {
      setError('Unable to compare colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isCollegeSaved = (collegeId) => {
    return savedColleges.some(saved => saved.collegeId === collegeId);
  };

  const formatFee = (fee) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(fee);
  };

  const getCollegeTypeColor = (type) => {
    const colors = {
      'Government': '#16a34a',
      'Private': '#4f46e5',
      'Government-Aided': '#dc2626'
    };
    return colors[type] || '#6b7280';
  };

  const getStreamColor = (stream) => {
    const colors = {
      'Engineering': '#0891b2',
      'Medical': '#c026d3',
      'Arts': '#65a30d',
      'Commerce': '#eab308',
      'Law': '#f97316',
      'Management': '#8b5cf6'
    };
    return colors[stream] || '#6b7280';
  };

  if (loading && !selectedCollege) {
    return (
      <div className="college-finder">
        <div className="loading-state">
          <p>Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="college-finder">
      <div className="college-finder-header">
        <h1>College Finder</h1>
        <p>Find the perfect college for your higher education journey</p>
      </div>

      {/* Streams */}
      <div className="streams-section">
        <h3>Browse by Stream</h3>
        <div className="streams-grid">
          {filterOptions.streams.map(stream => (
            <button
              key={stream}
              className={`stream-button ${activeStream === stream ? 'active' : ''}`}
              onClick={() => handleStreamClick(stream)}
            >
              {stream}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-bar">
          <input
            type="text"
            name="search"
            placeholder="Search colleges by name, city, state, or course..."
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
                <label>State</label>
                <select
                  name="state"
                  value={filters.state}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All States</option>
                  {filterOptions.states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>City</label>
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="filter-select"
                  disabled={!filters.state}
                >
                  <option value="">All Cities</option>
                  {filterOptions.cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Stream</label>
                <select
                  name="stream"
                  value={filters.stream}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Streams</option>
                  {filterOptions.streams.map(stream => (
                    <option key={stream} value={stream}>{stream}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-row">
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
                <label>College Type</label>
                <select
                  name="collegeType"
                  value={filters.collegeType}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  {filterOptions.collegeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
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
                <label>Budget (Annual Fee)</label>
                <select
                  name="fees"
                  value={filters.fees}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">Any Budget</option>
                  {filterOptions.feeRanges.map(range => (
                    <option key={range.min} value={range.max === Infinity ? '' : range.max}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Hostel</label>
                <select
                  name="hostelAvailable"
                  value={filters.hostelAvailable}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">Any</option>
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
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
            <span>{selectedForCompare.length} college(s) selected for comparison</span>
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
            <h2>College Comparison</h2>
            <button onClick={() => setCompareMode(false)} className="btn-secondary">
              Back to Results
            </button>
          </div>
          <div className="comparison-table">
            <div className="comparison-row header">
              <div className="comparison-cell label">Feature</div>
              {comparisonData.colleges.map(college => (
                <div key={college.id} className="comparison-cell college-name">
                  {college.name}
                </div>
              ))}
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Annual Fee</div>
              {comparisonData.comparison.fees.map((item, index) => (
                <div key={index} className="comparison-cell">
                  {formatFee(item.fee)}
                </div>
              ))}
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Rating</div>
              {comparisonData.comparison.ratings.map((item, index) => (
                <div key={index} className="comparison-cell">
                  <span className="rating-badge">{item.rating} ★</span>
                </div>
              ))}
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Placement Rate</div>
              {comparisonData.comparison.placement.map((item, index) => (
                <div key={index} className="comparison-cell">
                  {item.placementRate}%
                </div>
              ))}
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Hostel</div>
              {comparisonData.comparison.hostel.map((item, index) => (
                <div key={index} className="comparison-cell">
                  {item.hostel ? '✓ Available' : '✗ Not Available'}
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
              <div className="comparison-cell label">Facilities</div>
              {comparisonData.comparison.facilities.map((item, index) => (
                <div key={index} className="comparison-cell">
                  <div className="facilities-list">
                    {item.facilities.map((facility, fIndex) => (
                      <span key={fIndex} className="facility-tag">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Colleges Grid */}
      {!compareMode && (
        <div className="colleges-section">
          <div className="colleges-header">
            <h3>
              {activeStream ? `${activeStream} Colleges` : 'All Colleges'}
              <span className="results-count">({colleges.length} results)</span>
            </h3>
          </div>

          {colleges.length === 0 ? (
            <div className="empty-state">
              <p>No colleges found matching your criteria.</p>
              <button onClick={handleClearFilters} className="btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="colleges-grid">
              {colleges.map(college => (
                <div key={college.id} className="college-card">
                  <div className="college-card-header">
                    <h4>{college.name}</h4>
                    <div className="college-badges">
                      <span 
                        className="college-type-badge"
                        style={{ backgroundColor: getCollegeTypeColor(college.collegeType) }}
                      >
                        {college.collegeType}
                      </span>
                      <span 
                        className="stream-badge"
                        style={{ backgroundColor: getStreamColor(college.stream) }}
                      >
                        {college.stream}
                      </span>
                    </div>
                  </div>

                  <div className="college-location">
                    <span>📍 {college.city}, {college.state}</span>
                  </div>

                  <div className="college-stats">
                    <div className="stat-item">
                      <span className="stat-label">Rating:</span>
                      <span className="stat-value rating">{college.rating} ★</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Fee:</span>
                      <span className="stat-value">{formatFee(college.annualFee)}/year</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Placement:</span>
                      <span className="stat-value">{college.placementRate}%</span>
                    </div>
                  </div>

                  <div className="college-courses-preview">
                    {college.courses.slice(0, 2).map((course, index) => (
                      <span key={index} className="course-tag-mini">
                        {course}
                      </span>
                    ))}
                    {college.courses.length > 2 && (
                      <span className="more-courses">+{college.courses.length - 2} more</span>
                    )}
                  </div>

                  <div className="college-card-actions">
                    <button 
                      onClick={() => handleCollegeClick(college.id)}
                      className="btn-primary view-details"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleCompareToggle(college.id)}
                      className={`btn-secondary compare-btn ${selectedForCompare.includes(college.id) ? 'selected' : ''}`}
                    >
                      {selectedForCompare.includes(college.id) ? '✓ Selected' : 'Compare'}
                    </button>
                    <button 
                      onClick={() => isCollegeSaved(college.id) ? handleRemoveSavedCollege(college.id) : handleSaveCollege(college.id)}
                      className={`btn-secondary save-btn ${isCollegeSaved(college.id) ? 'saved' : ''}`}
                    >
                      {isCollegeSaved(college.id) ? '★ Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* College Details Modal */}
      {selectedCollege && (
        <div className="modal-overlay" onClick={() => setSelectedCollege(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCollege.name}</h2>
              <button onClick={() => setSelectedCollege(null)} className="close-modal">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Location</h3>
                <p>📍 {selectedCollege.city}, {selectedCollege.state}</p>
                <p>📧 {selectedCollege.contact.email}</p>
                <p>📞 {selectedCollege.contact.phone}</p>
                <p>🌐 <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer">{selectedCollege.website}</a></p>
              </div>

              <div className="detail-section">
                <h3>Stream & Type</h3>
                <div className="badges">
                  <span 
                    className="badge"
                    style={{ backgroundColor: getStreamColor(selectedCollege.stream) }}
                  >
                    {selectedCollege.stream}
                  </span>
                  <span 
                    className="badge"
                    style={{ backgroundColor: getCollegeTypeColor(selectedCollege.collegeType) }}
                  >
                    {selectedCollege.collegeType}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Courses Offered</h3>
                <div className="courses-list">
                  {selectedCollege.courses.map((course, index) => (
                    <span key={index} className="course-tag">
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Entrance Exams</h3>
                <div className="exams-list">
                  {selectedCollege.entranceExams.map((exam, index) => (
                    <span key={index} className="exam-tag">
                      {exam}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Fees & Charges</h3>
                <p><strong>Annual Fee:</strong> {formatFee(selectedCollege.annualFee)}</p>
                {selectedCollege.hostelAvailable && (
                  <p><strong>Hostel Fee:</strong> {formatFee(selectedCollege.hostelFee)}/year</p>
                )}
              </div>

              <div className="detail-section">
                <h3>Performance</h3>
                <p><strong>Rating:</strong> {selectedCollege.rating} ★</p>
                <p><strong>Placement Rate:</strong> {selectedCollege.placementRate}%</p>
              </div>

              <div className="detail-section">
                <h3>Facilities</h3>
                <div className="facilities-list">
                  {selectedCollege.facilities.map((facility, index) => (
                    <span key={index} className="facility-tag">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Admission Information</h3>
                <p>{selectedCollege.admissionInfo}</p>
              </div>

              <div className="detail-section">
                <h3>Hostel</h3>
                <p>{selectedCollege.hostelAvailable ? '✓ Hostel Available' : '✗ Hostel Not Available'}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => isCollegeSaved(selectedCollege.id) ? handleRemoveSavedCollege(selectedCollege.id) : handleSaveCollege(selectedCollege.id)}
                className={`btn-primary ${isCollegeSaved(selectedCollege.id) ? 'saved' : ''}`}
              >
                {isCollegeSaved(selectedCollege.id) ? '★ Saved' : 'Save College'}
              </button>
              <button onClick={() => setSelectedCollege(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
