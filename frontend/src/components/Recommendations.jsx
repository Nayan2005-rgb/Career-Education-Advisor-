import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Recommendations({ recommendations }) {
  const navigate = useNavigate();

  if (!recommendations || recommendations.length === 0) {
    return <p>No recommendations yet — complete the assessment above to get started.</p>;
  }

  const handleCareerClick = (careerTitle) => {
    navigate(`/career/${encodeURIComponent(careerTitle)}`);
  };

  return (
    <div className="recommendations">
      <h3>Your Top Career Matches</h3>
      <div className="career-cards">
        {recommendations.map((career) => (
          <div 
            key={career.title} 
            className="career-card clickable"
            onClick={() => handleCareerClick(career.title)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCareerClick(career.title);
              }
            }}
          >
            <div className="career-card-header">
              <h4>{career.title}</h4>
              <span className="match-badge">{career.matchScore}% match</span>
            </div>
            <p>{career.description}</p>
            <div className="courses">
              <strong>Suggested courses:</strong>
              <ul>
                {career.recommendedCourses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </div>
            <div className="view-details-hint">
              <span>Click to view details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
