package com.diksha.FamilyVault;

import jakarta.persistence.*;
import lombok.Data;

@Entity         //tells jpa -> make a mysql table for this class
@Data           //generates getter/setters automatically
@Table(name = "family_groups")

public class FamilyGroup {
    @Id
    private String familyCode;

    private String pin;
}
