package com.diksha.FamilyVault;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/family")
@CrossOrigin(origins = "*")
public class FamilyGroupController {

    @Autowired
    private FamilyGroupService familyGroupService;

    //POST -> fmaily/register
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestParam String familyCode ,
            @RequestParam String pin) {
        try {
            familyGroupService.registerFamily(familyCode, pin);
            return ResponseEntity.ok("Family registered successfully..!");
        }
        catch(RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //POST -> family/login
    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestParam String familyCode,
            @RequestParam String pin) {
        boolean success = familyGroupService.loginFamily(familyCode,pin);

        if(success) {
            return ResponseEntity.ok("Login successfully..!");
        }
        else {
            return ResponseEntity.badRequest().body("Wrong family code or PIN.");
        }
    }
}
