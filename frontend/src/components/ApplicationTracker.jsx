import React, { useState, useEffect } from 'react';
import { opportunityAPI } from '../services/api';

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [editingApplication, setEditingApplication] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const statusOptions = ['Saved', 'Applied', 'Interview', 'Offer Received', 'Rejected', 'Withdrawn'];

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (statusFilter) {
      setFilteredApplications(applications.filter(app => app.status === statusFilter));
    } else {
      setFilteredApplications(applications);
    }
  }, [statusFilter, applications]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await opportunityAPI.getUserApplications();
      setApplications(response.data.applications);
      setFilteredApplications(response.data.applications);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load applications');
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await opportunityAPI.updateApplicationTracking(applicationId, { status: newStatus });
      alert('Application status updated successfully');
      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update application status');
    }
  };

  const handleEdit = (application) => {
    setEditingApplication(application);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { status, notes, interviewDate } = editingApplication;
      await opportunityAPI.updateApplicationTracking(editingApplication.id, {
        status,
        notes,
        interviewDate
      });
      alert('Application updated successfully');
      setShowEditModal(false);
      setEditingApplication(null);
      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update application');
    }
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application tracking entry?')) {
      return;
    }

    try {
      await opportunityAPI.deleteApplicationTracking(applicationId);
      alert('Application tracking deleted successfully');
      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete application');
    }
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button onClick={loadApplications} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Applications Tracked</h3>
        <p>You haven't started tracking any applications yet. Save opportunities and track your application progress.</p>
      </div>
    );
  }

  return (
    <div className="application-tracker">
      <h2>Application Tracker</h2>

      <div className="tracker-filters">
        <label>Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <p className="count">Showing {filteredApplications.length} of {applications.length} application(s)</p>

      <div className="applications-list">
        {filteredApplications.map(application => (
          <ApplicationCard
            key={application.id}
            application={application}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            statusOptions={statusOptions}
          />
        ))}
      </div>

      {showEditModal && (
        <EditModal
          application={editingApplication}
          statusOptions={statusOptions}
          onUpdate={handleUpdate}
          onClose={() => {
            setShowEditModal(false);
            setEditingApplication(null);
          }}
        />
      )}

      <div className="info-note">
        <p><strong>Note:</strong> Application status is user-managed. Clicking an external application link does not automatically mark you as applied.</p>
      </div>
    </div>
  );
}

function ApplicationCard({ application, onStatusChange, onEdit, onDelete, statusOptions }) {
  const opportunity = application.opportunity;
  const isSample = opportunity?.isSample || opportunity?.dataVerificationStatus === 'sample';

  const getStatusClass = (status) => {
    switch (status) {
      case 'Applied': return 'applied';
      case 'Interview': return 'interview';
      case 'Offer Received': return 'offer';
      case 'Rejected': return 'rejected';
      case 'Withdrawn': return 'withdrawn';
      default: return 'saved';
    }
  };

  return (
    <div className="application-card">
      <div className="card-header">
        <h3>{opportunity?.title || 'Unknown Opportunity'}</h3>
        <span className={`status-badge ${getStatusClass(application.status)}`}>
          {application.status}
        </span>
      </div>

      <div className="card-body">
        <p className="company">{opportunity?.company || 'Unknown Company'}</p>
        <div className="meta-info">
          <span>📍 {opportunity?.location}</span>
          <span>💼 {opportunity?.workMode}</span>
        </div>

        {isSample && (
          <div className="sample-warning">
            ⚠️ This is a sample opportunity for demonstration purposes only.
          </div>
        )}

        {application.applicationDate && (
          <p className="application-date">
            Applied on {new Date(application.applicationDate).toLocaleDateString()}
          </p>
        )}

        {application.interviewDate && (
          <p className="interview-date">
            📅 Interview scheduled for {new Date(application.interviewDate).toLocaleDateString()}
          </p>
        )}

        {application.notes && (
          <div className="notes-section">
            <strong>Notes:</strong>
            <p>{application.notes}</p>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="status-change">
          <label>Change Status:</label>
          <select
            value={application.status}
            onChange={(e) => onStatusChange(application.id, e.target.value)}
            className="status-select"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <button onClick={() => onEdit(application)} className="btn btn-secondary">
          Edit
        </button>

        <button onClick={() => onDelete(application.id)} className="btn btn-danger">
          Delete
        </button>

        {opportunity?.applicationUrl && (
          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            View Application
          </a>
        )}
      </div>
    </div>
  );
}

function EditModal({ application, statusOptions, onUpdate, onClose }) {
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes || '');
  const [interviewDate, setInterviewDate] = useState(application.interviewDate || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...application,
      status,
      notes,
      interviewDate
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Application</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              {statusOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Interview Date</label>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Add notes about this application..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
