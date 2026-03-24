package com.diksha.FamilyVault;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "documents")

public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String name;
    private String category;
    private String filePath;
    private String familyCode;
    
    @JsonFormat(pattern = "dd MMM yyyy , hh:mm:a")
    private LocalDateTime uploadAt;
}
