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
@CrossOrigin(origins = "*")
public class DocumentController {

    // injecting Service here , like repository injmection
    @Autowired
    private DocumentService documentService;

    @Autowired
    private FamilyGroupService familyGroupService;

    //PROTECTED - UPLOAD NEEDS PIN
    @PostMapping("/upload")     // listens POST /documents/upload
    public ResponseEntity<?> uploadDocument(     //returns Document object back as JSON
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("category") String category ,
            @RequestParam("familyCode") String familyCode,
            @RequestParam("pin") String pin) throws IOException {

        if(!familyGroupService.loginFamily(familyCode , pin)) {
            return ResponseEntity
                    .status(401)
                    .body("Wrong Family Code or PIN");
        }

        Document doc = documentService.uploadDocument(
                file , name , category , familyCode);
        return ResponseEntity.ok(doc);
    }

    //PROTECTED -> VIEW ALL DOCS NEEDS PIN
    @GetMapping("/{familyCode}")
    public ResponseEntity<?> getByFamily(
            @PathVariable String familyCode ,
            @RequestParam String pin) {
        if(!familyGroupService.loginFamily(familyCode , pin)) {
            return ResponseEntity
                    .status(401)
                    .body("Wrong Family Code or PIN");
        }
        return ResponseEntity.ok(
                documentService.getDocumentByFamily(familyCode));
    }

    // PROTECTED — search needs PIN
    @GetMapping("/{familyCode}/search")
    public ResponseEntity<?> searchByName(
            @PathVariable String familyCode,
            @RequestParam String pin,
            @RequestParam String name) {

        if (!familyGroupService.loginFamily(familyCode, pin)) {
            return ResponseEntity
                    .status(401)
                    .body("Wrong family code or PIN.");
        }

        return ResponseEntity.ok(
                documentService.searchByName(familyCode, name));
    }

    // PROTECTED — category filter needs PIN
    @GetMapping("/{familyCode}/category")
    public ResponseEntity<?> getByCategory(
            @PathVariable String familyCode,
            @RequestParam String pin,
            @RequestParam String category) {

        if (!familyGroupService.loginFamily(familyCode, pin)) {
            return ResponseEntity
                    .status(401)
                    .body("Wrong family code or PIN.");
        }

        return ResponseEntity.ok(
                documentService.getByCategory(familyCode, category));
    }

    // UNPROTECTED for now — download (needs sessions, coming later)
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long id) throws IOException {

        Document doc = documentService.getDocumentById(id);
        Path filePath = Paths.get(doc.getFilePath());
        Resource resource = new FileSystemResource(filePath);
        String contentType = Files.probeContentType(filePath);
        if (contentType == null)
            contentType = "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\""
                                + filePath.getFileName().toString() + "\"")
                .body(resource);
    }

    // PROTECTED — delete needs familyCode + PIN
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(
            @PathVariable Long id,
            @RequestParam String familyCode,
            @RequestParam String pin) throws IOException {

        if (!familyGroupService.loginFamily(familyCode, pin)) {
            return ResponseEntity
                    .status(401)
                    .body("Wrong family code or PIN.");
        }

        documentService.deleteDocument(id);
        return ResponseEntity.ok("Document deleted successfully");
    }
}
