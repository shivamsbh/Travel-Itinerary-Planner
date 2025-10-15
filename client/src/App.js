import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TripPlanner from './components/TripPlanner';
import SharedItinerary from './components/SharedItinerary';
import TestComponent from './components/TestComponent';

function App() {
  // Add error boundary for debugging
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    const handleError = (error) => {
      console.error('App Error:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
  
  if (hasError) {
    return (
      <div className="App">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>🚨 Something went wrong</h1>
          <p>Check the browser console for error details.</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      </div>
    );
  }
  
  try {
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
  } catch (error) {
    console.error('Render Error:', error);
    return (
      <div className="App">
        <TestComponent />
      </div>
    );
  }
}

export default App;