package com.diksha.FamilyVault;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.*;

@Service
public class DocumentService {
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private DocumentRepository documentRepository;

    public Document uploadDocument(MultipartFile file, String name, String category, String familyCode) throws IOException {
        Map<String, Object> options = new HashMap<>();
        options.put("resource_type", "auto");
        options.put("use_filename", true);
        options.put("unique_filename", false);
        // FIX 1: explicitly set public_id with original filename so extension is preserved
        options.put("public_id", "familyvault/" + familyCode + "/" + file.getOriginalFilename());

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        String fileUrl = (String) uploadResult.get("secure_url");

        Document doc = new Document();
        doc.setName(name);
        doc.setCategory(category);
        doc.setFamilyCode(familyCode);
        doc.setUploadAt(LocalDateTime.now());
        doc.setFilePath(fileUrl);
        return documentRepository.save(doc);
    }

    public List<Document> getDocumentByFamily(String familyCode) {
        return documentRepository.findByFamilyCode(familyCode);
    }

    public List<Document> searchByName(String familyCode, String name) {
        return documentRepository.findByFamilyCodeAndNameContaining(familyCode, name);
    }

    public List<Document> getByCategory(String familyCode, String category) {
        return documentRepository.findByFamilyCodeAndCategory(familyCode, category);
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    public void deleteDocument(Long id) throws IOException {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not Found: " + id));

        String fileUrl = doc.getFilePath();
        String publicId = fileUrl
                .substring(fileUrl.indexOf("/upload/") + 8)
                .replaceFirst("v\\d+/", "")
                .replaceAll("\\.[^.]+$", "");

        // FIX 2: detect resource type from URL instead of hardcoding "raw"
        String resourceType = "raw";
        if (fileUrl.contains("/image/upload/")) {
            resourceType = "image";
        } else if (fileUrl.contains("/video/upload/")) {
            resourceType = "video";
        }

        Map<String, Object> options = new HashMap<>();
        options.put("resource_type", resourceType);
        cloudinary.uploader().destroy(publicId, options);

        documentRepository.deleteById(id);
    }
}