package com.recrutement.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Extraire le username (email) du token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extraire une claim spécifique
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Générer un token pour un utilisateur
     */
    public String generateToken(String email, String userId, String role) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", userId);
        extraClaims.put("role", role);
        return generateToken(extraClaims, email);
    }

    /**
     * Générer un token avec claims supplémentaires
     */
    public String generateToken(Map<String, Object> extraClaims, String email) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Valider le token
     */
    public boolean isTokenValid(String token, String email) {
        final String username = extractUsername(token);
        return (username.equals(email)) && !isTokenExpired(token);
    }

    /**
     * Vérifier si le token est expiré
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extraire la date d'expiration
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extraire toutes les claims
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Obtenir la clé de signature
     */
    private Key getSignInKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}