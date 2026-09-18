import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recommendationAPI, authAPI, assessmentAPI } from '../services/api';
import Roadmap from '../components/Roadmap';
import SkillGapAnalysis from '../components/SkillGapAnalysis';
import LearningRecommendations from '../components/LearningRecommendations';

export default function CareerDetail() {
  const { careerTitle } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState({
    currentEducation: 'Not specified',
    interests: [],
    skills: [],
    strongSubjects: []
  });

  useEffect(() => {
    const fetchCareerDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await recommendationAPI.getCareerDetails(careerTitle);
        setCareer(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load career details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCareerDetails();
  }, [careerTitle]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const [userRes, historyRes] = await Promise.all([
          authAPI.getMe(),
          assessmentAPI.getHistory()
        ]);
        
        const user = userRes.data;
        const latestAssessment = historyRes.data[0]; // Get most recent assessment
        
        setUserProfile({
          currentEducation: user.grade || 'Not specified',
          interests: latestAssessment?.interests || [],
          skills: latestAssessment?.skills || [],
          strongSubjects: latestAssessment?.strongSubjects || []
        });
      } catch (err) {
        console.error('Error loading user profile:', err);
        // Keep default profile if loading fails
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="career-detail">
        <div className="loading-state">
          <p>Loading career details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="career-detail">
        <div className="error-state">
          <p className="error">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="career-detail">
        <div className="error-state">
          <p>Career not found.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="career-detail">
      <button onClick={() => navigate('/dashboard')} className="btn-secondary back-button">
        ← Back to Dashboard
      </button>

      <div className="career-detail-header">
        <h1>{career.title}</h1>
        {career.matchScore && (
          <div className="match-percentage">
            <span className="match-badge large">{career.matchScore}% Match</span>
          </div>
        )}
      </div>

      <p className="career-description">{career.description}</p>

      <div className="detail-section">
        <h2>Why This Career Matches You</h2>
        <div className="match-reasoning">
          <p>
            Based on your interests in <strong>{career.tags?.slice(0, 3).join(', ')}</strong> and your 
            {career.personalityFit?.includes('analytical') && ' analytical'} 
            {career.personalityFit?.includes('creative') && ' creative'} 
            {career.personalityFit?.includes('social') && ' social'} 
            personality, this career aligns well with your profile.
          </p>
        </div>
      </div>

      <div className="detail-section">
        <h2>Your Strengths for This Career</h2>
        <div className="strengths-list">
          {career.tags?.slice(0, 4).map((tag, index) => (
            <div key={index} className="strength-item">
              <span className="strength-icon">✓</span>
              <span>{tag}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <h2>Areas to Improve</h2>
        <div className="improvement-list">
          <p>Focus on developing the following skills to excel in this career:</p>
          <ul>
            {career.requiredSkills?.slice(0, 3).map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="detail-section">
        <h2>Required Education</h2>
        <p>{career.requiredEducation}</p>
      </div>

      <div className="detail-section">
        <h2>Required Skills</h2>
        <div className="skills-grid">
          {career.requiredSkills?.map((skill, index) => (
            <div key={index} className="skill-tag">{skill}</div>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <h2>Soft Skills</h2>
        <div className="soft-skills-grid">
          {career.softSkills?.map((skill, index) => (
            <div key={index} className="soft-skill-tag">{skill}</div>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <h2>Recommended Courses</h2>
        <ul className="courses-list">
          {career.recommendedCourses?.map((course, index) => (
            <li key={index}>{course}</li>
          ))}
        </ul>
      </div>

      <div className="detail-section">
        <h2>Related Entrance Exams</h2>
        <div className="exams-list">
          {career.relatedEntranceExams?.map((exam, index) => (
            <div key={index} className="exam-tag">{exam}</div>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <h2>Career Opportunities</h2>
        <p>{career.careerOpportunities}</p>
      </div>

      <div className="detail-section">
        <h2>Possible Job Roles</h2>
        <div className="job-roles-list">
          {career.possibleJobRoles?.map((role, index) => (
            <div key={index} className="job-role-card">{role}</div>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <h2>Next Steps</h2>
        <ol className="next-steps-list">
          {career.nextSteps?.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      <Roadmap 
        careerTitle={careerTitle} 
        userProfile={userProfile || {
          currentEducation: 'Not specified',
          interests: [],
          skills: [],
          strongSubjects: []
        }}
      />

      <SkillGapAnalysis 
        careerTitle={careerTitle} 
        userProfile={userProfile || {
          currentEducation: 'Not specified',
          interests: [],
          skills: [],
          strongSubjects: []
        }}
      />

      <LearningRecommendations careerTitle={careerTitle} />
    </div>
  );
}