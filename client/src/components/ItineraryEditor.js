import React, { useState } from 'react';

const ItineraryEditor = ({ tripId, tripData, itinerary, onItineraryUpdated, onBack }) => {
  const [editableItinerary, setEditableItinerary] = useState(itinerary);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getCategoryBadgeClass = (category) => {
    return `badge badge-${category}`;
  };

  const moveActivity = (fromDay, fromIndex, toDay, toIndex) => {
    const newItinerary = [...editableItinerary];
    const activity = newItinerary[fromDay].activities[fromIndex];
    
    // Remove from source
    newItinerary[fromDay].activities.splice(fromIndex, 1);
    
    // Add to destination
    if (toIndex === undefined) {
      newItinerary[toDay].activities.push(activity);
    } else {
      newItinerary[toDay].activities.splice(toIndex, 0, activity);
    }
    
    // Recalculate times for both affected days
    recalculateTimes(newItinerary[fromDay]);
    recalculateTimes(newItinerary[toDay]);
    
    setEditableItinerary(newItinerary);
    setSuccess('Activity moved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const removeActivity = (dayIndex, activityIndex) => {
    const newItinerary = [...editableItinerary];
    newItinerary[dayIndex].activities.splice(activityIndex, 1);
    recalculateTimes(newItinerary[dayIndex]);
    setEditableItinerary(newItinerary);
    setSuccess('Activity removed successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const recalculateTimes = (day) => {
    let currentTime = 9; // Start at 9 AM
    day.activities.forEach(activity => {
      activity.startTime = `${Math.floor(currentTime)}:${currentTime % 1 === 0 ? '00' : '30'}`;
      currentTime += activity.duration;
      activity.endTime = `${Math.floor(currentTime)}:${currentTime % 1 === 0 ? '00' : '30'}`;
    });
  };

  const saveItinerary = async () => {
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/trips/${tripId}/itinerary`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itinerary: editableItinerary
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onItineraryUpdated(editableItinerary);
        setSuccess('Itinerary saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save itinerary');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const createShareLink = async () => {
    setSharing(true);
    setError('');

    try {
      const response = await fetch(`/api/trips/${tripId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        const fullUrl = `${window.location.origin}${data.shareUrl}`;
        setShareUrl(fullUrl);
        setSuccess('Share link created successfully!');
      } else {
        setError(data.error || 'Failed to create share link');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setSuccess('Link copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div>
      <div className="card">
        <h2 style={{ marginBottom: '16px', color: '#333' }}>Customize Your Itinerary</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          Drag activities between days, remove unwanted items, or save and share your perfect itinerary.
        </p>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Trip Summary */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}>
          <h3 style={{ marginBottom: '8px', color: '#333' }}>Trip Summary</h3>
          <p><strong>Destination:</strong> {tripData.destination}</p>
          <p><strong>Duration:</strong> {editableItinerary.length} days</p>
          <p><strong>Total Activities:</strong> {editableItinerary.reduce((total, day) => total + day.activities.length, 0)}</p>
        </div>

        {/* Editable Itinerary */}
        <div style={{ marginBottom: '24px' }}>
          {editableItinerary.map((day, dayIndex) => (
            <div key={day.day} className="day-card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '16px' }}>
                Day {day.day} - {formatDate(day.date)}
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: 'normal', 
                  marginLeft: '12px',
                  opacity: 0.8 
                }}>
                  ({day.activities.length} activities)
                </span>
              </h3>
              
              {day.activities.length === 0 ? (
                <div className="activity-item">
                  <span style={{ fontStyle: 'italic', color: '#666' }}>
                    Free day - no activities scheduled
                  </span>
                </div>
              ) : (
                day.activities.map((activity, activityIndex) => (
                  <div key={`${activity.id}-${activityIndex}`} className="activity-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong>{activity.name}</strong>
                          <br />
                          <small style={{ opacity: 0.8 }}>
                            {activity.startTime} - {activity.endTime} • {activity.description}
                          </small>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className={getCategoryBadgeClass(activity.category)}>
                            {activity.duration}h
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                      {/* Move to Previous Day */}
                      {dayIndex > 0 && (
                        <button
                          onClick={() => moveActivity(dayIndex, activityIndex, dayIndex - 1)}
                          style={{
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                          title="Move to previous day"
                        >
                          ← Day {day.day - 1}
                        </button>
                      )}
                      
                      {/* Move to Next Day */}
                      {dayIndex < editableItinerary.length - 1 && (
                        <button
                          onClick={() => moveActivity(dayIndex, activityIndex, dayIndex + 1)}
                          style={{
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                          title="Move to next day"
                        >
                          Day {day.day + 1} →
                        </button>
                      )}
                      
                      {/* Remove Activity */}
                      <button
                        onClick={() => removeActivity(dayIndex, activityIndex)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                        title="Remove activity"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary"
          >
            Back to Generator
          </button>
          <button
            type="button"
            onClick={saveItinerary}
            className="btn"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={createShareLink}
            className="btn btn-success"
            disabled={sharing}
          >
            {sharing ? 'Creating Link...' : 'Create Share Link'}
          </button>
        </div>

        {/* Share Link Section */}
        {shareUrl && (
          <div style={{ 
            background: '#d4edda', 
            border: '1px solid #c3e6cb',
            borderRadius: '8px', 
            padding: '16px' 
          }}>
            <h3 style={{ marginBottom: '12px', color: '#155724' }}>Share Your Itinerary</h3>
            <p style={{ marginBottom: '12px', color: '#155724' }}>
              Your itinerary is ready to share! Send this link to your travel companions:
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              alignItems: 'center',
              background: 'white',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #c3e6cb'
            }}>
              <input
                type="text"
                value={shareUrl}
                readOnly
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={copyToClipboard}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
            </div>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#155724' }}>
              📱 No login required - anyone with this link can view your itinerary
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryEditor;