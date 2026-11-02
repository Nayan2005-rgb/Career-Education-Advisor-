import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import './ResumeBuilder.css';

export default function ResumeDashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const { data } = await resumeAPI.getUserResumes();
      setResumes(data.resumes || []);
    } catch (err) {
      setError('Unable to load resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = () => {
    navigate('/resume-builder');
  };

  const handleEditResume = (resumeId) => {
    navigate(`/resume-builder/${resumeId}`);
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await resumeAPI.deleteResume(resumeId);
      setResumes(resumes.filter(r => r.id !== resumeId));
    } catch (err) {
      setError('Unable to delete resume. Please try again.');
    }
  };

  const handleRenameResume = async (resumeId, currentName) => {
    const newName = prompt('Enter new resume name:', currentName);
    if (!newName || newName === currentName) {
      return;
    }

    try {
      const { data } = await resumeAPI.updateResume(resumeId, { name: newName });
      setResumes(resumes.map(r => r.id === resumeId ? data.resume : r));
    } catch (err) {
      setError('Unable to rename resume. Please try again.');
    }
  };

  const getTemplateLabel = (template) => {
    const labels = {
      classic: 'Classic Professional',
      modern: 'Modern Minimal',
      technical: 'Technical / Software Developer'
    };
    return labels[template] || template;
  };

  if (loading) {
    return (
      <div className="resume-dashboard">
        <div className="loading-state">
          <p>Loading resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-dashboard">
      <div className="dashboard-header">
        <h1>My Resumes</h1>
        <button className="btn-primary" onClick={handleCreateResume}>
          + Create New Resume
        </button>
      </div>

      {error && (
        <div className="error-state">
          <p className="error">{error}</p>
        </div>
      )}

      {resumes.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any resumes yet.</p>
          <button className="btn-primary" onClick={handleCreateResume}>
            Create Your First Resume
          </button>
        </div>
      ) : (
        <div className="resumes-grid">
          {resumes.map(resume => (
            <div key={resume.id} className="resume-card">
              <div className="resume-card-header">
                <h3>{resume.name}</h3>
                <span className="template-badge">{getTemplateLabel(resume.template)}</span>
              </div>
              <div className="resume-card-body">
                <p className="resume-date">
                  Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <p className="resume-count">
                  {resume.education?.length || 0} education entries,
                  {resume.experience?.length || 0} experience entries,
                  {resume.projects?.length || 0} projects
                </p>
              </div>
              <div className="resume-card-actions">
                <button
                  className="btn-primary"
                  onClick={() => handleEditResume(resume.id)}
                >
                  Edit
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleRenameResume(resume.id, resume.name)}
                >
                  Rename
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDeleteResume(resume.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
