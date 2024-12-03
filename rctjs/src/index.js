import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a root and render the application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // Removed React.StrictMode for production stability. Add it back for debugging.
  <App />
);

// Optionally log performance metrics
reportWebVitals(console.log); // Replace console.log with your preferred analytics function
