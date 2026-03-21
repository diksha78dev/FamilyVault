package com.diksha.FamilyVault;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository

public interface DocumentRepository extends JpaRepository<Document , Long>{
    List<Document> findByFamilyCode(String familyCode);
    List<Document> findByFamilyCodeAndNameContaining(String familyCode , String name);
    List<Document> finByFamilyCodeAndCategory(String familyCode , String category);
}
