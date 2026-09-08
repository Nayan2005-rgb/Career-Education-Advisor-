import React from 'react';

export default function Recommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return <p>No recommendations yet — complete the assessment above to get started.</p>;
  }

  return (
    <div className="recommendations">
      <h3>Your Top Career Matches</h3>
      <div className="career-cards">
        {recommendations.map((career) => (
          <div key={career.title} className="career-card">
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
          </div>
        ))}
      </div>
    </div>
  );
}
