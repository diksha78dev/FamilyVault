package com.diksha.FamilyVault;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

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
    private LocalDateTime uploadAt;
}
