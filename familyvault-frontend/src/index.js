import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import ProtectedRoute from './ProtectedRoute';
import reportWebVitals from './reportWebVitals';

function AuthWrapper() {
  // Store the logged-in family's credentials
  const [familyCode, setFamilyCode] = useState(null);
  const [pin, setPin] = useState(null);

  // Called when login is successful
  const handleLoginSuccess = (code, p) => {
    setFamilyCode(code);
    setPin(p);
  };

  // Called when user clicks logout
  const handleLogout = () => {
    setFamilyCode(null);
    setPin(null);
  };

  return (
    <Router>
      <Routes>
        {/* Landing page - public */}
        <Route path="/" element={<LandingPage />} />

        {/* Login page - public */}
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Dashboard - protected, only if logged in */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute familyCode={familyCode}>
              <App
                familyCode={familyCode}
                pin={pin}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthWrapper />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
