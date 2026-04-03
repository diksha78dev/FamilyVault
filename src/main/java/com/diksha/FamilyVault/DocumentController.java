package com.diksha.FamilyVault;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController         // tells tp string that this class handles HTTP requests and return JSON
@RequestMapping("/documents")       // every endpoint in this class will start with /documents
@CrossOrigin(origins = "http://localhost:3000/")
public class DocumentController {

    // injecting Service here , like repository injmection
    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")     // listens POST /documents/upload
    public Document uploadDocument(     //returns Document object back as JSON
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("category") String category ,
            @RequestParam("familyCode") String familyCode) throws IOException {

        return documentService.uploadDocument(file , name , category , familyCode);
    }

    @GetMapping("/{familyCode}")
    public List<Document> getByFamily(
            @PathVariable String familyCode) {
        return documentService.getDocumentByFamily(familyCode);
    }

    @GetMapping("/{familyCode}/search")
    public List<Document> searchByName(
            @PathVariable String familyCode,
            @RequestParam String name) {
        return documentService.searchByName(familyCode, name);
    }

    @GetMapping("/{familyCode}/category")
    public List<Document> getByCategory(
            @PathVariable String familyCode ,
            @RequestParam String category) {
        return documentService.getByCategory(familyCode , category);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) throws IOException {
        // Step 1 : find document in db
        Document doc = documentService.getDocumentById(id);
        // Step 2 : path object for file on the disk
        Path filePath = Paths.get(doc.getFilePath());

        // Step 3 : put the file in the Resource Spring can send
        Resource resource = new FileSystemResource(filePath);

        // Step 4 : Know the content type of file
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) contentType = "application/octet-stream";

        // Step 5 : send file with headers that tell browser to download
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION , "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                .body(resource);
    }



}
