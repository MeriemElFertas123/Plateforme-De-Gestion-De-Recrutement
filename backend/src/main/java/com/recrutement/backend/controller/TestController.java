package com.recrutement.backend.controller;

import com.recrutement.backend.model.User;
import com.recrutement.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/hello")
    public ResponseEntity<Map<String, String>> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "🚀 Backend Spring Boot fonctionne !");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Gestion Recrutement API");
        response.put("version", "1.0.0");
        response.put("timestamp", LocalDateTime.now());

        try {
            long userCount = userRepository.count();
            response.put("database", "CONNECTED");
            response.put("usersCount", userCount);
        } catch (Exception e) {
            response.put("database", "ERROR: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-user")
    public ResponseEntity<User> createTestUser() {
        if (userRepository.existsByEmail("test@recrutement.com")) {
            return ResponseEntity.ok(userRepository.findByEmail("test@recrutement.com").get());
        }

        User testUser = new User();
        testUser.setNom("Test");
        testUser.setPrenom("Admin");
        testUser.setEmail("test@recrutement.com");
        testUser.setPassword("password123");
        testUser.setRole(User.Role.ADMIN);
        testUser.setDepartement("IT");
        testUser.setTelephone("0612345678");
        testUser.setActif(true);

        User savedUser = userRepository.save(testUser);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
}