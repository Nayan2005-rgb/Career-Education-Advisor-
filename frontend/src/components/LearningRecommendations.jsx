import React, { useState, useEffect } from 'react';
import { skillGapAPI } from '../services/api';

export default function LearningRecommendations({ careerTitle }) {
  const [learningPath, setLearningPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    const fetchLearningPath = async () => {
      setLoading(true);
      setError('');
      try {
        // Try to get existing learning path first
        try {
          const { data } = await skillGapAPI.getLearningPath(careerTitle);
          setLearningPath(data.learningPath);
        } catch (getErr) {
          if (getErr.response?.status === 404) {
            // Generate new learning path if none exists
            const { data } = await skillGapAPI.generateLearningPath(careerTitle);
            setLearningPath(data.learningPath);
          } else {
            throw getErr;
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load learning recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (careerTitle) {
      fetchLearningPath();
    }
  }, [careerTitle]);

  const handleToggleComplete = async (itemIndex) => {
    const item = learningPath[itemIndex];
    const newCompletedStatus = !item.completed;
    
    setUpdatingItem(itemIndex);
    try {
      const { data } = await skillGapAPI.updateLearningItem(careerTitle, itemIndex, newCompletedStatus);
      setLearningPath(data.learningPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update learning item. Please try again.');
    } finally {
      setUpdatingItem(null);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#10b981',
      'Intermediate': '#f59e0b',
      'Advanced': '#ef4444'
    };
    return colors[difficulty] || '#6b7280';
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return (
      <span 
        className="priority-badge" 
        style={{ backgroundColor: colors[priority] }}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </span>
    );
  };

  const calculateProgress = () => {
    if (learningPath.length === 0) return 0;
    const completedCount = learningPath.filter(item => item.completed).length;
    return Math.round((completedCount / learningPath.length) * 100);
  };

  if (loading) {
    return (
      <div className="learning-recommendations">
        <div className="loading-state">
          <p>Generating personalized learning path...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learning-recommendations">
        <div className="error-state">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  if (learningPath.length === 0) {
    return (
      <div className="learning-recommendations">
        <div className="empty-state">
          <p>No learning recommendations available for this career path.</p>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="learning-recommendations">
      <div className="learning-header">
        <h2>Personalized Learning Path</h2>
        <p>Structured learning recommendations for {careerTitle}</p>
      </div>

      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="progress-card">
          <h3>Overall Progress</h3>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="progress-text">{progress}% Complete</span>
          </div>
          <p className="progress-description">
            {learningPath.filter(item => item.completed).length} of {learningPath.length} items completed
          </p>
        </div>
      </div>

      {/* Learning Path Flow */}
      <div className="learning-path-flow">
        <h3>Learning Journey</h3>
        <div className="learning-items-container">
          {learningPath.map((item, index) => (
            <div 
              key={index} 
              className={`learning-item ${item.completed ? 'completed' : ''} ${updatingItem === index ? 'updating' : ''}`}
            >
              <div className="learning-item-header">
                <div className="learning-item-number">
                  <span className="number">{index + 1}</span>
                  {item.completed && <span className="check">✓</span>}
                </div>
                <div className="learning-item-info">
                  <div className="learning-item-title-row">
                    <h4>{item.skill}</h4>
                    {getPriorityBadge(item.priority)}
                  </div>
                  <p className="learning-item-topic">{item.topic}</p>
                </div>
                <button
                  className={`complete-button ${item.completed ? 'completed' : ''}`}
                  onClick={() => handleToggleComplete(index)}
                  disabled={updatingItem === index}
                >
                  {item.completed ? 'Completed' : 'Mark Complete'}
                </button>
              </div>

              <div className="learning-item-details">
                <div className="detail-row">
                  <span className="detail-label">Difficulty:</span>
                  <span 
                    className="detail-value difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(item.difficulty) }}
                  >
                    {item.difficulty}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Estimated Duration:</span>
                  <span className="detail-value">{item.estimatedDuration}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Recommended Resource:</span>
                  <span className="detail-value resource-link">{item.recommendedResource}</span>
                </div>
                
                {item.prerequisites && item.prerequisites.length > 0 && (
                  <div className="detail-row prerequisites">
                    <span className="detail-label">Prerequisites:</span>
                    <div className="prerequisites-list">
                      {item.prerequisites.map((prereq, prereqIndex) => (
                        <span key={prereqIndex} className="prerequisite-tag">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {item.learningSteps && item.learningSteps.length > 0 && (
                  <div className="learning-steps">
                    <span className="detail-label">Learning Steps:</span>
                    <ul className="steps-list">
                      {item.learningSteps.map((step, stepIndex) => (
                        <li key={stepIndex} className="step-item">
                          <span className="step-number">{stepIndex + 1}</span>
                          <span className="step-text">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.completedAt && (
                  <div className="completion-info">
                    <span className="completion-label">Completed on:</span>
                    <span className="completion-date">
                      {new Date(item.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Note */}
      <div className="connection-note">
        <div className="note-content">
          <h4>Learning Path Connection</h4>
          <p>
            This personalized learning path is generated based on your skill gap analysis for {careerTitle}. 
            As you complete learning items, your skill profile updates, helping you track progress toward your career goals.
          </p>
          <div className="connection-flow">
            <span className="flow-item">Career →</span>
            <span className="flow-item">Required Skills →</span>
            <span className="flow-item">Skill Gap →</span>
            <span className="flow-item active">Learning Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}