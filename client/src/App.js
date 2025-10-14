import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TripPlanner from './components/TripPlanner';
import SharedItinerary from './components/SharedItinerary';

function App() {
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