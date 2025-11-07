package com.recrutement.backend.repository;

import com.recrutement.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);
    List<User> findByRole(User.Role role);
    List<User> findByDepartement(String departement);
    List<User> findByActif(boolean actif);
    boolean existsByEmail(String email);
}