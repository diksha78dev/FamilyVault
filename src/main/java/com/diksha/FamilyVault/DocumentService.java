package com.diksha.FamilyVault;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;

import java.util.*;

//It is the Service layer which handles the actual work like upload , get all files , search by name , put all documents according to the category
@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    //Method 1 : to upload document
    public Document uploadDocument(MultipartFile file , String name , String category , String familyCode) throws IOException {
        String uploadDir = "uploads/";          //It is like address of the file(Cupboard)
        Files.createDirectories(Paths.get(uploadDir));        //if cupboard is not present then Create it newly
        String filePath = uploadDir + file.getOriginalFilename();       //gives original uploaded file name
        Files.copy(file.getInputStream() , Paths.get(filePath));        //save file to disk


        //save file attributes in the database via document repo and then document
        Document doc = new Document();
        doc.setName(name);
        doc.setCategory(category);
        doc.setFamilyCode(familyCode);
        doc.setUploadAt(LocalDateTime.now());
        doc.setFilePath(filePath);
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
}
