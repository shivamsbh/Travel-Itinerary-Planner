import React, { useState, useEffect } from 'react';
import { apiCall, API_ENDPOINTS } from '../config/api';

const TripForm = ({ onTripCreated }) => {
  const [states, setStates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    state: '',
    destination: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (formData.state) {
      fetchLocations(formData.state);
    }
  }, [formData.state]);

  const fetchStates = async () => {
    try {
      console.log('Fetching states from:', `${process.env.REACT_APP_API_BASE_URL || 'https://jsonplaceholder.typicode.com'}${API_ENDPOINTS.STATES}`);
      const data = await apiCall(API_ENDPOINTS.STATES);
      console.log('States fetched successfully:', data);
      setStates(data);
    } catch (err) {
      console.error('Failed to fetch states:', err);
      setError(`Failed to fetch states: ${err.message}`);
      // Provide fallback data so app doesn't break
      setStates(['California', 'New York', 'Texas', 'Florida', 'Colorado']);
    }
  };

  const fetchLocations = async (state) => {
    try {
      console.log('Fetching locations for state:', state);
      const data = await apiCall(API_ENDPOINTS.LOCATIONS(state));
      console.log('Locations fetched successfully:', data);
      setLocations(data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setError(`Failed to fetch locations: ${err.message}`);
      // Provide fallback data
      setLocations([
        { id: 1, name: 'Sample City 1' },
        { id: 2, name: 'Sample City 2' },
        { id: 3, name: 'Sample City 3' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'state' && { destination: '' }) // Reset destination when state changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.state || !formData.destination || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate <= startDate) {
      setError('End date must be after start date');
      setLoading(false);
      return;
    }

    const daysDifference = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (daysDifference > 10) {
      setError('Trip duration cannot exceed 10 days');
      setLoading(false);
      return;
    }

    try {
      const data = await apiCall(API_ENDPOINTS.TRIPS, {
        method: 'POST',
        body: JSON.stringify({
          destination: `${formData.destination}, ${formData.state}`,
          startDate: formData.startDate,
          endDate: formData.endDate,
          notes: formData.notes,
          selectedActivities: [] // Will be populated later
        }),
      });

      onTripCreated(data.trip, data.tripId);
    } catch (err) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: '#333' }}>Plan Your Trip</h2>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="state">State *</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="form-control"
            required
          >
            <option value="">Select a state</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="destination">Destination *</label>
          <select
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            className="form-control"
            required
            disabled={!formData.state}
          >
            <option value="">Select a destination</option>
            {locations.map(location => (
              <option key={location.id} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="form-control"
              min={getTodayDate()}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="endDate">End Date *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="form-control"
              min={formData.startDate || getTodayDate()}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="form-control"
            rows="3"
            placeholder="Any special preferences or requirements..."
          />
        </div>

        <button
          type="submit"
          className="btn"
          disabled={loading}
        >
          {loading ? 'Creating Trip...' : 'Continue to Activities'}
        </button>
      </form>
    </div>
  );
};

export default TripForm;