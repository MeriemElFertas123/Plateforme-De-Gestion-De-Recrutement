package com.recrutement.backend.controller;

import com.recrutement.backend.dto.AuthResponse;
import com.recrutement.backend.dto.LoginRequest;
import com.recrutement.backend.dto.RegisterRequest;
import com.recrutement.backend.dto.UserDTO;
import com.recrutement.backend.model.User;
import com.recrutement.backend.service.JwtService;
import com.recrutement.backend.service.UserService;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.createUser(request);

            String token = jwtService.generateToken(
                    user.getEmail(),
                    user.getId(),
                    user.getRole().toString()
            );

            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setType("Bearer");
            response.setUserId(user.getId());
            response.setEmail(user.getEmail());
            response.setNom(user.getNom());
            response.setPrenom(user.getPrenom());
            response.setRole(user.getRole());
            response.setMessage("Inscription réussie");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

            if (!userService.checkPassword(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Email ou mot de passe incorrect");
            }

            if (!user.isActif()) {
                throw new RuntimeException("Compte désactivé");
            }

            // Mettre à jour le lastLogin dans un bloc try-catch séparé
            try {
                userService.updateLastLogin(user.getId());
            } catch (Exception e) {
                // Logger l'erreur mais ne pas bloquer la connexion
                System.err.println("Erreur lors de la mise à jour du lastLogin: " + e.getMessage());
            }

            String token = jwtService.generateToken(
                    user.getEmail(),
                    user.getId(),
                    user.getRole().toString()
            );

            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setType("Bearer");
            response.setUserId(user.getId());
            response.setEmail(user.getEmail());
            response.setNom(user.getNom());
            response.setPrenom(user.getPrenom());
            response.setRole(user.getRole());
            response.setMessage("Connexion réussie");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractUsername(token);

            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            UserDTO userDTO = new UserDTO(user);
            return ResponseEntity.ok(userDTO);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Token invalide");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String email = jwtService.extractUsername(token);

            boolean isValid = userService.findByEmail(email)
                    .map(user -> jwtService.isTokenValid(token, user.getEmail()))
                    .orElse(false);

            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            return ResponseEntity.ok(response);
        }
    }
}