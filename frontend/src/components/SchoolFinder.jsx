import React, { useState, useEffect } from 'react';
import { schoolAPI } from '../services/api';

export default function SchoolFinder() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [savedSchools, setSavedSchools] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    city: '',
    board: '',
    schoolType: '',
    budget: '',
    hostelAvailable: ''
  });
  
  // Available options
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    cities: [],
    boards: [],
    schoolTypes: [],
    feeRanges: [],
    categories: []
  });

  const [activeCategory, setActiveCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadFilterOptions();
    loadSavedSchools();
    loadAllSchools();
  }, []);

  useEffect(() => {
    if (filters.state) {
      loadCitiesForState(filters.state);
    }
  }, [filters.state]);

  const loadFilterOptions = async () => {
    try {
      const { data } = await schoolAPI.getFilterOptions();
      setFilterOptions(data);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  const loadSavedSchools = async () => {
    try {
      const { data } = await schoolAPI.getSavedSchools();
      setSavedSchools(data.savedSchools || []);
    } catch (err) {
      // If not authenticated, just set empty array
      setSavedSchools([]);
    }
  };

  const loadAllSchools = async () => {
    setLoading(true);
    try {
      const { data } = await schoolAPI.searchSchools({});
      setSchools(data.schools || []);
    } catch (err) {
      setError('Unable to load schools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadCitiesForState = async (state) => {
    try {
      const { data } = await schoolAPI.getCitiesByState(state);
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
      const { data } = await schoolAPI.searchSchools(filters);
      setSchools(data.schools || []);
      setActiveCategory('');
    } catch (err) {
      setError('Unable to search schools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    setLoading(true);
    setError('');
    setActiveCategory(category);
    try {
      const { data } = await schoolAPI.getSchoolsByCategory(category);
      setSchools(data.schools || []);
      // Reset filters when using category
      setFilters({
        search: '',
        state: '',
        city: '',
        board: '',
        schoolType: '',
        budget: '',
        hostelAvailable: ''
      });
    } catch (err) {
      setError('Unable to load schools for this category. Please try again.');
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
      board: '',
      schoolType: '',
      budget: '',
      hostelAvailable: ''
    });
    setActiveCategory('');
    loadAllSchools();
  };

  const handleSchoolClick = async (schoolId) => {
    try {
      const { data } = await schoolAPI.getSchoolDetails(schoolId);
      setSelectedSchool(data);
    } catch (err) {
      setError('Unable to load school details. Please try again.');
    }
  };

  const handleSaveSchool = async (schoolId) => {
    try {
      await schoolAPI.saveSchool(schoolId);
      await loadSavedSchools();
      alert('School saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to save school. Please try again.');
    }
  };

  const handleRemoveSavedSchool = async (schoolId) => {
    try {
      await schoolAPI.removeSavedSchool(schoolId);
      await loadSavedSchools();
      alert('School removed from saved list.');
    } catch (err) {
      alert('Unable to remove school. Please try again.');
    }
  };

  const handleCompareToggle = (schoolId) => {
    if (selectedForCompare.includes(schoolId)) {
      setSelectedForCompare(prev => prev.filter(id => id !== schoolId));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare up to 4 schools at a time.');
        return;
      }
      setSelectedForCompare(prev => [...prev, schoolId]);
    }
  };

  const handleCompare = async () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 schools to compare.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await schoolAPI.compareSchools(selectedForCompare);
      setComparisonData(data);
      setCompareMode(true);
    } catch (err) {
      setError('Unable to compare schools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSchoolSaved = (schoolId) => {
    return savedSchools.some(saved => saved.schoolId === schoolId);
  };

  const formatFee = (fee) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(fee);
  };

  const getSchoolTypeColor = (type) => {
    const colors = {
      'government': '#16a34a',
      'private': '#4f46e5',
      'boarding': '#dc2626',
      'residential': '#9333ea'
    };
    return colors[type] || '#6b7280';
  };

  const getBoardColor = (board) => {
    const colors = {
      'cbse': '#0891b2',
      'icse': '#c026d3',
      'state': '#65a30d'
    };
    return colors[board] || '#6b7280';
  };

  if (loading && !selectedSchool) {
    return (
      <div className="school-finder">
        <div className="loading-state">
          <p>Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="school-finder">
      <div className="school-finder-header">
        <h1>School Finder</h1>
        <p>Find the perfect school for your educational journey</p>
      </div>

      {/* Categories */}
      <div className="categories-section">
        <h3>Browse by Category</h3>
        <div className="categories-grid">
          {filterOptions.categories.map(category => (
            <button
              key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
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
            placeholder="Search schools by name, city, or state..."
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
                <label>Board</label>
                <select
                  name="board"
                  value={filters.board}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Boards</option>
                  {filterOptions.boards.map(board => (
                    <option key={board} value={board}>{board.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>School Type</label>
                <select
                  name="schoolType"
                  value={filters.schoolType}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  {filterOptions.schoolTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Budget (Annual Fee)</label>
                <select
                  name="budget"
                  value={filters.budget}
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
            <span>{selectedForCompare.length} school(s) selected for comparison</span>
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
            <h2>School Comparison</h2>
            <button onClick={() => setCompareMode(false)} className="btn-secondary">
              Back to Results
            </button>
          </div>
          <div className="comparison-table">
            <div className="comparison-row header">
              <div className="comparison-cell label">Feature</div>
              {comparisonData.schools.map(school => (
                <div key={school.id} className="comparison-cell school-name">
                  {school.name}
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
              <div className="comparison-cell label">Student-Teacher Ratio</div>
              {comparisonData.comparison.studentTeacherRatio.map((item, index) => (
                <div key={index} className="comparison-cell">
                  {item.ratio}:1
                </div>
              ))}
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Board</div>
              {comparisonData.comparison.boards.map((item, index) => (
                <div key={index} className="comparison-cell">
                  <span 
                    className="board-badge"
                    style={{ backgroundColor: getBoardColor(item.board) }}
                  >
                    {item.board.toUpperCase()}
                  </span>
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

      {/* Schools Grid */}
      {!compareMode && (
        <div className="schools-section">
          <div className="schools-header">
            <h3>
              {activeCategory ? `${activeCategory}s` : 'All Schools'}
              <span className="results-count">({schools.length} results)</span>
            </h3>
          </div>

          {schools.length === 0 ? (
            <div className="empty-state">
              <p>No schools found matching your criteria.</p>
              <button onClick={handleClearFilters} className="btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="schools-grid">
              {schools.map(school => (
                <div key={school.id} className="school-card">
                  <div className="school-card-header">
                    <h4>{school.name}</h4>
                    <div className="school-badges">
                      <span 
                        className="school-type-badge"
                        style={{ backgroundColor: getSchoolTypeColor(school.schoolType) }}
                      >
                        {school.schoolType.charAt(0).toUpperCase() + school.schoolType.slice(1)}
                      </span>
                      <span 
                        className="board-badge"
                        style={{ backgroundColor: getBoardColor(school.board) }}
                      >
                        {school.board.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="school-location">
                    <span>📍 {school.city}, {school.state}</span>
                  </div>

                  <div className="school-stats">
                    <div className="stat-item">
                      <span className="stat-label">Rating:</span>
                      <span className="stat-value rating">{school.rating} ★</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Fee:</span>
                      <span className="stat-value">{formatFee(school.annualFee)}/year</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Students:</span>
                      <span className="stat-value">{school.studentCount}</span>
                    </div>
                  </div>

                  <div className="school-facilities-preview">
                    {school.facilities.slice(0, 3).map((facility, index) => (
                      <span key={index} className="facility-tag-mini">
                        {facility}
                      </span>
                    ))}
                    {school.facilities.length > 3 && (
                      <span className="more-facilities">+{school.facilities.length - 3} more</span>
                    )}
                  </div>

                  <div className="school-card-actions">
                    <button 
                      onClick={() => handleSchoolClick(school.id)}
                      className="btn-primary view-details"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleCompareToggle(school.id)}
                      className={`btn-secondary compare-btn ${selectedForCompare.includes(school.id) ? 'selected' : ''}`}
                    >
                      {selectedForCompare.includes(school.id) ? '✓ Selected' : 'Compare'}
                    </button>
                    <button 
                      onClick={() => isSchoolSaved(school.id) ? handleRemoveSavedSchool(school.id) : handleSaveSchool(school.id)}
                      className={`btn-secondary save-btn ${isSchoolSaved(school.id) ? 'saved' : ''}`}
                    >
                      {isSchoolSaved(school.id) ? '♥ Saved' : '♡ Save'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* School Details Modal */}
      {selectedSchool && (
        <div className="modal-overlay" onClick={() => setSelectedSchool(null)}>
          <div className="modal-content school-details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedSchool.name}</h2>
              <button onClick={() => setSelectedSchool(null)} className="close-button">
                ✕
              </button>
            </div>

            <div className="school-details-content">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{selectedSchool.city}, {selectedSchool.state}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Board:</span>
                    <span className="detail-value board-badge" style={{ backgroundColor: getBoardColor(selectedSchool.board) }}>
                      {selectedSchool.board.toUpperCase()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value school-type-badge" style={{ backgroundColor: getSchoolTypeColor(selectedSchool.schoolType) }}>
                      {selectedSchool.schoolType.charAt(0).toUpperCase() + selectedSchool.schoolType.slice(1)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Grades:</span>
                    <span className="detail-value">{selectedSchool.grades}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Rating:</span>
                    <span className="detail-value rating-badge">{selectedSchool.rating} ★</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Annual Fee:</span>
                    <span className="detail-value">{formatFee(selectedSchool.annualFee)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Description</h3>
                <p className="description-text">{selectedSchool.description}</p>
              </div>

              <div className="detail-section">
                <h3>Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-box">
                    <span className="stat-number">{selectedSchool.studentCount}</span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">{selectedSchool.facultyCount}</span>
                    <span className="stat-label">Teachers</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">{(selectedSchool.studentCount / selectedSchool.facultyCount).toFixed(1)}:1</span>
                    <span className="stat-label">Student-Teacher Ratio</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Facilities</h3>
                <div className="facilities-grid">
                  {selectedSchool.facilities.map((facility, index) => (
                    <span key={index} className="facility-tag">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Contact Information</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-label">📞 Phone:</span>
                    <span className="contact-value">{selectedSchool.contact.phone}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">📧 Email:</span>
                    <span className="contact-value">{selectedSchool.contact.email}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">📍 Address:</span>
                    <span className="contact-value">{selectedSchool.contact.address}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">🌐 Website:</span>
                    <a href={selectedSchool.website} target="_blank" rel="noopener noreferrer" className="contact-value link">
                      {selectedSchool.website}
                    </a>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  onClick={() => isSchoolSaved(selectedSchool.id) ? handleRemoveSavedSchool(selectedSchool.id) : handleSaveSchool(selectedSchool.id)}
                  className={`btn-primary ${isSchoolSaved(selectedSchool.id) ? 'saved' : ''}`}
                >
                  {isSchoolSaved(selectedSchool.id) ? '♥ Remove from Saved' : '♡ Save School'}
                </button>
                <button 
                  onClick={() => {
                    setSelectedSchool(null);
                    handleCompareToggle(selectedSchool.id);
                  }}
                  className="btn-secondary"
                >
                  Add to Comparison
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}