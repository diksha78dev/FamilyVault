package com.diksha.FamilyVault;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController         // tells tp string that this class handles HTTP requests and return JSON
@RequestMapping("/documents")       // every endpoint in this class will start with /documents
@CrossOrigin(origins = "http://localhost:3000/")
public class DocumentController {

    // injecting Service here , like repository injection
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


}
