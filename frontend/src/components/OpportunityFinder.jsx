import React, { useState, useEffect } from 'react';
import { opportunityAPI, resumeAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function OpportunityFinder() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    opportunityType: '',
    location: '',
    workMode: '',
    experienceLevel: '',
    skills: '',
    educationLevel: '',
    sortBy: 'postingDate'
  });
  const [filterOptions, setFilterOptions] = useState({
    opportunityTypes: [],
    locations: [],
    workModes: [],
    experienceLevels: [],
    educationLevels: [],
    skills: []
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    loadFilterOptions();
    loadOpportunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await opportunityAPI.getFilterOptions();
      setFilterOptions(response.data);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  const loadOpportunities = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = { ...filters, page };
      if (filters.skills) {
        params.skills = filters.skills.split(',').map(s => s.trim());
      }

      const response = await opportunityAPI.searchOpportunities(params);
      setOpportunities(response.data.opportunities);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Unable to load opportunities. Please try again.');
      console.error('Error loading opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadOpportunities(1);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      opportunityType: '',
      location: '',
      workMode: '',
      experienceLevel: '',
      skills: '',
      educationLevel: '',
      sortBy: 'postingDate'
    });
    loadOpportunities(1);
  };

  const handlePageChange = (newPage) => {
    loadOpportunities(newPage);
  };

  const handleSaveOpportunity = async (opportunityId) => {
    if (!isAuthenticated) {
      alert('Please login to save opportunities');
      return;
    }

    try {
      await opportunityAPI.saveOpportunity(opportunityId);
      alert('Opportunity saved successfully');
      // Refresh opportunities to update saved status
      loadOpportunities(pagination.currentPage);
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to save opportunity');
    }
  };

  const handleRemoveSaved = async (opportunityId) => {
    try {
      await opportunityAPI.removeSavedOpportunity(opportunityId);
      alert('Opportunity removed from saved');
      loadOpportunities(pagination.currentPage);
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to remove saved opportunity');
    }
  };

  const handleViewResumes = async () => {
    if (!isAuthenticated) {
      alert('Please login to view your resumes');
      return;
    }

    try {
      const response = await resumeAPI.getUserResumes();
      if (response.data.resumes.length === 0) {
        alert('No resumes found. Create one to get started!');
        navigate('/resume-dashboard');
      } else {
        // Navigate to resume dashboard to view resumes
        navigate('/resume-dashboard');
      }
    } catch (err) {
      alert('Unable to load your resumes');
    }
  };

  return (
    <div className="opportunity-finder">
      <h2>Internship & Job Finder</h2>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="toolbar">
          <button onClick={handleViewResumes} className="btn btn-secondary">
            📄 View My Resumes
          </button>
          <button onClick={() => navigate('/resume-dashboard')} className="btn btn-primary">
            + Create New Resume
          </button>
        </div>

        <form onSubmit={handleSearch} className="filter-form">
          <div className="form-row">
            <input
              type="text"
              name="search"
              placeholder="Search by title, company, or keywords..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
            <button type="button" onClick={handleReset} className="btn btn-secondary">Reset</button>
          </div>

          <div className="filter-grid">
            <div className="filter-group">
              <label>Opportunity Type</label>
              <select name="opportunityType" value={filters.opportunityType} onChange={handleFilterChange}>
                <option value="">All Types</option>
                {filterOptions.opportunityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <select name="location" value={filters.location} onChange={handleFilterChange}>
                <option value="">All Locations</option>
                {filterOptions.locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Work Mode</label>
              <select name="workMode" value={filters.workMode} onChange={handleFilterChange}>
                <option value="">All Modes</option>
                {filterOptions.workModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Experience Level</label>
              <select name="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange}>
                <option value="">All Levels</option>
                {filterOptions.experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Education Level</label>
              <select name="educationLevel" value={filters.educationLevel} onChange={handleFilterChange}>
                <option value="">All Levels</option>
                {filterOptions.educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                placeholder="e.g., JavaScript, React"
                value={filters.skills}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                <option value="postingDate">Posting Date</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && <div className="loading">Loading opportunities...</div>}

      {/* Error State */}
      {error && <div className="error">{error}</div>}

      {/* Empty State */}
      {!loading && !error && opportunities.length === 0 && (
        <div className="empty-state">
          <p>No opportunities found matching your criteria.</p>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* Opportunities List */}
      {!loading && !error && opportunities.length > 0 && (
        <div className="opportunities-list">
          <p className="results-count">Showing {opportunities.length} of {pagination.totalItems} opportunities</p>

          {opportunities.map(opportunity => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isAuthenticated={isAuthenticated}
              onSave={handleSaveOpportunity}
              onRemoveSaved={handleRemoveSaved}
            />
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OpportunityCard({ opportunity, isAuthenticated, onSave, onRemoveSaved }) {
  const [showDetails, setShowDetails] = useState(false);

  const isSample = opportunity.isSample || opportunity.dataVerificationStatus === 'sample';

  return (
    <div className="opportunity-card">
      <div className="card-header">
        <h3>{opportunity.title}</h3>
        <span className={`badge ${opportunity.opportunityType}`}>{opportunity.opportunityType}</span>
      </div>

      <div className="card-body">
        <p className="company">{opportunity.company}</p>
        <div className="meta-info">
          <span>📍 {opportunity.location}</span>
          <span>💼 {opportunity.workMode}</span>
          <span>🎓 {opportunity.experienceLevel}</span>
        </div>

        {isSample && (
          <div className="sample-warning">
            ⚠️ This is a sample opportunity for demonstration purposes only.
          </div>
        )}

        <div className="skills-section">
          <strong>Required Skills:</strong>
          <div className="skills-tags">
            {opportunity.requiredSkills?.map((skill, idx) => (
              <span key={idx} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        {opportunity.stipend && (
          <p className="stipend">💰 {opportunity.stipend}</p>
        )}

        {opportunity.deadline && (
          <p className="deadline">⏰ Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</p>
        )}
      </div>

      <div className="card-footer">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="btn btn-outline"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>

        {isAuthenticated && (
          <>
            {opportunity.isSaved ? (
              <button
                onClick={() => onRemoveSaved(opportunity.id)}
                className="btn btn-secondary"
              >
                Remove Saved
              </button>
            ) : (
              <button
                onClick={() => onSave(opportunity.id)}
                className="btn btn-primary"
              >
                Save
              </button>
            )}
          </>
        )}

        {opportunity.applicationUrl && (
          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Apply Now
          </a>
        )}
      </div>

      {showDetails && (
        <OpportunityDetails opportunity={opportunity} />
      )}
    </div>
  );
}

function OpportunityDetails({ opportunity }) {
  const isSample = opportunity.isSample || opportunity.dataVerificationStatus === 'sample';

  return (
    <div className="opportunity-details">
      {isSample && (
        <div className="sample-warning-banner">
          ⚠️ DEMONSTRATION DATA: This is a sample opportunity for testing purposes only. It is not a real job posting.
        </div>
      )}

      <h4>Description</h4>
      <p>{opportunity.description}</p>

      <h4>Responsibilities</h4>
      <ul>
        {opportunity.responsibilities?.map((resp, idx) => (
          <li key={idx}>{resp}</li>
        ))}
      </ul>

      <h4>Qualifications</h4>
      <ul>
        {opportunity.qualifications?.map((qual, idx) => (
          <li key={idx}>{qual}</li>
        ))}
      </ul>

      <h4>Required Skills</h4>
      <div className="skills-tags">
        {opportunity.requiredSkills?.map((skill, idx) => (
          <span key={idx} className="skill-tag">{skill}</span>
        ))}
      </div>

      {opportunity.preferredSkills && opportunity.preferredSkills.length > 0 && (
        <>
          <h4>Preferred Skills</h4>
          <div className="skills-tags">
            {opportunity.preferredSkills.map((skill, idx) => (
              <span key={idx} className="skill-tag preferred">{skill}</span>
            ))}
          </div>
        </>
      )}

      <h4>Additional Information</h4>
      <ul>
        <li><strong>Required Education:</strong> {opportunity.requiredEducation}</li>
        <li><strong>Experience Level:</strong> {opportunity.experienceLevel}</li>
        <li><strong>Work Mode:</strong> {opportunity.workMode}</li>
        <li><strong>Location:</strong> {opportunity.location}</li>
        {opportunity.stipend && <li><strong>Stipend/Salary:</strong> {opportunity.stipend}</li>}
        {opportunity.postingDate && <li><strong>Posted:</strong> {new Date(opportunity.postingDate).toLocaleDateString()}</li>}
        {opportunity.deadline && <li><strong>Deadline:</strong> {new Date(opportunity.deadline).toLocaleDateString()}</li>}
      </ul>

      <h4>Source Information</h4>
      <ul>
        <li><strong>Verification Status:</strong> {opportunity.dataVerificationStatus}</li>
        {opportunity.sourceUrl && (
          <li>
            <strong>Source:</strong>{' '}
            <a href={opportunity.sourceUrl} target="_blank" rel="noopener noreferrer">
              {opportunity.sourceUrl}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
