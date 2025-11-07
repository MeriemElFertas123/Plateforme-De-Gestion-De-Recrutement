package com.recrutement.backend.dto;

import com.recrutement.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private String id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private User.Role role;
    private String departement;
    private boolean actif;
    private LocalDateTime dateCreation;

    // Constructeur depuis User
    public UserDTO(User user) {
        this.id = user.getId();
        this.nom = user.getNom();
        this.prenom = user.getPrenom();
        this.email = user.getEmail();
        this.telephone = user.getTelephone();
        this.role = user.getRole();
        this.departement = user.getDepartement();
        this.actif = user.isActif();
        this.dateCreation = user.getDateCreation();
    }
}