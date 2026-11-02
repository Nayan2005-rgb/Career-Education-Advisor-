import React, { useState, useEffect } from 'react';
import { opportunityAPI } from '../services/api';

export default function SavedOpportunities() {
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSavedOpportunities();
  }, []);

  const loadSavedOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await opportunityAPI.getSavedOpportunities();
      setSavedOpportunities(response.data.opportunities);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load saved opportunities');
      console.error('Error loading saved opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (opportunityId) => {
    if (!window.confirm('Are you sure you want to remove this saved opportunity?')) {
      return;
    }

    try {
      await opportunityAPI.removeSavedOpportunity(opportunityId);
      alert('Opportunity removed from saved');
      loadSavedOpportunities();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to remove saved opportunity');
    }
  };

  if (loading) {
    return <div className="loading">Loading saved opportunities...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button onClick={loadSavedOpportunities} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  if (savedOpportunities.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Saved Opportunities</h3>
        <p>You haven't saved any opportunities yet. Browse opportunities to save ones you're interested in.</p>
      </div>
    );
  }

  return (
    <div className="saved-opportunities">
      <h2>Saved Opportunities</h2>
      <p className="count">{savedOpportunities.length} opportunity(ies) saved</p>

      <div className="saved-list">
        {savedOpportunities.map(opportunity => (
          <SavedCard
            key={opportunity.id}
            opportunity={opportunity}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}

function SavedCard({ opportunity, onRemove }) {
  const [showDetails, setShowDetails] = useState(false);

  const isSample = opportunity.isSample || opportunity.dataVerificationStatus === 'sample';

  return (
    <div className="saved-card">
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

        <p className="saved-date">Saved on {new Date(opportunity.savedAt).toLocaleDateString()}</p>

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

        <button
          onClick={() => onRemove(opportunity.id)}
          className="btn btn-danger"
        >
          Remove
        </button>

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
