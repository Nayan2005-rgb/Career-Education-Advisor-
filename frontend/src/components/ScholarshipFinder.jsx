import React, { useState, useEffect } from 'react';
import { scholarshipAPI, authAPI } from '../services/api';

export default function ScholarshipFinder() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [eligibilityResults, setEligibilityResults] = useState({});
  const [user, setUser] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    educationLevel: '',
    state: '',
    course: '',
    category: '',
    providerType: '',
    incomeRange: ''
  });

  // Available options
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    educationLevels: [],
    categories: [],
    providerTypes: [],
    courses: [],
    incomeRanges: []
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadFilterOptions();
    loadSavedScholarships();
    loadUser();
    loadAllScholarships();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const { data } = await scholarshipAPI.getFilterOptions();
      setFilterOptions(data);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  const loadSavedScholarships = async () => {
    try {
      const { data } = await scholarshipAPI.getSavedScholarships();
      setSavedScholarships(data.savedScholarships || []);
    } catch (err) {
      setSavedScholarships([]);
    }
  };

  const loadUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      setUser(data);
    } catch (err) {
      setUser(null);
    }
  };

  const loadAllScholarships = async () => {
    setLoading(true);
    try {
      const { data } = await scholarshipAPI.searchScholarships({});
      setScholarships(data.scholarships || []);
    } catch (err) {
      setError('Unable to load scholarships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await scholarshipAPI.searchScholarships(filters);
      setScholarships(data.scholarships || []);
    } catch (err) {
      setError('Unable to search scholarships. Please try again.');
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
      educationLevel: '',
      state: '',
      course: '',
      category: '',
      providerType: '',
      incomeRange: ''
    });
    loadAllScholarships();
  };

  const handleScholarshipClick = async (scholarshipId) => {
    try {
      const { data } = await scholarshipAPI.getScholarshipDetails(scholarshipId);
      setSelectedScholarship(data);

      // Check eligibility if user is logged in
      if (user) {
        try {
          const eligibilityData = await scholarshipAPI.checkEligibility(scholarshipId);
          setEligibilityResults(prev => ({
            ...prev,
            [scholarshipId]: eligibilityData.data.eligibility
          }));
        } catch (err) {
          console.error('Error checking eligibility:', err);
        }
      }
    } catch (err) {
      setError('Unable to load scholarship details. Please try again.');
    }
  };

  const handleSaveScholarship = async (scholarshipId) => {
    try {
      await scholarshipAPI.saveScholarship(scholarshipId);
      await loadSavedScholarships();
      alert('Scholarship saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to save scholarship. Please try again.');
    }
  };

  const handleRemoveSavedScholarship = async (scholarshipId) => {
    try {
      await scholarshipAPI.removeSavedScholarship(scholarshipId);
      await loadSavedScholarships();
      alert('Scholarship removed from saved list.');
    } catch (err) {
      alert('Unable to remove scholarship. Please try again.');
    }
  };

  const isScholarshipSaved = (scholarshipId) => {
    return savedScholarships.some(saved => saved.scholarshipId === scholarshipId);
  };

  const getEligibilityColor = (result) => {
    switch (result) {
      case 'eligible':
        return '#16a34a';
      case 'potentially eligible':
        return '#ca8a04';
      case 'not eligible':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getProviderTypeColor = (type) => {
    const colors = {
      'Government': '#16a34a',
      'Private': '#4f46e5'
    };
    return colors[type] || '#6b7280';
  };

  const getDeadlineStatusColor = (status) => {
    const colors = {
      'open': '#16a34a',
      'closed': '#dc2626',
      'upcoming': '#ca8a04',
      'deadline unavailable': '#6b7280',
      'verification required': '#f97316'
    };
    return colors[status] || '#6b7280';
  };

  const getVerificationStatusColor = (status) => {
    const colors = {
      'verified': '#16a34a',
      'demo': '#dc2626',
      'requires verification': '#f97316'
    };
    return colors[status] || '#6b7280';
  };

  if (loading && !selectedScholarship) {
    return (
      <div className="scholarship-finder">
        <div className="loading-state">
          <p>Loading scholarships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scholarship-finder">
      <div className="scholarship-finder-header">
        <h1>Scholarship Finder</h1>
        <p>Discover scholarships that match your education profile</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-bar">
          <input
            type="text"
            name="search"
            placeholder="Search scholarships by name, provider, or eligibility..."
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
                <label>Education Level</label>
                <select
                  name="educationLevel"
                  value={filters.educationLevel}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Levels</option>
                  {filterOptions.educationLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
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
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Provider Type</label>
                <select
                  name="providerType"
                  value={filters.providerType}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Providers</option>
                  {filterOptions.providerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
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
                <label>Income Range</label>
                <select
                  name="incomeRange"
                  value={filters.incomeRange}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Income Ranges</option>
                  {filterOptions.incomeRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
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

      {/* Scholarship Detail View */}
      {selectedScholarship && (
        <div className="scholarship-detail-view">
          <div className="detail-header">
            <h2>{selectedScholarship.name}</h2>
            <button onClick={() => setSelectedScholarship(null)} className="btn-secondary">
              Back to Results
            </button>
          </div>

          <div className="detail-content">
            <div className="detail-section">
              <h3>Provider Information</h3>
              <p><strong>Provider Type:</strong> {selectedScholarship.providerType}</p>
              {selectedScholarship.officialProvider && (
                <p><strong>Official Provider:</strong> {selectedScholarship.officialProvider}</p>
              )}
              {selectedScholarship.officialInfo && (
                <>
                  {selectedScholarship.officialInfo.website && (
                    <p><strong>Website:</strong> <a href={selectedScholarship.officialInfo.website} target="_blank" rel="noopener noreferrer">{selectedScholarship.officialInfo.website}</a></p>
                  )}
                  {selectedScholarship.officialInfo.contact && (
                    <p><strong>Contact:</strong> {selectedScholarship.officialInfo.contact}</p>
                  )}
                  {selectedScholarship.officialInfo.email && (
                    <p><strong>Email:</strong> {selectedScholarship.officialInfo.email}</p>
                  )}
                </>
              )}
              <p><strong>Data Source:</strong> {selectedScholarship.dataSource}</p>
            </div>

            <div className="detail-section">
              <h3>Data Verification</h3>
              <div
                className="verification-badge"
                style={{ backgroundColor: getVerificationStatusColor(selectedScholarship.verificationStatus) }}
              >
                {selectedScholarship.verificationStatus ? selectedScholarship.verificationStatus.toUpperCase() : 'UNKNOWN'}
              </div>
              {selectedScholarship.status === 'discontinued' && (
                <p className="discontinued-warning">⚠️ {selectedScholarship.discontinuationNote}</p>
              )}
              {selectedScholarship.verificationStatus === 'demo' && (
                <p className="demo-warning">⚠️ This is demonstration data for illustration purposes only. Please verify all details with the official provider before applying.</p>
              )}
              {selectedScholarship.verificationNote && (
                <p className="verification-note">⚠️ {selectedScholarship.verificationNote}</p>
              )}
              {selectedScholarship.lastVerifiedDate && (
                <p><strong>Last Verified:</strong> {selectedScholarship.lastVerifiedDate}</p>
              )}
              {selectedScholarship.academicYear && (
                <p><strong>Academic Year:</strong> {selectedScholarship.academicYear}</p>
              )}
              {selectedScholarship.applicationUrl && (
                <p><strong>Application URL:</strong> <a href={selectedScholarship.applicationUrl} target="_blank" rel="noopener noreferrer">{selectedScholarship.applicationUrl}</a></p>
              )}
            </div>

            <div className="detail-section">
              <h3>Eligibility Requirements</h3>
              <p>{selectedScholarship.eligibility}</p>
              <p><strong>Education Level:</strong> {selectedScholarship.educationLevel}</p>
              <p><strong>State:</strong> {selectedScholarship.state}</p>
              <p><strong>Category:</strong> {selectedScholarship.category}</p>
              <p><strong>Income Range:</strong> {selectedScholarship.incomeRange}</p>
              <p><strong>Courses:</strong> {selectedScholarship.courses.join(', ')}</p>
            </div>

            <div className="detail-section">
              <h3>Benefits</h3>
              <p>{selectedScholarship.benefits}</p>
            </div>

            <div className="detail-section">
              <h3>Application Information</h3>
              <p><strong>Deadline:</strong> {selectedScholarship.deadline || 'Not specified'}</p>
              {selectedScholarship.deadlineStatus && (
                <div
                  className="deadline-status-badge"
                  style={{ backgroundColor: getDeadlineStatusColor(selectedScholarship.deadlineStatus) }}
                >
                  {selectedScholarship.deadlineStatus.toUpperCase()}
                </div>
              )}
              {selectedScholarship.deadlineStatus === 'closed' && (
                <p className="deadline-warning">⚠️ The application deadline has passed. This information may be outdated. Please check the official source for updated deadlines.</p>
              )}
              {selectedScholarship.deadlineStatus === 'verification required' && (
                <p className="deadline-warning">⚠️ Deadline status requires verification. Please check the official source for current application dates.</p>
              )}
              <p><strong>Application Process:</strong> {selectedScholarship.applicationProcess}</p>
              <p><strong>Required Documents:</strong></p>
              <ul>
                {selectedScholarship.requiredDocuments.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>

            {/* Eligibility Check */}
            {user && eligibilityResults[selectedScholarship.id] && (
              <div className="detail-section eligibility-section">
                <h3>Your Eligibility</h3>
                <div
                  className="eligibility-badge"
                  style={{ backgroundColor: getEligibilityColor(eligibilityResults[selectedScholarship.id].result) }}
                >
                  {eligibilityResults[selectedScholarship.id].result.toUpperCase()}
                </div>
                <p className="eligibility-explanation">
                  {eligibilityResults[selectedScholarship.id].explanation}
                </p>

                {eligibilityResults[selectedScholarship.id].requirements.satisfied.length > 0 && (
                  <div className="eligibility-requirements satisfied">
                    <h4>Requirements Satisfied:</h4>
                    <ul>
                      {eligibilityResults[selectedScholarship.id].requirements.satisfied.map((req, index) => (
                        <li key={index}>✓ {req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {eligibilityResults[selectedScholarship.id].requirements.notSatisfied.length > 0 && (
                  <div className="eligibility-requirements not-satisfied">
                    <h4>Requirements Not Satisfied:</h4>
                    <ul>
                      {eligibilityResults[selectedScholarship.id].requirements.notSatisfied.map((req, index) => (
                        <li key={index}>✗ {req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {eligibilityResults[selectedScholarship.id].requirements.missing.length > 0 && (
                  <div className="eligibility-requirements missing">
                    <h4>Information Still Needed:</h4>
                    <ul>
                      {eligibilityResults[selectedScholarship.id].requirements.missing.map((req, index) => (
                        <li key={index}>? {req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!user && (
              <div className="detail-section">
                <p className="login-prompt">
                  <a href="/login">Login</a> to check your eligibility for this scholarship.
                </p>
              </div>
            )}

            <div className="detail-actions">
              {isScholarshipSaved(selectedScholarship.id) ? (
                <button
                  onClick={() => handleRemoveSavedScholarship(selectedScholarship.id)}
                  className="btn-secondary"
                >
                  Remove from Saved
                </button>
              ) : (
                <button
                  onClick={() => handleSaveScholarship(selectedScholarship.id)}
                  className="btn-primary"
                >
                  Save Scholarship
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scholarships Grid */}
      {!selectedScholarship && (
        <div className="scholarships-section">
          <div className="scholarships-header">
            <h3>
              Available Scholarships
              <span className="results-count">({scholarships.length} results)</span>
            </h3>
          </div>

          {scholarships.length === 0 ? (
            <div className="empty-state">
              <p>No scholarships found matching your criteria.</p>
              <button onClick={handleClearFilters} className="btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="scholarships-grid">
              {scholarships.map(scholarship => (
                <div key={scholarship.id} className="scholarship-card">
                  <div className="scholarship-card-header">
                    <h4>{scholarship.name}</h4>
                    <div className="scholarship-badges">
                      <span
                        className="provider-type-badge"
                        style={{ backgroundColor: getProviderTypeColor(scholarship.providerType) }}
                      >
                        {scholarship.providerType}
                      </span>
                      {scholarship.verificationStatus && (
                        <span
                          className="verification-badge"
                          style={{ backgroundColor: getVerificationStatusColor(scholarship.verificationStatus) }}
                        >
                          {scholarship.verificationStatus === 'demo' ? 'DEMO' : scholarship.verificationStatus.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="scholarship-card-body">
                    <p className="eligibility-text">{scholarship.eligibility}</p>
                    <p><strong>Benefits:</strong> {scholarship.benefits}</p>
                    <p><strong>Deadline:</strong> {scholarship.deadline || 'Not specified'}</p>
                    {scholarship.deadlineStatus && (
                      <div
                        className="deadline-status-badge"
                        style={{ backgroundColor: getDeadlineStatusColor(scholarship.deadlineStatus) }}
                      >
                        {scholarship.deadlineStatus.toUpperCase()}
                      </div>
                    )}
                    <p><strong>Education Level:</strong> {scholarship.educationLevel}</p>
                    <p><strong>State:</strong> {scholarship.state}</p>
                    <p><strong>Category:</strong> {scholarship.category}</p>
                    <p><strong>Income Range:</strong> {scholarship.incomeRange}</p>
                  </div>

                  <div className="scholarship-card-footer">
                    <button
                      onClick={() => handleScholarshipClick(scholarship.id)}
                      className="btn-primary"
                    >
                      View Details
                    </button>
                    {isScholarshipSaved(scholarship.id) ? (
                      <button
                        onClick={() => handleRemoveSavedScholarship(scholarship.id)}
                        className="btn-secondary"
                      >
                        Saved
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveScholarship(scholarship.id)}
                        className="btn-secondary"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
