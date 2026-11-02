import React from 'react';

export default function ClassicTemplate({ resume, userProfile }) {
  const { personalInfo, summary, education, technicalSkills, softSkills, projects, experience, certifications, achievements, courses, socialLinks } = resume;

  return (
    <div className="resume-template classic-template">
      <div className="resume-header">
        <h1 className="name">{personalInfo.name || 'Your Name'}</h1>
        <div className="contact-info">
          {personalInfo.email && <span className="contact-item">{personalInfo.email}</span>}
          {personalInfo.phone && <span className="contact-item">{personalInfo.phone}</span>}
          {personalInfo.address && <span className="contact-item">{personalInfo.address}</span>}
          {socialLinks.linkedin && <span className="contact-item">{socialLinks.linkedin}</span>}
        </div>
      </div>

      {summary && (
        <div className="resume-section">
          <h2>Professional Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="resume-section">
          <h2>Work Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h3>{exp.position}</h3>
                <span className="experience-dates">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="company">{exp.company}</p>
              {exp.description && <p className="description">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {education && education.length > 0 && (
        <div className="resume-section">
          <h2>Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="education-header">
                <h3>{edu.institution}</h3>
                <span className="education-dates">{edu.startYear} - {edu.endYear}</span>
              </div>
              <p className="degree">{edu.degree} in {edu.field}</p>
              {edu.grade && <p className="grade">Grade: {edu.grade}</p>}
            </div>
          ))}
        </div>
      )}

      {technicalSkills && technicalSkills.length > 0 && (
        <div className="resume-section">
          <h2>Technical Skills</h2>
          <p>{technicalSkills.join(', ')}</p>
        </div>
      )}

      {softSkills && softSkills.length > 0 && (
        <div className="resume-section">
          <h2>Soft Skills</h2>
          <p>{softSkills.join(', ')}</p>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="resume-section">
          <h2>Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <h3>{project.name}</h3>
              {project.description && <p className="description">{project.description}</p>}
              {project.technologies && <p className="technologies">Technologies: {project.technologies}</p>}
              {project.link && <p className="link"><a href={project.link} target="_blank" rel="noopener noreferrer">{project.link}</a></p>}
            </div>
          ))}
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div className="resume-section">
          <h2>Certifications</h2>
          {certifications.map((cert, index) => (
            <div key={index} className="certification-item">
              <p><strong>{cert.name}</strong> - {cert.issuer} ({cert.date})</p>
              {cert.link && <p className="link"><a href={cert.link} target="_blank" rel="noopener noreferrer">{cert.link}</a></p>}
            </div>
          ))}
        </div>
      )}

      {achievements && achievements.length > 0 && (
        <div className="resume-section">
          <h2>Achievements</h2>
          <ul>
            {achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}

      {courses && courses.length > 0 && (
        <div className="resume-section">
          <h2>Relevant Courses</h2>
          <p>{courses.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
