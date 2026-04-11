import {useState} from 'react';

const CATEGORIES = ['Medical', 'Identity' , 'Property', 'Financial', 'Insurance', 'Education', 'Other'];

function UploadForm({ familyCode, pin }) {
  const [name , setName] = useState('');
  const [category , setCategory] = useState('');
  const [file , setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast , setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg});
    setTimeout(() => setToast(null) , 3500);
  };

  const handleUpload = async () => {
    if(!name || !category || !file) {
      showToast('error','Please fill in all the fields and select a file.');
      return;
    }

    const formData = new FormData();
    // JS object that can hold key-value pairs, where the value can be a string or a file
    formData.append('name' , name);
    formData.append('category' , category);
    formData.append('familyCode' , familyCode);
    formData.append('file' , file);
    formData.append('pin', pin);

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/documents/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showToast('success', `"${name}" uploaded successfully! ✓`);
        setName('');
        setCategory('');
        setFile(null);
        // do NOT reset familyCode and pin — they are props now
        setLoading(false);
      }
      else {
        showToast('error', 'Upload failed. is your backend running on port 8080?');
        setLoading(false);
      }
    } catch (err) {
      showToast('error', 'Cannot reach server. Check if Spring Boot is running.');
      setLoading(false);
    }
    
  };

  const getFileIcon = (f) => {
    if(!f) return null;
    const ext = f.name.split('.').pop().toLowerCase();
    if(ext === 'pdf') return '📄';
    if(['jpg', 'jpeg' , 'png'].includes(ext)) return '🖼️';
    if(['doc', 'docx'].includes(ext)) return '📝';
    return '📎';
  };

  return (
      <div className="fv-upload-card">
        <div className="fv-card-title">
          <span>📤</span> Upload New Document
        </div>

        <div className="fv-form-grid">
          <div className="fv-form-group">
            <label>Document Name</label>
            <input
              className="fv-input"
              type="text"
              placeholder="e.g. Dad's Aadhaar Card"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        
        <div className="fv-form-group" style={{ marginBottom: '14px' }}>
          <label>Category</label>
          <select
            className="fv-input fv-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div 
          className="fv-file-drop"
          onClick={(e) => document.getElementById('fv-file-input').click()}
        >
          <input
            id="fv-file-input"
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="fv-file-drop-icon">
            {file ? getFileIcon(file) : '☁️'}
          </div>
          {file ? (
            <div className="fv-file-name">
              {file.name} &nbsp;.&nbsp; {(file.size / 1024).toFixed(1)} KB
            </div>
          ) : (
            <div className="fv-file-drop-text">
              <span>Click to choose a file</span>
              <br />PDF, JPG , PNG , Word documents
            </div>
          )}
        </div>

        <button
          className="fv-btn fv-btn-primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? 'Uploading...' : '⬆️ Upload Document'}
        </button>

        {toast && (
          <div className={`fv-toast fv-toast-${toast.type}`}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
          </div>
        )}
      </div>
    );
  }
  
  export default UploadForm;