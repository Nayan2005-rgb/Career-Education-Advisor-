import React, { useState, useEffect } from 'react';
import { opportunityAPI } from '../services/api';

export default function OpportunityRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await opportunityAPI.getPersonalizedRecommendations();
      setRecommendations(response.data.recommendations);
      setUserProfile(response.data.userProfile);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load recommendations');
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOpportunity = async (opportunityId) => {
    try {
      await opportunityAPI.saveOpportunity(opportunityId);
      alert('Opportunity saved successfully');
      loadRecommendations();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to save opportunity');
    }
  };

  if (loading) {
    return <div className="loading">Loading personalized recommendations...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button onClick={loadRecommendations} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Recommendations Available</h3>
        <p>Please complete your career assessment to receive personalized job recommendations.</p>
      </div>
    );
  }

  return (
    <div className="opportunity-recommendations">
      <h2>Personalized Recommendations</h2>

      {userProfile && (
        <div className="user-profile-summary">
          <h4>Your Profile</h4>
          <div className="profile-details">
            <div>
              <strong>Skills:</strong>
              <div className="skills-tags">
                {userProfile.skills.length > 0 ? (
                  userProfile.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))
                ) : (
                  <span className="no-data">No skills recorded</span>
                )}
              </div>
            </div>
            <div>
              <strong>Interests:</strong>
              <div className="skills-tags">
                {userProfile.interests.length > 0 ? (
                  userProfile.interests.map((interest, idx) => (
                    <span key={idx} className="skill-tag">{interest}</span>
                  ))
                ) : (
                  <span className="no-data">No interests recorded</span>
                )}
              </div>
            </div>
            <div>
              <strong>Education Level:</strong> {userProfile.educationLevel || 'Not specified'}
            </div>
          </div>
        </div>
      )}

      <div className="recommendations-list">
        {recommendations.map(opportunity => (
          <RecommendationCard
            key={opportunity.id}
            opportunity={opportunity}
            onSave={handleSaveOpportunity}
          />
        ))}
      </div>

      <div className="info-note">
        <p><strong>Note:</strong> Match scores indicate relevance based on your profile, not a guarantee of eligibility or selection.</p>
      </div>
    </div>
  );
}

function RecommendationCard({ opportunity, onSave }) {
  const [showDetails, setShowDetails] = useState(false);

  const isSample = opportunity.isSample || opportunity.dataVerificationStatus === 'sample';

  return (
    <div className="recommendation-card">
      <div className="card-header">
        <h3>{opportunity.title}</h3>
        <div className="match-score">
          <span className="score-label">Match Score:</span>
          <span className={`score-value ${getScoreClass(opportunity.matchScore)}`}>
            {opportunity.matchScore}%
          </span>
        </div>
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

        <div className="match-explanation">
          <strong>Why this opportunity:</strong>
          <ul>
            {opportunity.matchExplanation?.map((explanation, idx) => (
              <li key={idx}>{explanation}</li>
            ))}
          </ul>
        </div>

        <div className="skills-section">
          <strong>Matching Skills:</strong>
          <div className="skills-tags">
            {opportunity.matchingSkills?.length > 0 ? (
              opportunity.matchingSkills.map((skill, idx) => (
                <span key={idx} className="skill-tag match">{skill}</span>
              ))
            ) : (
              <span className="no-skills">No matching skills found</span>
            )}
          </div>
        </div>

        {opportunity.missingSkills && opportunity.missingSkills.length > 0 && (
          <div className="skills-section">
            <strong>Missing Required Skills:</strong>
            <div className="skills-tags">
              {opportunity.missingSkills.map((skill, idx) => (
                <span key={idx} className="skill-tag missing">{skill}</span>
              ))}
            </div>
          </div>
        )}

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
          onClick={() => onSave(opportunity.id)}
          className="btn btn-primary"
        >
          Save
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

function getScoreClass(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}
