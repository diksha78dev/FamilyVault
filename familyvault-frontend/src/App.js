import { useState } from 'react';
import './App.css';
import UploadForm from './UploadForm';
import DocumentList from './DocumentList';

const NAV_ITEMS = [
  {key: 'document', icon: '📋', label : 'All Documents'},
  {key: 'upload' , icon: '📤',label:'Upload Document'},
];

function App() {
  const [activeView , setActiveView] = useState('document');

  const PAGE_META = {
    document : { title: 'Family Documents' , sub: 'View and Search all your family documents'},
    upload: { title: 'Upload Document' , sub: 'Add a new document to your family vault'},
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

        <div className="fv-sidebar-family">
          📁 Family Document Safe
          <strong> For Indian Families</strong>
        </div>
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
          {activeView === 'document' && <DocumentList />}
          {activeView === 'upload' && <UploadForm />}
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