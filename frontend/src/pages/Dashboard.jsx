import React, { useState } from 'react';
import AssessmentForm from '../components/AssessmentForm';
import Recommendations from '../components/Recommendations';
import { assessmentAPI, recommendationAPI } from '../services/api';

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAssessmentSubmit = async (answers) => {
    setLoading(true);
    setError('');
    try {
      // Save the assessment for history
      await assessmentAPI.submit(answers);
      // Get recommendations based on the same answers
      const { data } = await recommendationAPI.getRecommendations(answers);
      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2>Career & Education Assessment</h2>
      <p>Answer a few questions and get personalized career + course recommendations.</p>
      {error && <p className="error">{error}</p>}
      <AssessmentForm onSubmit={handleAssessmentSubmit} loading={loading} />
      <Recommendations recommendations={recommendations} />
    </div>
  );
}
