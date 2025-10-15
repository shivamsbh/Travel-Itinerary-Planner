import React, { useState, useEffect } from 'react';
import { apiCall, API_ENDPOINTS } from '../config/api';

const ActivitySelector = ({ destination, selectedActivities, onActivitiesSelected, onBack }) => {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(selectedActivities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, [destination]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const state = destination.split(', ')[1];
      const data = await apiCall(API_ENDPOINTS.LOCATIONS(state));
      setActivities(data);
    } catch (err) {
      setError('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const handleActivityToggle = (activity) => {
    setSelected(prev => {
      const isSelected = prev.some(a => a.id === activity.id);
      if (isSelected) {
        return prev.filter(a => a.id !== activity.id);
      } else {
        return [...prev, activity];
      }
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      setError('Please select at least one activity');
      return;
    }
    onActivitiesSelected(selected);
  };

  const getCategories = () => {
    const categories = [...new Set(activities.map(activity => activity.category))];
    return ['all', ...categories];
  };

  const getFilteredActivities = () => {
    if (filter === 'all') {
      return activities;
    }
    return activities.filter(activity => activity.category === filter);
  };

  const getCategoryBadgeClass = (category) => {
    return `badge badge-${category}`;
  };

  if (loading) {
    return <div className="loading">Loading activities...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2 style={{ marginBottom: '16px', color: '#333' }}>
          Select Activities for {destination}
        </h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          Choose the activities you'd like to include in your itinerary. 
          Selected: {selected.length} activities
        </p>

        {error && <div className="error">{error}</div>}

        {/* Category Filter */}
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label">Filter by category:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-control"
            style={{ maxWidth: '200px' }}
          >
            {getCategories().map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : 
                 category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Activities Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          {getFilteredActivities().map(activity => (
            <div
              key={activity.id}
              className={`activity-card ${selected.some(a => a.id === activity.id) ? 'selected' : ''}`}
              onClick={(e) => {
                // Only handle click if it's not from the checkbox area
                if (!e.target.closest('.checkbox-container')) {
                  handleActivityToggle(activity);
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#333' }}>
                    {activity.name}
                  </h3>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                    {activity.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    <span className={getCategoryBadgeClass(activity.category)}>
                      {activity.category}
                    </span>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      Duration: {activity.duration}h
                    </span>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      Best: {activity.bestTime}
                    </span>
                  </div>
                </div>
                <div 
                  className="checkbox-container"
                  style={{ 
                    marginLeft: '12px',
                    position: 'relative',
                    zIndex: 10,
                    padding: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActivityToggle(activity);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected.some(a => a.id === activity.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                    }}
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {getFilteredActivities().length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No activities found for the selected category.
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary"
          >
            Back to Trip Details
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="btn"
            disabled={selected.length === 0}
          >
            Generate Schedule ({selected.length} activities)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelector;