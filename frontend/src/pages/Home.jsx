import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find the Career & Education Path That Fits You</h1>
          <p className="hero-description">
            One-Stop Personalized Career & Education Advisor helps you discover careers and
            courses matched to your interests, strengths, skills, and personality — in minutes.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <button className="btn btn-secondary">Watch How It Works</button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="illustration-content">
            <div className="main-icon">💻</div>
            <div className="floating-icons">
              <div className="floating-icon career-guidance">🎯 Career Guidance</div>
              <div className="floating-icon scholarships">💰 Scholarships</div>
              <div className="floating-icon entrance-exams">📝 Entrance Exams</div>
              <div className="floating-icon college-finder">🏫 College Finder</div>
              <div className="floating-icon skill-development">🚀 Skill Development</div>
              <div className="floating-icon internships">💼 Internships & Jobs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">50K+</div>
          <div className="stat-label">Students Guided</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">15K+</div>
          <div className="stat-label">Colleges & Courses</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">1000+</div>
          <div className="stat-label">Entrance Exams Covered</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">10K+</div>
          <div className="stat-label">Scholarships Available</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">5K+</div>
          <div className="stat-label">Internships & Jobs</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Everything You Need in One Place</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalized Recommendations</h3>
            <p>AI-powered career and course suggestions based on your unique profile</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏫</div>
            <h3>School, Boarding & Govt. School Finder</h3>
            <p>Discover the perfect educational institution for your needs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>College & Course Finder</h3>
            <p>Explore thousands of colleges and courses across various fields</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Career Roadmap</h3>
            <p>Step-by-step guidance to achieve your career goals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Skill Gap & Development</h3>
            <p>Identify and improve the skills needed for your dream career</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Internships & Job Opportunities</h3>
            <p>Access real-world experience and job openings</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon">👤</div>
            <h3>Create Profile</h3>
            <p>Sign up and build your academic profile</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon">📋</div>
            <h3>Assessment</h3>
            <p>Complete our comprehensive career assessment</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon">✨</div>
            <h3>Get Recommendations</h3>
            <p>Receive personalized career and course suggestions</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-icon">🎯</div>
            <h3>Plan Your Path</h3>
            <p>Create a roadmap to achieve your goals</p>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <div className="step-icon">🏆</div>
            <h3>Achieve Success</h3>
            <p>Track progress and reach your career objectives</p>
          </div>
        </div>
      </section>
    </div>
  );
}
