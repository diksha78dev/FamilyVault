import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import UploadForm from './UploadForm';
import DocumentList from './DocumentList';

const NAV_ITEMS = [
  { key: 'document', icon: '📋', label: 'All Documents' },
  { key: 'upload', icon: '📤', label: 'Upload Document' },
];

// familyCode and pin come from AuthWrapper as props
// the login page already verified them — no need to ask again
function App({ familyCode, pin , onLogout }) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('document');

  const PAGE_META = {
    document: { title: 'Family Documents', sub: 'View and search all your family documents' },
    upload: { title: 'Upload Document', sub: 'Add a new document to your family vault' },
  };

  // Handle logout: call parent's onLogout and navigate to login
  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="fv-layout">
      {/* Sidebar */}
      <aside className="fv-sidebar">
        <div className="fv-logo">
          <div className="fv-logo-icon">🔐</div>
          <div className="fv-logo-text">FamilyVault</div>
        </div>

        <nav className="fv-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`fv-nav-item ${activeView === item.key ? 'active' : ''}`}
              onClick={() => setActiveView(item.key)}
            >
              <span className="fv-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* show which family is logged in */}
        <div className="fv-sidebar-family">
          📁 Logged in as
          <strong>{familyCode}</strong>
        </div>
        <button
          className="fv-btn fv-btn-outline"
          style={{ margin: '12px', fontSize: '13px' }}
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="fv-main">
        <div className="fv-page-header">
          <div>
            <div className="fv-page-title">{PAGE_META[activeView].title}</div>
            <div className="fv-page-sub">{PAGE_META[activeView].sub}</div>
          </div>
        </div>

        <div className="fv-views">
          {activeView === 'document' && (
            <DocumentList familyCode={familyCode} pin={pin} />
          )}
          {activeView === 'upload' && (
            <UploadForm familyCode={familyCode} pin={pin} />
          )}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fv-mobile-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`fv-mobile-nav-item ${activeView === item.key ? 'active' : ''}`}
            onClick={() => setActiveView(item.key)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;