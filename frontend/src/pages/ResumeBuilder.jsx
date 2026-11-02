import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resumeAPI, authAPI, recommendationAPI, skillGapAPI } from '../services/api';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import './ResumeBuilder.css';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resume, setResume] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [skillGaps, setSkillGaps] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (id) {
      loadResume(id);
    } else {
      // Initialize empty resume
      setResume({
        name: '',
        template: 'classic',
        personalInfo: {},
        summary: '',
        education: [],
        technicalSkills: [],
        softSkills: [],
        projects: [],
        experience: [],
        certifications: [],
        achievements: [],
        courses: [],
        socialLinks: {}
      });
    }
    loadUserProfile();
    loadRecommendations();
    loadSkillGaps();
  }, [id]);

  const loadResume = async (resumeId) => {
    setLoading(true);
    try {
      const { data } = await resumeAPI.getResumeById(resumeId);
      setResume(data);
    } catch (err) {
      setError('Unable to load resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data } = await authAPI.getMe();
      setUserProfile(data);
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  };

  const loadRecommendations = async () => {
    try {
      const { data } = await recommendationAPI.getRecommendations({});
      setRecommendations(data);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    }
  };

  const loadSkillGaps = async () => {
    try {
      const { data } = await skillGapAPI.getUserSkillGaps();
      setSkillGaps(data);
    } catch (err) {
      console.error('Error loading skill gaps:', err);
    }
  };

  const handleSave = async (resumeData) => {
    setLoading(true);
    setError('');
    try {
      if (id) {
        const { data } = await resumeAPI.updateResume(id, resumeData);
        setResume(data.resume);
      } else {
        const { data } = await resumeAPI.createResume(resumeData);
        navigate(`/resume-builder/${data.resume.id}`);
      }
      alert('Resume saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    setLoading(true);
    try {
      await resumeAPI.deleteResume(id);
      navigate('/resume-dashboard');
    } catch (err) {
      setError('Unable to delete resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !resume) {
    return (
      <div className="resume-builder">
        <div className="loading-state">
          <p>Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="resume-builder">
        <div className="loading-state">
          <p>Initializing resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-builder">
      <div className="resume-builder-header">
        <h1>{id ? 'Edit Resume' : 'Create Resume'}</h1>
        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          {id && (
            <button className="btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button className="btn-secondary" onClick={() => navigate('/resume-dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>

      {error && (
        <div className="error-state">
          <p className="error">{error}</p>
        </div>
      )}

      {showPreview && resume ? (
        <ResumePreview resume={resume} userProfile={userProfile} />
      ) : (
        <ResumeForm
          resume={resume}
          userProfile={userProfile}
          recommendations={recommendations}
          skillGaps={skillGaps}
          onSave={handleSave}
          loading={loading}
        />
      )}
    </div>
  );
}
