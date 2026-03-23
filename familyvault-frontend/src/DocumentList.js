import {useState} from 'react';

function DocumentList() {
    const [familyCode, setFamilyCode] = useState('');
    const [documents, setDocuments] = useState([]);

    const fetchDocuments = async () => {
        const response = await fetch(
            `http://localhost:8080/documents/${familyCode}`
        );
        const data = await response.json();
        setDocuments(data);
    };

    return (
       <div>
        <h2>View Family Documents</h2>
        <input
            type="text"
            placeholder = "Enter Family Code"
            onChange = {(e) => setFamilyCode(e.target.value)}
        />
        <button onClick = {fetchDocuments}> Get Documents</button>
        <ul>
            {documents.map((doc) => (
                <li key={doc.id}>
                    <b>{doc.name}</b> - {doc.category} - {doc.uploadAt}
                </li>
            ))}
        </ul>
       </div>
    );
}

export default DocumentList;