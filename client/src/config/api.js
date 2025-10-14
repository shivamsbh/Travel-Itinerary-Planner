// API configuration for different environments

const API_CONFIG = {
  development: {
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
    timeout: 10000,
  },
  production: {
    baseURL: process.env.REACT_APP_API_BASE_URL || 'https://your-backend-domain.com',
    timeout: 15000,
  }
};

const environment = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';

export const apiConfig = API_CONFIG[environment];

// API utility function
export const apiCall = async (endpoint, options = {}) => {
  const url = `${apiConfig.baseURL}${endpoint}`;
  
  const defaultOptions = {
    timeout: apiConfig.timeout,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// API endpoints
export const API_ENDPOINTS = {
  // States and locations
  STATES: '/api/states',
  LOCATIONS: (state) => `/api/locations/${encodeURIComponent(state)}`,
  
  // Trip management
  TRIPS: '/api/trips',
  TRIP_DETAILS: (tripId) => `/api/trips/${tripId}`,
  GENERATE_ITINERARY: (tripId) => `/api/trips/${tripId}/generate-itinerary`,
  UPDATE_ITINERARY: (tripId) => `/api/trips/${tripId}/itinerary`,
  SHARE_TRIP: (tripId) => `/api/trips/${tripId}/share`,
  
  // Shared itineraries
  SHARED_ITINERARY: (shareId) => `/api/shared/${shareId}`,
};

export default apiConfig;