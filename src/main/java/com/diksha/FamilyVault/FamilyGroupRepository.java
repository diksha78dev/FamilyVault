package com.diksha.FamilyVault;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;


@Repository
public interface FamilyGroupRepository extends JpaRepository<FamilyGroup , String>{
    Optional<FamilyGroup> findByFamilyCodeAndPin(
            String familyCode , String pin
    );
}
