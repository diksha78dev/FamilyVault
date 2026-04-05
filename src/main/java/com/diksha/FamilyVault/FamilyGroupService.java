package com.diksha.FamilyVault;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class FamilyGroupService {

    @Autowired
    private FamilyGroupRepository familyGroupRepository;

    //Method 1 : Register a new family
    public FamilyGroup registerFamily(String familyCode, String pin) {
        if(familyGroupRepository.existsById(familyCode)) {
            throw new RuntimeException("Family code already taken , Try another.");
        }
        FamilyGroup group = new FamilyGroup();
        group.setFamilyCode(familyCode);
        group.setPin(pin);
        return familyGroupRepository.save(group);
    }

    // Method 2 : Login -> verify familyCode+PIN
    public boolean loginFamily(String familyCode , String pin) {
        Optional<FamilyGroup> group = familyGroupRepository.findByFamilyCodeAndPin(familyCode,pin);

        return group.isPresent();
    }
}
