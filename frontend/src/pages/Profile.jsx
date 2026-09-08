import React, { useEffect, useState } from 'react';
import { authAPI, assessmentAPI } from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, historyRes] = await Promise.all([
          authAPI.getMe(),
          assessmentAPI.getHistory(),
        ]);
        setUser(meRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    };
    load();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Grade/Year:</strong> {user.grade || 'Not specified'}</p>
      </div>

      <h3>Past Assessments</h3>
      {history.length === 0 ? (
        <p>You haven't taken any assessments yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((a) => (
            <li key={a.id}>
              {new Date(a.createdAt).toLocaleDateString()} — Interests: {a.interests.join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
