import React from 'react';

const TestComponent = () => {
  console.log('TestComponent rendered successfully');
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 React App is Working!</h1>
      <p>If you can see this, the deployment is successful.</p>
      <p>Check the browser console for any errors.</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Debug Info:</h3>
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>API Base URL: {process.env.REACT_APP_API_BASE_URL || 'Not set'}</p>
        <p>Current Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TestComponent;