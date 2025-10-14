import React, { useState } from 'react';

const ItineraryGenerator = ({ 
  tripId, 
  tripData, 
  selectedActivities, 
  onItineraryGenerated, 
  onBack 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const handleGenerateItinerary = async () => {
    setLoading(true);
    setError('');

    console.log('Generating itinerary with activities:', selectedActivities);

    try {
      const response = await fetch(`/api/trips/${tripId}/generate-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedActivities: selectedActivities
        }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        if (data.itinerary && data.itinerary.length > 0) {
          setGeneratedItinerary(data.itinerary);
          onItineraryGenerated(data.itinerary);
        } else {
          setError('No itinerary was generated. Please check your selected activities.');
        }
      } else {
        setError(data.error || 'Failed to generate itinerary');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalDays = () => {
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getTotalDuration = () => {
    return selectedActivities.reduce((total, activity) => total + activity.duration, 0);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getCategoryBadgeClass = (category) => {
    return `badge badge-${category}`;
  };

  return (
    <div>
      <div className="card">
        <h2 style={{ marginBottom: '16px', color: '#333' }}>Generate Your Itinerary</h2>
        
        {error && <div className="error">{error}</div>}

        {!generatedItinerary && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px', color: '#333' }}>Trip Summary</h3>
              <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                <p><strong>Destination:</strong> {tripData.destination}</p>
                <p><strong>Duration:</strong> {getTotalDays()} days</p>
                <p><strong>Start Date:</strong> {formatDate(tripData.startDate)}</p>
                <p><strong>End Date:</strong> {formatDate(tripData.endDate)}</p>
                <p><strong>Selected Activities:</strong> {selectedActivities.length}</p>
                <p><strong>Total Activity Time:</strong> {getTotalDuration()} hours</p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px', color: '#333' }}>Selected Activities</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '12px'
              }}>
                {selectedActivities.map(activity => (
                  <div
                    key={activity.id}
                    style={{
                      background: '#f8f9fa',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}
                  >
                    <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{activity.name}</h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={getCategoryBadgeClass(activity.category)}>
                        {activity.category}
                      </span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {activity.duration}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ 
              background: '#e3f2fd', 
              padding: '16px', 
              borderRadius: '8px', 
              marginBottom: '24px' 
            }}>
              <h4 style={{ marginBottom: '8px', color: '#1976d2' }}>How it works:</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
                <li>Activities are intelligently distributed across your trip days</li>
                <li>Similar activities and locations are grouped together when possible</li>
                <li>Each day is planned for approximately 8 hours of activities</li>
                <li>You can customize the generated schedule in the next step</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onBack}
                className="btn btn-secondary"
              >
                Back to Activities
              </button>
              <button
                type="button"
                onClick={handleGenerateItinerary}
                className="btn"
                disabled={loading}
              >
                {loading ? 'Generating Schedule...' : 'Generate Smart Schedule'}
              </button>
            </div>
          </>
        )}

        {generatedItinerary && (
          <div>
            <div className="success" style={{ marginBottom: '24px' }}>
              ✅ Your itinerary has been generated successfully! Review it below and customize as needed.
            </div>

            <div style={{ marginBottom: '24px' }}>
              {generatedItinerary.map(day => (
                <div key={day.day} className="day-card">
                  <h3 style={{ marginBottom: '12px' }}>
                    Day {day.day} - {formatDate(day.date)}
                  </h3>
                  
                  {day.activities.length === 0 ? (
                    <div className="activity-item">
                      <span style={{ fontStyle: 'italic', color: '#666' }}>
                        Free day - no activities scheduled
                      </span>
                    </div>
                  ) : (
                    day.activities.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div>
                          <strong>{activity.name}</strong>
                          <br />
                          <small style={{ opacity: 0.8 }}>
                            {activity.startTime} - {activity.endTime} • {activity.category}
                          </small>
                        </div>
                        <div>
                          <span className={getCategoryBadgeClass(activity.category)}>
                            {activity.duration}h
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onItineraryGenerated(generatedItinerary)}
              className="btn btn-success"
            >
              Continue to Customize & Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryGenerator;