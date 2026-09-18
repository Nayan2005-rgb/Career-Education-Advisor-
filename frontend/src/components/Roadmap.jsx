import React, { useState, useEffect } from 'react';
import { roadmapAPI } from '../services/api';

export default function Roadmap({ careerTitle, userProfile }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStep, setUpdatingStep] = useState(null);

  useEffect(() => {
    const loadRoadmap = async () => {
      setLoading(true);
      setError('');
      try {
        // Try to get existing roadmap first
        const { data: existingRoadmap } = await roadmapAPI.getRoadmap(careerTitle);
        setRoadmap(existingRoadmap);
      } catch (err) {
        if (err.response?.status === 404) {
          // Roadmap doesn't exist, create one
          try {
            const { data: newRoadmap } = await roadmapAPI.createOrGet({
              careerTitle,
              userProfile
            });
            setRoadmap(newRoadmap);
          } catch (createErr) {
            setError(createErr.response?.data?.message || 'Unable to create roadmap. Please try again.');
          }
        } else {
          setError(err.response?.data?.message || 'Unable to load roadmap. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (careerTitle) {
      loadRoadmap();
    }
  }, [careerTitle, userProfile]);

  const handleStepStatusChange = async (stepId, newStatus) => {
    setUpdatingStep(stepId);
    try {
      const { data: updatedRoadmap } = await roadmapAPI.updateStepStatus(
        roadmap.id,
        stepId,
        newStatus
      );
      setRoadmap(updatedRoadmap);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update step status. Please try again.');
    } finally {
      setUpdatingStep(null);
    }
  };

  const calculateCompletionPercentage = () => {
    if (!roadmap || !roadmap.steps || roadmap.steps.length === 0) return 0;
    const completedSteps = roadmap.steps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / roadmap.steps.length) * 100);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '→';
      default:
        return '○';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in_progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="roadmap loading">
        <p>Loading your personalized roadmap...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roadmap error">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="roadmap empty">
        <p>No roadmap available for this career.</p>
      </div>
    );
  }

  const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="roadmap">
      <div className="roadmap-header">
        <h2>Your Personalized Career Roadmap</h2>
        <div className="completion-overview">
          <div className="completion-bar">
            <div 
              className="completion-fill" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="completion-text">{completionPercentage}% Complete</span>
        </div>
      </div>

      <div className="roadmap-steps">
        {roadmap.steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`roadmap-step ${getStatusClass(step.status)}`}
          >
            <div className="step-header">
              <div className="step-number">
                <span className="step-icon">{getStatusIcon(step.status)}</span>
                <span className="step-index">{index + 1}</span>
              </div>
              <div className="step-info">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              <div className="step-actions">
                {step.status !== 'completed' && (
                  <button
                    className="btn-complete"
                    onClick={() => handleStepStatusChange(step.id, 'completed')}
                    disabled={updatingStep === step.id}
                  >
                    {updatingStep === step.id ? 'Updating...' : 'Complete'}
                  </button>
                )}
                {step.status === 'completed' && (
                  <button
                    className="btn-incomplete"
                    onClick={() => handleStepStatusChange(step.id, 'in_progress')}
                    disabled={updatingStep === step.id}
                  >
                    {updatingStep === step.id ? 'Updating...' : 'Mark Incomplete'}
                  </button>
                )}
              </div>
            </div>

            <div className="step-details">
              <div className="detail-item">
                <strong>Skills:</strong>
                <div className="skills-list">
                  {step.skills && step.skills.length > 0 ? (
                    step.skills.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))
                  ) : (
                    <span className="no-skills">No specific skills listed</span>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <strong>Recommended Learning:</strong>
                <p>{step.recommendedLearning}</p>
              </div>

              <div className="detail-item">
                <strong>Estimated Duration:</strong>
                <span className="duration-badge">{step.estimatedDuration}</span>
              </div>

              <div className="detail-item">
                <strong>Status:</strong>
                <span className={`status-badge ${getStatusClass(step.status)}`}>
                  {step.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {index < roadmap.steps.length - 1 && (
              <div className="step-connector"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
