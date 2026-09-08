import React, { useState } from 'react';

const INTEREST_OPTIONS = ['technology', 'design', 'business', 'healthcare', 'science', 'art', 'writing', 'engineering'];
const SUBJECT_OPTIONS = ['math', 'biology', 'chemistry', 'physics', 'computer science', 'languages', 'statistics'];
const SKILL_OPTIONS = ['problem-solving', 'communication', 'creativity', 'leadership', 'research'];
const PERSONALITY_OPTIONS = ['analytical', 'creative', 'social', 'leadership'];
const WORKSTYLE_OPTIONS = ['independent', 'team-based', 'business', 'helping others'];

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function AssessmentForm({ onSubmit, loading }) {
  const [interests, setInterests] = useState([]);
  const [strongSubjects, setStrongSubjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [personality, setPersonality] = useState('');
  const [workStylePreference, setWorkStylePreference] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ interests, strongSubjects, skills, personality, workStylePreference });
  };

  const CheckboxGroup = ({ label, options, selected, setSelected }) => (
    <fieldset className="form-group">
      <legend>{label}</legend>
      <div className="chip-group">
        {options.map((opt) => (
          <label key={opt} className={`chip ${selected.includes(opt) ? 'chip-selected' : ''}`}>
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => setSelected(toggleValue(selected, opt))}
            />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <form onSubmit={handleSubmit} className="assessment-form">
      <CheckboxGroup label="Your Interests" options={INTEREST_OPTIONS} selected={interests} setSelected={setInterests} />
      <CheckboxGroup label="Strong Subjects" options={SUBJECT_OPTIONS} selected={strongSubjects} setSelected={setStrongSubjects} />
      <CheckboxGroup label="Your Skills" options={SKILL_OPTIONS} selected={skills} setSelected={setSkills} />

      <div className="form-group">
        <label>Personality Type</label>
        <select value={personality} onChange={(e) => setPersonality(e.target.value)} required>
          <option value="">Select...</option>
          {PERSONALITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Preferred Work Style</label>
        <select value={workStylePreference} onChange={(e) => setWorkStylePreference(e.target.value)} required>
          <option value="">Select...</option>
          {WORKSTYLE_OPTIONS.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Analyzing...' : 'Get My Recommendations'}
      </button>
    </form>
  );
}
