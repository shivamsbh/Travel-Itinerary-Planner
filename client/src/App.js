import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TripPlanner from './components/TripPlanner';
import SharedItinerary from './components/SharedItinerary';
import TestComponent from './components/TestComponent';

function App() {
  // Temporary test mode - remove this after debugging
  const isTestMode = !process.env.REACT_APP_API_BASE_URL;
  
  if (isTestMode) {
    return (
      <div className="App">
        <TestComponent />
      </div>
    );
  }
  
  return (
    <div className="App">
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<TripPlanner />} />
          <Route path="/share/:shareId" element={<SharedItinerary />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;