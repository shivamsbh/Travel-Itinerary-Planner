import React from 'react';

const Header = () => {
  return (
    <div className="header">
      <div className="container">
        <h1>Travel Itinerary Planner</h1>
        <p style={{ textAlign: 'center', marginTop: '10px', opacity: 0.9 }}>
          Organize your multi-day trips with intelligent scheduling
        </p>
      </div>
    </div>
  );
};

export default Header;