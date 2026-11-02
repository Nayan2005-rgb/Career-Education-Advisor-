import React from 'react';

export default function ModernTemplate({ resume, userProfile }) {
  const { personalInfo, summary, education, technicalSkills, softSkills, projects, experience, certifications, achievements, courses, socialLinks } = resume;

  return (
    <div className="resume-template modern-template">
      <div className="resume-header">
        <h1 className="name">{personalInfo.name || 'Your Name'}</h1>
        <p className="summary">{summary}</p>
        <div className="contact-info">
          {personalInfo.email && <span className="contact-item">📧 {personalInfo.email}</span>}
          {personalInfo.phone && <span className="contact-item">📱 {personalInfo.phone}</span>}
          {personalInfo.address && <span className="contact-item">📍 {personalInfo.address}</span>}
          {socialLinks.linkedin && <span className="contact-item">💼 {socialLinks.linkedin}</span>}
          {socialLinks.github && <span className="contact-item">💻 {socialLinks.github}</span>}
          {socialLinks.portfolio && <span className="contact-item">🌐 {socialLinks.portfolio}</span>}
        </div>
      </div>

      <div className="resume-body">
        <div className="resume-column left">
          {technicalSkills && technicalSkills.length > 0 && (
            <div className="resume-section">
              <h2>Technical Skills</h2>
              <div className="skills-list">
                {technicalSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {softSkills && softSkills.length > 0 && (
            <div className="resume-section">
              <h2>Soft Skills</h2>
              <div className="skills-list">
                {softSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div className="resume-section">
              <h2>Certifications</h2>
              {certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <p className="cert-name">{cert.name}</p>
                  <p className="cert-details">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          )}

          {courses && courses.length > 0 && (
            <div className="resume-section">
              <h2>Courses</h2>
              <ul>
                {courses.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="resume-column right">
          {experience && experience.length > 0 && (
            <div className="resume-section">
              <h2>Experience</h2>
              {experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <h3>{exp.position}</h3>
                  <p className="company">{exp.company}</p>
                  <p className="dates">{exp.startDate} - {exp.endDate}</p>
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
                  <h3>{edu.degree}</h3>
                  <p className="institution">{edu.institution}</p>
                  <p className="dates">{edu.startYear} - {edu.endYear}</p>
                  {edu.grade && <p className="grade">Grade: {edu.grade}</p>}
                </div>
              ))}
            </div>
          )}

          {projects && projects.length > 0 && (
            <div className="resume-section">
              <h2>Projects</h2>
              {projects.map((project, index) => (
                <div key={index} className="project-item">
                  <h3>{project.name}</h3>
                  {project.description && <p className="description">{project.description}</p>}
                  {project.technologies && <p className="technologies">{project.technologies}</p>}
                  {project.link && <p className="link"><a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a></p>}
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
        </div>
      </div>
    </div>
  );
}
