import React, { useState, useEffect } from 'react';
import { govtResidentialSchoolAPI } from '../services/api';

export default function GovtResidentialSchoolFinder() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    state: '',
    district: '',
    gender: '',
    entranceExam: '',
    hostelAvailable: ''
  });
  
  // Available options
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    districts: [],
    categories: [],
    genders: [],
    entranceExams: []
  });

  const [activeCategory, setActiveCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadFilterOptions();
    loadAllSchools();
  }, []);

  useEffect(() => {
    if (filters.state) {
      loadDistrictsForState(filters.state);
    }
  }, [filters.state]);

  const loadFilterOptions = async () => {
    try {
      const { data } = await govtResidentialSchoolAPI.getFilterOptions();
      setFilterOptions(data);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  const loadAllSchools = async () => {
    setLoading(true);
    try {
      const { data } = await govtResidentialSchoolAPI.searchSchools({});
      setSchools(data.schools || []);
    } catch (err) {
      setError('Unable to load schools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadDistrictsForState = async (state) => {
    try {
      const { data } = await govtResidentialSchoolAPI.getDistrictsByState(state);
      setFilterOptions(prev => ({ ...prev, districts: data.districts || [] }));
      setFilters(prev => ({ ...prev, district: '' }));
    } catch (err) {
      console.error('Error loading districts:', err);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await govtResidentialSchoolAPI.searchSchools(filters);
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
      const { data } = await govtResidentialSchoolAPI.getSchoolsByCategory(category);
      setSchools(data.schools || []);
      // Reset filters when using category
      setFilters({
        search: '',
        category: '',
        state: '',
        district: '',
        gender: '',
        entranceExam: '',
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
      category: '',
      state: '',
      district: '',
      gender: '',
      entranceExam: '',
      hostelAvailable: ''
    });
    setActiveCategory('');
    loadAllSchools();
  };

  const handleSchoolClick = async (schoolId) => {
    try {
      const { data } = await govtResidentialSchoolAPI.getSchoolDetails(schoolId);
      setSelectedSchool(data);
    } catch (err) {
      setError('Unable to load school details. Please try again.');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Jawahar Navodaya Vidyalaya': '#0891b2',
      'Sainik School': '#dc2626',
      'Eklavya Model Residential School': '#9333ea',
      'Rashtriya Military School': '#16a34a',
      'Government Residential/Ashram School': '#ea580c'
    };
    return colors[category] || '#6b7280';
  };

  const getGenderColor = (gender) => {
    const colors = {
      'Co-educational': '#0891b2',
      'Boys Only': '#dc2626',
      'Girls Only': '#c026d3'
    };
    return colors[gender] || '#6b7280';
  };

  if (loading && !selectedSchool) {
    return (
      <div className="govt-residential-school-finder">
        <div className="loading-state">
          <p>Loading government residential schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="govt-residential-school-finder">
      <div className="school-finder-header">
        <h1>Government Residential School Finder</h1>
        <p>Find government residential schools, Navodaya Vidyalayas, Sainik Schools, and more</p>
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
            placeholder="Search schools by name, location, or district..."
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
                <label>Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

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
                <label>District</label>
                <select
                  name="district"
                  value={filters.district}
                  onChange={handleFilterChange}
                  className="filter-select"
                  disabled={!filters.state}
                >
                  <option value="">All Districts</option>
                  {filterOptions.districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All</option>
                  {filterOptions.genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
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

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p className="error">{error}</p>
        </div>
      )}

      {/* School Details Modal */}
      {selectedSchool && (
        <div className="school-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedSchool.name}</h2>
              <button 
                className="close-button"
                onClick={() => setSelectedSchool(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span 
                      className="detail-value category-badge"
                      style={{ backgroundColor: getCategoryColor(selectedSchool.category) }}
                    >
                      {selectedSchool.category}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{selectedSchool.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">State:</span>
                    <span className="detail-value">{selectedSchool.state}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">District:</span>
                    <span className="detail-value">{selectedSchool.district}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span 
                      className="detail-value gender-badge"
                      style={{ backgroundColor: getGenderColor(selectedSchool.gender) }}
                    >
                      {selectedSchool.gender}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Established:</span>
                    <span className="detail-value">{selectedSchool.established}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Eligibility</h3>
                <p className="detail-text">{selectedSchool.eligibility}</p>
              </div>

              <div className="detail-section">
                <h3>Admission Information</h3>
                <p className="detail-text">{selectedSchool.admissionInfo}</p>
              </div>

              <div className="detail-section">
                <h3>Entrance Exam</h3>
                <p className="detail-text">{selectedSchool.entranceExam}</p>
              </div>

              <div className="detail-section">
                <h3>Hostel Information</h3>
                <div className="detail-item">
                  <span className="detail-label">Hostel Available:</span>
                  <span className="detail-value">
                    {selectedSchool.hostelAvailable ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                {selectedSchool.hostelAvailable && (
                  <p className="detail-text">{selectedSchool.hostelInfo}</p>
                )}
              </div>

              <div className="detail-section">
                <h3>Fees</h3>
                <p className="detail-text">{selectedSchool.fees}</p>
              </div>

              <div className="detail-section">
                <h3>Facilities</h3>
                <div className="facilities-list">
                  {selectedSchool.facilities.map((facility, index) => (
                    <span key={index} className="facility-tag">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Official Information</h3>
                <p className="detail-text">{selectedSchool.officialInfo}</p>
                <div className="detail-item">
                  <span className="detail-label">Contact:</span>
                  <span className="detail-value">{selectedSchool.contact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schools Grid */}
      <div className="schools-section">
        <div className="schools-header">
          <h3>
            {activeCategory ? `${activeCategory}s` : 'All Government Residential Schools'}
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
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(school.category) }}
                    >
                      {school.category}
                    </span>
                    <span 
                      className="gender-badge"
                      style={{ backgroundColor: getGenderColor(school.gender) }}
                    >
                      {school.gender}
                    </span>
                  </div>
                </div>

                <div className="school-location">
                  <span>📍 {school.location}</span>
                </div>

                <div className="school-info">
                  <div className="info-item">
                    <span className="info-label">Entrance Exam:</span>
                    <span className="info-value">{school.entranceExam}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Hostel:</span>
                    <span className="info-value">
                      {school.hostelAvailable ? '✓ Available' : '✗ Not Available'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fees:</span>
                    <span className="info-value">{school.fees}</span>
                  </div>
                </div>

                <div className="school-card-actions">
                  <button 
                    onClick={() => handleSchoolClick(school.id)}
                    className="btn-primary view-details"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
