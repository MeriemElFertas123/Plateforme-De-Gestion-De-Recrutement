package com.recrutement.backend.service;

import com.recrutement.backend.dto.RegisterRequest;
import com.recrutement.backend.dto.UserDTO;
import com.recrutement.backend.model.User;
import com.recrutement.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructeur explicite (remplace @RequiredArgsConstructor)
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Créer un nouvel utilisateur
     */
    public User createUser(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        // Créer l'utilisateur
        User user = new User();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash du password
        user.setTelephone(request.getTelephone());
        user.setDepartement(request.getDepartement());
        user.setRole(request.getRole());
        user.setActif(true);

        return userRepository.save(user);
    }

    /**
     * Trouver un utilisateur par email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Trouver un utilisateur par ID
     */
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    /**
     * Vérifier le mot de passe
     */
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    /**
     * Obtenir tous les utilisateurs (sans mot de passe)
     */
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Mettre à jour la dernière connexion
     */
    public void updateLastLogin(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setDerniereConnexion(java.time.LocalDateTime.now());
            userRepository.save(user);
        });
    }

    /**
     * Désactiver un utilisateur
     */
    public void deactivateUser(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setActif(false);
            userRepository.save(user);
        });
    }
}