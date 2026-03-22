import {useState} from 'react';

function UploadForm() {
  const [name , setName] = useState('');
  const [category , setCategory] = useState('');
  const [familyCode , setFamilyCode] = useState('');
  const [file , setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    // JS object that can hold key-value pairs, where the value can be a string or a file
    formData.append('name' , name);
    formData.append('category' , category);
    formData.append('familyCode' , familyCode);
    formData.append('file' , file);

    const response = await fetch('http://localhost:8080/documents/upload' , {
      method : 'POST' ,
      body : formData
    });

    if(response.ok) {
      alert('Document uploaded Successfully!');
    }
    else {
      alert('Failed to upload document!');
    }
  };

    return (
      <div>
        <h2>Upload Document</h2>
        {/* e is the event object */}
        <input type="text" placeholder = "Document: Name" 
          onChange = {(e) => setName(e.target.value)}/>
        
        <input type="text" placeholder = "Category" 
          onChange = {(e) => setCategory(e.target.value)}/>

        <input type="text" placeholder = "Family Code" 
          onChange = {(e) => setFamilyCode(e.target.value)}/>

        <input type="file" 
          onChange = {(e) => setFile(e.target.files[0])}/>

        <button onClick={handleUpload}>Upload</button>
      </div>
    );
  }
  
  export default UploadForm;