import { useState } from 'react';

function DocumentList() {
  const [familyCode, setFamilyCode] = useState('');
  const [documents, setDocuments] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchDocuments = async () => {
    const response = await fetch(
      `http://localhost:8080/documents/${familyCode}`
    );
    const data = await response.json();
    setDocuments(data);
    setSearchResults([]);  // clear old search when loading fresh
  };

  const searchDocuments = async () => {
    const response = await fetch(
      `http://localhost:8080/documents/${familyCode}/search?name=${searchName}`
    );
    const data = await response.json();
    setSearchResults(data);
  };

  const displayList = searchResults.length > 0 ? searchResults : documents;

  return (
    <div>
      <h2>View Family Documents</h2>
      <input
        type="text"
        placeholder="Enter Family Code"
        onChange={(e) => setFamilyCode(e.target.value)}
      />
      <button onClick={fetchDocuments}>Get Documents</button>

      {documents.length > 0 && (
        <div>
          <input
            type="text"
            placeholder="Search by document name"
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button onClick={searchDocuments}>Search</button>
        </div>
      )}

      <ul>
        {displayList.map((doc) => (
          <li key={doc.id}>
            <b>{doc.name}</b> — {doc.category} — {doc.uploadAt}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentList;