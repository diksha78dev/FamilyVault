package com.diksha.FamilyVault;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.*;

//It is the Service layer which handles the actual work like upload , get all files , search by name , put all documents according to the category
@Service
public class DocumentService {
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private DocumentRepository documentRepository;

    //Method 1 : to upload document
    public Document uploadDocument(MultipartFile file, String name, String category, String familyCode) throws IOException {

        // Build upload options — folder organises files in Cloudinary dashboard
        // resource_type "auto" handles PDFs, images, Word docs — everything
        Map<String, Object> options = new HashMap<>();
        options.put("folder", "familyvault/" + familyCode);
        options.put("resource_type", "auto");
        options.put("use_filename" , true);
        options.put("unique_filename" , false);
        // Upload file to Cloudinary
        // file.getBytes() converts the file into raw bytes Cloudinary can send
        // upload() returns a Map containing URL, public_id, size, format etc.
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

        // secure_url is the permanent HTTPS link to the uploaded file
        String fileUrl = (String) uploadResult.get("secure_url");

        // Save document metadata in MySQL — fileUrl replaces old local filePath
        Document doc = new Document();
        doc.setName(name);
        doc.setCategory(category);
        doc.setFamilyCode(familyCode);
        doc.setUploadAt(LocalDateTime.now());
        doc.setFilePath(fileUrl);
        return documentRepository.save(doc);
    }

    //Method 2 : to show all documents by familyCode
    public List<Document> getDocumentByFamily(String familyCode) {
        return documentRepository.findByFamilyCode(familyCode);
    }

    //Method 3 : search file by name
    public List<Document> searchByName(String familyCode , String name) {
        return documentRepository.findByFamilyCodeAndNameContaining(familyCode , name);
    }

    //Method 4 : show me files based on categories (medical , land related etc.)
    public List<Document> getByCategory(String familyCode , String category) {
        return documentRepository.findByFamilyCodeAndCategory(familyCode , category);
    }

    //Method 5 : get a document using id
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    // Method 5 : Delete a file
    public void deleteDocument(Long id) throws IOException {
        // Find document in DB first to get the Cloudinary URL
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not Found: " + id));

        // Extract public_id from Cloudinary URL to delete it from Cloudinary
        // URL looks like: https://res.cloudinary.com/cloudname/image/upload/v123/familyvault/SHARMA2024/filename.pdf
        // public_id is everything after /upload/v123/ → familyvault/SHARMA2024/filename
        String fileUrl = doc.getFilePath();
        String publicId = fileUrl
                .substring(fileUrl.indexOf("/upload/") + 8)  // cut everything before /upload/
                .replaceFirst("v\\d+/", "")                   // remove version number like v1234567/
                .replaceAll("\\.[^.]+$", "");                  // remove file extension

        // Tell Cloudinary to delete the file
        Map options = new HashMap<>();
        options.put("resource_type", "raw");
        cloudinary.uploader().destroy(publicId, options);

        // Delete from MySQL
        documentRepository.deleteById(id);
    }
}
