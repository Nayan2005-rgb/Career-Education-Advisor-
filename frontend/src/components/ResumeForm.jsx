import React, { useState, useEffect } from 'react';

export default function ResumeForm({ resume, userProfile, recommendations, skillGaps, onSave, loading }) {
  const [formData, setFormData] = useState(resume || {
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
  const [activeSection, setActiveSection] = useState('personal');

  useEffect(() => {
    if (resume) {
      setFormData(resume);
    }
  }, [resume]);

  const handleChange = (section, field, value) => {
    setFormData(prev => {
      if (Array.isArray(prev[section])) {
        return {
          ...prev,
          [section]: value
        };
      }
      return {
        ...prev,
        [section]: typeof prev[section] === 'object' ? {
          ...prev[section],
          [field]: value
        } : value
      };
    });
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => {
        if (i === index) {
          // If field is provided, it's an object; otherwise it's a simple value
          if (field !== undefined && field !== '') {
            return { ...item, [field]: value };
          }
          return value;
        }
        return item;
      })
    }));
  };

  const addArrayItem = (section, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], defaultItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const moveArrayItem = (section, fromIndex, toIndex) => {
    const items = [...formData[section]];
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);
    setFormData(prev => ({
      ...prev,
      [section]: items
    }));
  };

  const sections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'courses', label: 'Courses' },
    { id: 'social', label: 'Social Links' },
    { id: 'template', label: 'Template' }
  ];

  return (
    <form onSubmit={handleSubmit} className="resume-form">
      <div className="form-layout">
        <div className="form-sidebar">
          <h3>Sections</h3>
          {sections.map(section => (
            <button
              key={section.id}
              type="button"
              className={`section-nav-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="form-content">
          {activeSection === 'personal' && (
            <div className="form-section">
              <h3>Resume Name</h3>
              <div className="form-group">
                <label>Resume Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Software Engineer Resume"
                />
              </div>
              <h3>Personal Information</h3>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.personalInfo.name || ''}
                  onChange={(e) => handleChange('personalInfo', 'name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.personalInfo.email || ''}
                  onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone || ''}
                  onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.personalInfo.address || ''}
                  onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                  placeholder="City, State, Country"
                />
              </div>
              {userProfile && (
                <div className="profile-suggestion">
                  <p className="suggestion-label">Suggestion from your profile:</p>
                  <button
                    type="button"
                    className="btn-small"
                    onClick={() => {
                      handleChange('personalInfo', 'name', userProfile.name);
                      handleChange('personalInfo', 'email', userProfile.email);
                    }}
                  >
                    Use Profile Data
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSection === 'summary' && (
            <div className="form-section">
              <h3>Professional Summary</h3>
              <div className="form-group">
                <label>Summary</label>
                <textarea
                  value={formData.summary || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Write a brief professional summary..."
                  rows={6}
                />
              </div>
            </div>
          )}

          {activeSection === 'education' && (
            <div className="form-section">
              <h3>Education</h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-header">
                    <h4>Education #{index + 1}</h4>
                    <div className="array-item-actions">
                      <button
                        type="button"
                        onClick={() => moveArrayItem('education', index, index - 1)}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveArrayItem('education', index, index + 1)}
                        disabled={index === formData.education.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('education', index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Institution</label>
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                      placeholder="University/School Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                      placeholder="B.Tech, B.Sc, etc."
                    />
                  </div>
                  <div className="form-group">
                    <label>Field of Study</label>
                    <input
                      type="text"
                      value={edu.field || ''}
                      onChange={(e) => handleArrayChange('education', index, 'field', e.target.value)}
                      placeholder="Computer Science, etc."
                    />
                  </div>
                  <div className="form-group">
                    <label>Start Year</label>
                    <input
                      type="text"
                      value={edu.startYear || ''}
                      onChange={(e) => handleArrayChange('education', index, 'startYear', e.target.value)}
                      placeholder="2020"
                    />
                  </div>
                  <div className="form-group">
                    <label>End Year</label>
                    <input
                      type="text"
                      value={edu.endYear || ''}
                      onChange={(e) => handleArrayChange('education', index, 'endYear', e.target.value)}
                      placeholder="2024"
                    />
                  </div>
                  <div className="form-group">
                    <label>Grade/Percentage</label>
                    <input
                      type="text"
                      value={edu.grade || ''}
                      onChange={(e) => handleArrayChange('education', index, 'grade', e.target.value)}
                      placeholder="85%, CGPA 8.5, etc."
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => addArrayItem('education', {
                  institution: '',
                  degree: '',
                  field: '',
                  startYear: '',
                  endYear: '',
                  grade: ''
                })}
              >
                + Add Education
              </button>
            </div>
          )}

          {activeSection === 'skills' && (
            <div className="form-section">
              <h3>Skills</h3>
              <div className="skills-subsection">
                <h4>Technical Skills</h4>
                <div className="form-group">
                  <label>Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.technicalSkills.join(', ')}
                    onChange={(e) => setFormData(prev => ({ ...prev, technicalSkills: e.target.value.split(',').map(s => s.trim()) }))}
                    placeholder="JavaScript, React, Node.js, Python"
                  />
                </div>
                {skillGaps && skillGaps.length > 0 && (
                  <div className="profile-suggestion">
                    <p className="suggestion-label">Suggestion from skill gap analysis:</p>
                    <p className="suggestion-text">Consider including skills from your learning paths</p>
                  </div>
                )}
              </div>
              <div className="skills-subsection">
                <h4>Soft Skills</h4>
                <div className="form-group">
                  <label>Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.softSkills.join(', ')}
                    onChange={(e) => setFormData(prev => ({ ...prev, softSkills: e.target.value.split(',').map(s => s.trim()) }))}
                    placeholder="Communication, Teamwork, Leadership"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="form-section">
              <h3>Work Experience / Internships</h3>
              {formData.experience.map((exp, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-header">
                    <h4>Experience #{index + 1}</h4>
                    <div className="array-item-actions">
                      <button
                        type="button"
                        onClick={() => moveArrayItem('experience', index, index - 1)}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveArrayItem('experience', index, index + 1)}
                        disabled={index === formData.experience.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('experience', index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Company/Organization</label>
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Position/Role</label>
                    <input
                      type="text"
                      value={exp.position || ''}
                      onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                      placeholder="Software Engineer, Intern, etc."
                    />
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate || ''}
                      onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                      placeholder="January 2023"
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="text"
                      value={exp.endDate || ''}
                      onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                      placeholder="Present or December 2023"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={exp.description || ''}
                      onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={4}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => addArrayItem('experience', {
                  company: '',
                  position: '',
                  startDate: '',
                  endDate: '',
                  description: ''
                })}
              >
                + Add Experience
              </button>
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="form-section">
              <h3>Projects</h3>
              {formData.projects.map((project, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-header">
                    <h4>Project #{index + 1}</h4>
                    <div className="array-item-actions">
                      <button
                        type="button"
                        onClick={() => moveArrayItem('projects', index, index - 1)}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveArrayItem('projects', index, index + 1)}
                        disabled={index === formData.projects.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('projects', index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={project.name || ''}
                      onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)}
                      placeholder="Project Title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={project.description || ''}
                      onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                      placeholder="Describe the project..."
                      rows={4}
                    />
                  </div>
                  <div className="form-group">
                    <label>Technologies Used</label>
                    <input
                      type="text"
                      value={project.technologies || ''}
                      onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value)}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Link (optional)</label>
                    <input
                      type="url"
                      value={project.link || ''}
                      onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)}
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => addArrayItem('projects', {
                  name: '',
                  description: '',
                  technologies: '',
                  link: ''
                })}
              >
                + Add Project
              </button>
            </div>
          )}

          {activeSection === 'certifications' && (
            <div className="form-section">
              <h3>Certifications</h3>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-header">
                    <h4>Certification #{index + 1}</h4>
                    <div className="array-item-actions">
                      <button
                        type="button"
                        onClick={() => moveArrayItem('certifications', index, index - 1)}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveArrayItem('certifications', index, index + 1)}
                        disabled={index === formData.certifications.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('certifications', index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Certification Name</label>
                    <input
                      type="text"
                      value={cert.name || ''}
                      onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>
                  <div className="form-group">
                    <label>Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuer || ''}
                      onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date Obtained</label>
                    <input
                      type="text"
                      value={cert.date || ''}
                      onChange={(e) => handleArrayChange('certifications', index, 'date', e.target.value)}
                      placeholder="January 2024"
                    />
                  </div>
                  <div className="form-group">
                    <label>Certificate Link (optional)</label>
                    <input
                      type="url"
                      value={cert.link || ''}
                      onChange={(e) => handleArrayChange('certifications', index, 'link', e.target.value)}
                      placeholder="https://credential URL"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => addArrayItem('certifications', {
                  name: '',
                  issuer: '',
                  date: '',
                  link: ''
                })}
              >
                + Add Certification
              </button>
            </div>
          )}

          {activeSection === 'achievements' && (
            <div className="form-section">
              <h3>Achievements</h3>
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-header">
                    <h4>Achievement #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('achievements', index)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Achievement</label>
                    <input
                      type="text"
                      value={achievement || ''}
                      onChange={(e) => handleArrayChange('achievements', index, '', e.target.value)}
                      placeholder="Won first prize in hackathon"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => addArrayItem('achievements', '')}
              >
                + Add Achievement
              </button>
            </div>
          )}

          {activeSection === 'courses' && (
            <div className="form-section">
              <h3>Relevant Courses</h3>
              {formData.courses.map((course, index) => (
                <div key={index} className="array-item">
                  <div className="array-item-header">
                    <h4>Course #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('courses', index)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Course Name</label>
                    <input
                      type="text"
                      value={course || ''}
                      onChange={(e) => handleArrayChange('courses', index, '', e.target.value)}
                      placeholder="Data Structures and Algorithms"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => addArrayItem('courses', '')}
              >
                + Add Course
              </button>
              {userProfile && userProfile.courses && userProfile.courses.length > 0 && (
                <div className="profile-suggestion">
                  <p className="suggestion-label">Suggestion from your profile:</p>
                  <p className="suggestion-text">{userProfile.courses.join(', ')}</p>
                  <button
                    type="button"
                    className="btn-small"
                    onClick={() => setFormData(prev => ({ ...prev, courses: userProfile.courses }))}
                  >
                    Use Profile Courses
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSection === 'social' && (
            <div className="form-section">
              <h3>Social Links</h3>
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin || ''}
                  onChange={(e) => handleChange('socialLinks', 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="form-group">
                <label>GitHub</label>
                <input
                  type="url"
                  value={formData.socialLinks.github || ''}
                  onChange={(e) => handleChange('socialLinks', 'github', e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="form-group">
                <label>Portfolio Website</label>
                <input
                  type="url"
                  value={formData.socialLinks.portfolio || ''}
                  onChange={(e) => handleChange('socialLinks', 'portfolio', e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          )}

          {activeSection === 'template' && (
            <div className="form-section">
              <h3>Resume Template</h3>
              <div className="template-selection">
                <label>
                  <input
                    type="radio"
                    name="template"
                    value="classic"
                    checked={formData.template === 'classic'}
                    onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                  />
                  <span>Classic Professional</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="template"
                    value="modern"
                    checked={formData.template === 'modern'}
                    onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                  />
                  <span>Modern Minimal</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="template"
                    value="technical"
                    checked={formData.template === 'technical'}
                    onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                  />
                  <span>Technical / Software Developer</span>
                </label>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Resume'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
