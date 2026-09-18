import React, { useState, useEffect } from 'react';
import { skillGapAPI } from '../services/api';
import LearningRecommendations from './LearningRecommendations';

export default function SkillGapAnalysis({ careerTitle, userProfile }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchSkillGapAnalysis = async () => {
      setLoading(true);
      setError('');
      try {
        // Try to get existing analysis first
        try {
          const { data } = await skillGapAPI.getSkillGap(careerTitle);
          setAnalysis(data);
        } catch (getErr) {
          if (getErr.response?.status === 404) {
            // Generate new analysis if none exists
            const { data } = await skillGapAPI.generateSkillGap(careerTitle);
            setAnalysis(data.analysis);
          } else {
            throw getErr;
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load skill gap analysis. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (careerTitle) {
      fetchSkillGapAnalysis();
    }
  }, [careerTitle]);

  if (loading) {
    return (
      <div className="skill-gap-analysis">
        <div className="loading-state">
          <p>Analyzing skill gaps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="skill-gap-analysis">
        <div className="error-state">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="skill-gap-analysis">
        <div className="error-state">
          <p>No skill gap analysis available.</p>
        </div>
      </div>
    );
  }

  const { overallMatch, skillComparisons, skillCategories, projectRecommendations } = analysis;

  const getMatchColor = (match) => {
    if (match >= 70) return '#10b981'; // green
    if (match >= 50) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getGapColor = (gap) => {
    if (gap <= 20) return '#10b981'; // green
    if (gap <= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div className="skill-gap-analysis">
      <div className="skill-gap-header">
        <h2>Skill Gap Analysis</h2>
        <p>Compare your current skills with requirements for {careerTitle}</p>
      </div>

      {/* Overall Match Score */}
      <div className="overall-match-section">
        <div className="match-card">
          <h3>Overall Skill Match</h3>
          <div className="match-score-container">
            <div 
              className="match-circle"
              style={{
                background: `conic-gradient(${getMatchColor(overallMatch)} ${overallMatch}%, #e5e7eb ${overallMatch}%)`
              }}
            >
              <div className="match-circle-inner">
                <span className="match-percentage">{overallMatch}%</span>
              </div>
            </div>
          </div>
          <p className="match-description">
            {overallMatch >= 70 ? 'Strong match! You have most required skills.' :
             overallMatch >= 50 ? 'Moderate match. Focus on developing key skills.' :
             'Significant gap. Consider skill development programs.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="skill-gap-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Skill Details
        </button>
        <button 
          className={`tab-button ${activeTab === 'learning' ? 'active' : ''}`}
          onClick={() => setActiveTab('learning')}
        >
          Learning Path
        </button>
        <button 
          className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Missing Skills */}
            {skillCategories.missingSkills.length > 0 && (
              <div className="skill-category-section">
                <h3>Missing Skills</h3>
                <div className="missing-skills-grid">
                  {skillCategories.missingSkills.map((skill, index) => (
                    <div key={index} className="missing-skill-tag">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Priority Skills */}
            <div className="priority-sections">
              {skillCategories.highPriority.length > 0 && (
                <div className="priority-section high">
                  <h3>High Priority Skills</h3>
                  <div className="priority-skills-list">
                    {skillCategories.highPriority.map((skill, index) => (
                      <div key={index} className="priority-skill-item">
                        <div className="skill-info">
                          <span className="skill-name">{skill.skill}</span>
                          <span className="skill-gap">Gap: {skill.gap}%</span>
                        </div>
                        <div className="skill-bar">
                          <div 
                            className="skill-bar-fill current"
                            style={{ width: `${skill.current}%`, backgroundColor: '#3b82f6' }}
                          />
                          <div 
                            className="skill-bar-fill required"
                            style={{ width: `${skill.required}%`, backgroundColor: '#10b981' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skillCategories.mediumPriority.length > 0 && (
                <div className="priority-section medium">
                  <h3>Medium Priority Skills</h3>
                  <div className="priority-skills-list">
                    {skillCategories.mediumPriority.map((skill, index) => (
                      <div key={index} className="priority-skill-item">
                        <div className="skill-info">
                          <span className="skill-name">{skill.skill}</span>
                          <span className="skill-gap">Gap: {skill.gap}%</span>
                        </div>
                        <div className="skill-bar">
                          <div 
                            className="skill-bar-fill current"
                            style={{ width: `${skill.current}%`, backgroundColor: '#3b82f6' }}
                          />
                          <div 
                            className="skill-bar-fill required"
                            style={{ width: `${skill.required}%`, backgroundColor: '#10b981' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skillCategories.lowPriority.length > 0 && (
                <div className="priority-section low">
                  <h3>Low Priority Skills</h3>
                  <div className="priority-skills-list">
                    {skillCategories.lowPriority.map((skill, index) => (
                      <div key={index} className="priority-skill-item">
                        <div className="skill-info">
                          <span className="skill-name">{skill.skill}</span>
                          <span className="skill-gap">Gap: {skill.gap}%</span>
                        </div>
                        <div className="skill-bar">
                          <div 
                            className="skill-bar-fill current"
                            style={{ width: `${skill.current}%`, backgroundColor: '#3b82f6' }}
                          />
                          <div 
                            className="skill-bar-fill required"
                            style={{ width: `${skill.required}%`, backgroundColor: '#10b981' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-tab">
            <h3>Detailed Skill Comparison</h3>
            <div className="skills-comparison-table">
              <div className="table-header">
                <div className="header-cell">Skill</div>
                <div className="header-cell">Current</div>
                <div className="header-cell">Required</div>
                <div className="header-cell">Gap</div>
                <div className="header-cell">Status</div>
              </div>
              {skillComparisons.map((skill, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell skill-name-cell">
                    {skill.skill}
                    {skill.isSoftSkill && <span className="soft-skill-badge">Soft Skill</span>}
                  </div>
                  <div className="table-cell">
                    <div className="skill-level-indicator">
                      <div 
                        className="level-bar"
                        style={{ 
                          width: `${skill.current}%`,
                          backgroundColor: '#3b82f6'
                        }}
                      />
                      <span>{skill.current}%</span>
                    </div>
                  </div>
                  <div className="table-cell">
                    <div className="skill-level-indicator">
                      <div 
                        className="level-bar"
                        style={{ 
                          width: `${skill.required}%`,
                          backgroundColor: '#10b981'
                        }}
                      />
                      <span>{skill.required}%</span>
                    </div>
                  </div>
                  <div className="table-cell">
                    <span 
                      className="gap-indicator"
                      style={{ color: getGapColor(skill.gap) }}
                    >
                      {skill.gap > 0 ? `+${skill.gap}%` : '0%'}
                    </span>
                  </div>
                  <div className="table-cell">
                    {skill.hasSkill ? (
                      <span className="status-badge success">Has Skill</span>
                    ) : (
                      <span className="status-badge missing">Missing</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div className="learning-tab">
            <LearningRecommendations careerTitle={careerTitle} />
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-tab">
            <h3>Recommended Projects</h3>
            <div className="project-recommendations">
              {projectRecommendations.map((project, index) => (
                <div key={index} className="project-card">
                  <div className="project-header">
                    <h4>{project.title}</h4>
                    <div className="project-meta">
                      <span className="difficulty-badge">{project.difficulty}</span>
                      <span className="time-badge">{project.estimatedTime}</span>
                    </div>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-skills">
                    <span className="skills-label">Skills addressed:</span>
                    <div className="project-skills-list">
                      {project.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="project-skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
