import { Navigate } from 'react-router-dom';

// This is the bouncer at the dashboard door
// If familyCode exists → let them in
// If not → send them back to login
function ProtectedRoute({ familyCode, children }) {
  if (!familyCode) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;