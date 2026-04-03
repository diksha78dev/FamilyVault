import { useState } from 'react';

const CATEGORIES = ['Medical', 'Identity', 'Property', 'Financial', 'Insurance', 'Education', 'Other'];

const CATEGORY_META = {
  Medical:    { icon: '🏥', color: '#fef2f2' },
  Identity:   { icon: '🪪', color: '#fff7ed' },
  Property:   { icon: '🏠', color: '#f0fdf4' },
  Financial:  { icon: '💰', color: '#eff6ff' },
  Insurance:  { icon: '🛡️', color: '#fdf4ff' },
  Education:  { icon: '🎓', color: '#f0f9ff' },
  Other:      { icon: '📁', color: '#f8fafc' },
};

function getDocIcon(filePath) {
  if (!filePath) return { icon: '📎', cls: 'other' };
  const ext = filePath.split('.').pop().toLowerCase();
  if (ext === 'pdf') return { icon: '📄', cls: 'pdf' };
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return { icon: '🖼️', cls: 'img' };
  if (['doc', 'docx'].includes(ext)) return { icon: '📝', cls: 'doc' };
  return { icon: '📎', cls: 'other' };
}

function DocumentList() {
  const [familyCode, setFamilyCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [documents, setDocuments] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [activeCategory, setActiveCategory] = useState(null); // null = show all
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  // this will help to confirm the file deletion like are you sure you want to delete this file?
  const [confirmDelete , setConfirmDelete] = useState(null);
  const [toast , setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type , msg });
    setTimeout(() => setToast(null) , 3000);
  };

  const fetchDocuments = async (code) => {
    const fc = code || familyCode;
    if (!fc) return;
    setLoading(true);
    setActiveCategory(null);
    setSearchName('');
    try {
      const res = await fetch(`http://localhost:8080/documents/${fc}`);
      const data = await res.json();
      setDocuments(data);
      setFetched(true);
    } catch {
      setDocuments([]);
      setFetched(true);
    }
    setLoading(false);
  };

  const handleLoad = () => {
    setFamilyCode(inputCode);
    fetchDocuments(inputCode);
  };

  // Count docs per category
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = documents.filter((d) => d.category === cat).length;
    return acc;
  }, {});

  // Filter logic: category first, then search
  const filteredDocs = documents.filter((doc) => {
    const matchCat = activeCategory ? doc.category === activeCategory : true;
    const matchSearch = searchName
      ? doc.name.toLowerCase().includes(searchName.toLowerCase())
      : true;
    return matchCat && matchSearch;
  });

  const handleCategoryClick = (cat) => {
    setActiveCategory(activeCategory === cat ? null : cat);
    setSearchName('');
  };

  const handleDownload = (id) => {
    window.open(`http://localhost:8080/documents/${id}/download` , '_blank');
  };

  const handleDelete = async (id) => {
    const deleteName = confirmDelete.name;
    try {
        // fetch with method DELETE hits our new backend endpoint
        // No body needed — the id is in the URL itself
        const res = await fetch(`http://localhost:8080/documents/${id}`, {
            method: 'DELETE'
        });
        
        if (res.ok) {
            // This is the key part — we don't reload the page
            // We FILTER out the deleted document from our state array
            // filter() creates a new array keeping only documents
            // whose id does NOT match the deleted one
            // React sees state changed → automatically re-renders the list
            setDocuments(prev => prev.filter(doc => doc.id !== id));
            
            // Close the confirmation dialog
            setConfirmDelete(null);
            showToast('success' , `"${deleteName}" deleted successfully.`);
        }
    } catch (err) {
        showToast('error' , 'Could not delete. Is your backend running?');
    }
  };

  return (
    <div>
      {/* Family code entry bar */}
      <div className="fv-family-bar">
        <span style={{ fontSize: 20 }}>👨‍👩‍👧</span>
        <input
          className="fv-input"
          type="text"
          placeholder="Enter your Family Code (e.g. SHARMA2024)"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
          style={{ margin: 0 }}
        />
        <button className="fv-btn fv-btn-primary" style={{ width: 'auto', whiteSpace: 'nowrap' }} onClick={handleLoad}>
          Load Documents
        </button>
      </div>

      {/* Quick Access Category Cards */}
      {fetched && documents.length > 0 && (
        <>
          <div className="fv-quick-grid">
            {CATEGORIES.filter((c) => categoryCounts[c] > 0).map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <div
                  key={cat}
                  className={`fv-quick-card ${activeCategory === cat ? 'selected' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <div className="fv-quick-card-icon" style={{ background: meta.color }}>
                    {meta.icon}
                  </div>
                  <div>
                    <div className="fv-quick-card-label">{cat}</div>
                    <div className="fv-quick-card-count">{categoryCounts[cat]} document{categoryCounts[cat] !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Document Table */}
          <div className="fv-table-card">
            <div className="fv-table-header">
              <div className="fv-table-title">
                {activeCategory ? `${CATEGORY_META[activeCategory]?.icon} ${activeCategory} Documents` : '📋 All Documents'}
                <span style={{ fontWeight: 400, color: 'var(--text-mid)', marginLeft: 8, fontSize: 13 }}>
                  ({filteredDocs.length})
                </span>
              </div>

              <div className="fv-table-controls">
                <div className="fv-search-wrap">
                  <span className="fv-search-icon">🔍</span>
                  <input
                    className="fv-input fv-search-input"
                    type="text"
                    placeholder="Search by name…"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    style={{ margin: 0, minWidth: 200 }}
                  />
                </div>
                {activeCategory && (
                  <button
                    className="fv-btn fv-btn-outline"
                    style={{ whiteSpace: 'nowrap', padding: '9px 14px' }}
                    onClick={() => setActiveCategory(null)}
                  >
                    ✕ Clear filter
                  </button>
                )}
              </div>
            </div>

            <div className="fv-table-wrap">
              {loading ? (
                <div className="fv-loading">
                  <div className="fv-spinner" />
                  Loading your documents…
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="fv-empty">
                  <div className="fv-empty-icon">🔍</div>
                  <div className="fv-empty-text">No documents found for this filter.</div>
                </div>
              ) : (
                <table className="fv-table">
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>Category</th>
                      <th>Date Uploaded</th>
                      <th>Download / Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map((doc) => {
                      const { icon, cls } = getDocIcon(doc.filePath);
                      const badgeCls = `badge-${doc.category || 'Other'}`;
                      return (
                        <tr key={doc.id}>
                          <td>
                            <div className="fv-doc-name">
                              <div className={`fv-doc-icon ${cls}`}>{icon}</div>
                              <span className="fv-doc-name-text">{doc.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`fv-badge ${badgeCls}`}>
                              {doc.category || 'Other'}
                            </span>
                          </td>
                          <td className="fv-date">{doc.uploadAt}</td>
                          <td>
                            <button
                              className="fv-btn fv-btn-outline"
                              style={{ padding: '6px 14px', fontSize: '13px' }}
                              onClick={() => handleDownload(doc.id)}
                            >
                              ⬇ Download
                            </button>
                            {/* When Clicked , we dn;t delete immediately */}
                            {/* we set the confirmDelete state to the id of the document we want to delete */}
                            <button
                              className="fv-btn fv-btn-danger"
                              style={{ padding: '6px 14px' , fontSize: '13px' , marginLeft: '8px' }}
                              onClick={() => setConfirmDelete(doc)}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                          
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            {/* confirmDelete is null → dialog is invisible */}
            {/* confirmDelete has a document → dialog appears */}
            {confirmDelete && (
                <div className="fv-dialog-overlay">
                    {/* Clicking the grey overlay also closes the dialog — good UX */}
                    <div className="fv-dialog">
                        <div className="fv-dialog-icon">🗑️</div>
                        <div className="fv-dialog-title">Delete Document?</div>
                        <div className="fv-dialog-msg">
                            {/* We show the document NAME so user knows exactly what they're deleting */}
                            Are you sure you want to delete <strong>"{confirmDelete.name}"</strong>?
                            <br />
                            <span style={{ color: 'var(--text-mid)', fontSize: '13px' }}>
                                This cannot be undone.
                            </span>
                        </div>
                        <div className="fv-dialog-actions">
                            {/* Cancel — just closes dialog, nothing deleted */}
                            <button
                                className="fv-btn fv-btn-outline"
                                onClick={() => setConfirmDelete(null)}
                            >
                                Cancel
                            </button>
                            {/* Confirm — calls handleDelete with the stored document id */}
                            <button
                                className="fv-btn fv-btn-danger"
                                onClick={() => handleDelete(confirmDelete.id)}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </>
      )}

      {/* Toast moved OUTSIDE the table card so it's not clipped by overflow: hidden */}
      {toast && (
        <div className={`fv-toast fv-toast-${toast.type}`}
          style={{ position: 'fixed' , top: '24px' , right: '24px' , zIndex: 1000 , minWidth: '280px' }}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* First time, no code entered */}
      {!fetched && (
        <div className="fv-empty" style={{ marginTop: 40 }}>
          <div className="fv-empty-icon">🔐</div>
          <div className="fv-empty-text">Enter your family code above to view documents.</div>
        </div>
      )}

      {/* Code entered but nothing found */}
      {fetched && documents.length === 0 && !loading && (
        <div className="fv-empty" style={{ marginTop: 40 }}>
          <div className="fv-empty-icon">📭</div>
          <div className="fv-empty-text">No documents found for family code <strong>{familyCode}</strong>.<br />Try uploading one first!</div>
        </div>
      )}
    </div>
  );
}

export default DocumentList;