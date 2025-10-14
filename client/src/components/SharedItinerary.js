import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const SharedItinerary = () => {
  const { shareId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSharedItinerary();
  }, [shareId]);

  const fetchSharedItinerary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shared/${shareId}`);
      const data = await response.json();

      if (response.ok) {
        setItinerary(data);
      } else {
        setError(data.error || 'Shared itinerary not found');
      }
    } catch (err) {
      setError('Failed to load shared itinerary');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getCategoryBadgeClass = (category) => {
    return `badge badge-${category}`;
  };

  const getTotalActivities = () => {
    if (!itinerary?.itinerary) return 0;
    return itinerary.itinerary.reduce((total, day) => total + day.activities.length, 0);
  };

  const printItinerary = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading">Loading shared itinerary...</div>;
  }

  if (error) {
    return (
      <div className="card">
        <div className="error" style={{ marginBottom: '20px' }}>{error}</div>
        <Link to="/" className="btn">
          Create Your Own Itinerary
        </Link>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="card">
        <div className="error">Itinerary not found</div>
        <Link to="/" className="btn">
          Create Your Own Itinerary
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h1 style={{ color: '#333', marginBottom: '8px' }}>
              📍 {itinerary.destination}
            </h1>
            <p style={{ color: '#666', fontSize: '18px' }}>
              {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={printItinerary} className="btn btn-secondary">
              🖨️ Print
            </button>
            <Link to="/" className="btn">
              Create Your Own
            </Link>
          </div>
        </div>

        {/* Trip Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          background: '#f8f9fa',
          padding: '16px',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#007bff', fontSize: '24px', marginBottom: '4px' }}>
              {itinerary.itinerary.length}
            </h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Days</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#28a745', fontSize: '24px', marginBottom: '4px' }}>
              {getTotalActivities()}
            </h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Activities</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#ffc107', fontSize: '24px', marginBottom: '4px' }}>
              {itinerary.itinerary.reduce((total, day) => 
                total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.duration, 0), 0
              )}h
            </h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Total Duration</p>
          </div>
        </div>
      </div>

      {/* Itinerary Days */}
      <div>
        {itinerary.itinerary.map((day, index) => (
          <div key={day.day} className="day-card" style={{ marginBottom: '20px' }}>
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '12px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {day.day}
              </span>
              <div>
                <div>Day {day.day}</div>
                <div style={{ fontSize: '16px', fontWeight: 'normal', opacity: 0.9 }}>
                  {formatDate(day.date)}
                </div>
              </div>
            </h2>
            
            {day.activities.length === 0 ? (
              <div className="activity-item">
                <span style={{ fontStyle: 'italic', color: '#666' }}>
                  🏖️ Free day - no activities scheduled
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="activity-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '18px', marginBottom: '4px', color: '#333' }}>
                            {activity.name}
                          </h4>
                          <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                            {activity.description}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                              🕐 {activity.startTime} - {activity.endTime}
                            </span>
                            <span className={getCategoryBadgeClass(activity.category)}>
                              {activity.category}
                            </span>
                            <span style={{ fontSize: '14px', color: '#666' }}>
                              ⏱️ {activity.duration} hours
                            </span>
                            <span style={{ fontSize: '14px', color: '#666' }}>
                              ⭐ Best time: {activity.bestTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Day Summary */}
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', opacity: 0.9 }}>
                📊 Day {day.day} Summary
              </span>
              <span style={{ fontSize: '14px', opacity: 0.9 }}>
                {day.activities.length} activities • {' '}
                {day.activities.reduce((total, activity) => total + activity.duration, 0)} hours
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="card" style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          Want to create your own travel itinerary with smart scheduling?
        </p>
        <Link to="/" className="btn">
          🚀 Start Planning Your Trip
        </Link>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .btn, button {
            display: none !important;
          }
          
          .day-card {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SharedItinerary;