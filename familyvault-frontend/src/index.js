import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import ProtectedRoute from './ProtectedRoute';
import reportWebVitals from './reportWebVitals';

// AuthWrapper is the security guard's cabin
// It holds familyCode + pin state for the whole app
function AuthWrapper() {
  const [familyCode, setFamilyCode] = useState(null);
  const [pin, setPin] = useState(null);

  // LoginPage calls this function when login succeeds
  // this is the "phone number" we gave to the clerk
  const handleLoginSuccess = (code, p) => {
    setFamilyCode(code);
    setPin(p);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* landing page — public */}
        <Route path="/" element={<LandingPage />} />

        {/* login page — public, passes handleLoginSuccess down as prop */}
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* dashboard — protected, only accessible if familyCode exists */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute familyCode={familyCode}>
              <App familyCode={familyCode} pin={pin} />
            </ProtectedRoute>
          }
        />

        {/* any unknown route → go home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthWrapper />
  </React.StrictMode>
);

reportWebVitals();