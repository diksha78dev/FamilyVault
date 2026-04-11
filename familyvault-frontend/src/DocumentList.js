import { useState, useEffect } from 'react';

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

// NEW: returns the correct URL to preview the file
// PDF and images → direct Cloudinary URL (browser handles them natively)
// DOCX → wrapped in Google Docs Viewer so browser can render it
function getPreviewUrl(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  if (ext === 'pdf') return filePath;
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return filePath;
  if (['doc', 'docx'].includes(ext)) return "https://docs.google.com/viewer?url=" + filePath;
  return filePath;
}

// NEW: tells us HOW to render the preview inside the modal
// images → use <img> tag
// everything else → use <iframe> (PDF, DOCX via Google Docs)
function getPreviewType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
  return 'iframe';
}

function getPreviewType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
  if (['doc', 'docx'].includes(ext)) return 'newtab'; // open in new tab
  return 'iframe';
}

function DocumentList({ familyCode, pin }) {
  const [documents, setDocuments] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  // NEW: stores the document the user wants to preview
  // null = modal is hidden, { name, filePath } = modal is visible
  // exactly like confirmDelete works for the delete dialog
  const [previewDoc, setPreviewDoc] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setActiveCategory(null);
      setSearchName('');
      try {
        const res = await fetch(
            `${process.env.REACT_APP_API_URL}/documents/${familyCode}?pin=${pin}`
        );
        const data = await res.json();
        setDocuments(data);
        setFetched(true);
      } catch {
        setDocuments([]);
        setFetched(true);
      }
      setLoading(false);
    };
    fetchDocuments();
  }, [familyCode, pin]);

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = documents.filter((d) => d.category === cat).length;
    return acc;
  }, {});

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

  const handleDownload = async (doc) => {
    try {
      const res = await fetch(doc.filePath);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = doc.filePath.split('/').pop();
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast('error', 'Download failed. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const deleteName = confirmDelete.name;
    try {
      const res = await fetch(
          `${process.env.REACT_APP_API_URL}/documents/${id}?familyCode=${familyCode}&pin=${pin}`,
          { method: 'DELETE' }
      );
      if (res.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        setConfirmDelete(null);
        showToast('success', `"${deleteName}" deleted successfully.`);
      }
    } catch (err) {
      showToast('error', 'Could not delete. Is your backend running?');
    }
  };

  return (
      <div>
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
                          {/* CHANGED: renamed header to reflect 3 actions now */}
                          <th>Actions</th>
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
                                  {/* NEW: Preview button — sets previewDoc state which opens the modal */}
                                  <button
                                      className="fv-btn fv-btn-outline"
                                      style={{ padding: '6px 14px', fontSize: '13px', marginRight: '8px' }}
                                      onClick={() => setPreviewDoc(doc)}
                                  >
                                    👁 Preview
                                  </button>
                                  <button
                                      className="fv-btn fv-btn-outline"
                                      style={{ padding: '6px 14px', fontSize: '13px' }}
                                      onClick={() => handleDownload(doc)}
                                  >
                                    ⬇ Download
                                  </button>
                                  <button
                                      className="fv-btn fv-btn-danger"
                                      style={{ padding: '6px 14px', fontSize: '13px', marginLeft: '8px' }}
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

                {/* DELETE DIALOG — unchanged */}
                {confirmDelete && (
                    <div className="fv-dialog-overlay">
                      <div className="fv-dialog">
                        <div className="fv-dialog-icon">🗑️</div>
                        <div className="fv-dialog-title">Delete Document?</div>
                        <div className="fv-dialog-msg">
                          Are you sure you want to delete <strong>"{confirmDelete.name}"</strong>?
                          <br />
                          <span style={{ color: 'var(--text-mid)', fontSize: '13px' }}>
                      This cannot be undone.
                    </span>
                        </div>
                        <div className="fv-dialog-actions">
                          <button className="fv-btn fv-btn-outline" onClick={() => setConfirmDelete(null)}>
                            Cancel
                          </button>
                          <button className="fv-btn fv-btn-danger" onClick={() => handleDelete(confirmDelete.id)}>
                            Yes, Delete
                          </button>
                        </div>
                      </div>
                    </div>
                )}
              </div>
            </>
        )}

        {/* NEW: PREVIEW MODAL */}
        {/* previewDoc is null → nothing shown */}
        {/* previewDoc has a document → this whole overlay appears */}
        {previewDoc && (
            <div className="fv-dialog-overlay" onClick={() => setPreviewDoc(null)}>
              {/* stopPropagation stops clicking INSIDE the modal from closing it */}
              {/* without this, clicking the iframe would close the modal */}
              <div
                  className="fv-preview-modal"
                  onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header with document name and close button */}
                <div className="fv-preview-header">
                  <div className="fv-preview-title">👁 {previewDoc.name}</div>
                  <button
                      className="fv-preview-close"
                      onClick={() => setPreviewDoc(null)}
                  >
                    ✕
                  </button>
                </div>

                {/* Modal body — shows image or iframe depending on file type */}
                <div className="fv-preview-body">
                  {getPreviewType(previewDoc.filePath) === 'image' ? (
                      <img
                          src={previewDoc.filePath}
                          alt={previewDoc.name}
                          className="fv-preview-image"
                      />
                  ) : getPreviewType(previewDoc.filePath) === 'newtab' ? (
                      // DOCX — can't preview in browser, show a message with open button
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: '16px'
                      }}>
                        <div style={{ fontSize: '48px' }}>📝</div>
                        <div style={{ fontSize: '16px', color: 'var(--text-mid)' }}>
                          Word documents can't be previewed in browser
                        </div>

                        <a
                          href={getPreviewUrl(previewDoc.filePath)}
                          target="_blank"
                          rel="noreferrer"
                          className="fv-btn fv-btn-primary"
                          style={{ width: 'auto', padding: '12px 28px' }}
                        >
                          Open in Google Docs →
                        </a>
                      </div>
                  ) : (
                      <iframe
                          src={getPreviewUrl(previewDoc.filePath)}
                          title={previewDoc.name}
                          className="fv-preview-iframe"
                      />
                  )}
                </div>
              </div>
            </div>
        )}

        {/* TOAST */}
        {toast && (
            <div
                className={`fv-toast fv-toast-${toast.type}`}
                style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 1000, minWidth: '280px' }}
            >
              {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
            </div>
        )}

        {!fetched && (
            <div className="fv-empty" style={{ marginTop: 40 }}>
              <div className="fv-empty-icon">🔐</div>
              <div className="fv-empty-text">Enter your family code above to view documents.</div>
            </div>
        )}

        {fetched && documents.length === 0 && !loading && (
            <div className="fv-empty" style={{ marginTop: 40 }}>
              <div className="fv-empty-icon">📭</div>
              <div className="fv-empty-text">
                No documents found for family code <strong>{familyCode}</strong>.<br />
                Try uploading one first!
              </div>
            </div>
        )}
      </div>
  );
}

export default DocumentList;