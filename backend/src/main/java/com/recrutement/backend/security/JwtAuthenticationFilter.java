package com.recrutement.backend.security;

import com.recrutement.backend.service.JwtService;
import com.recrutement.backend.service.UserService;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Récupérer le header Authorization
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Vérifier si le header contient un token Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extraire le token
        jwt = authHeader.substring(7);

        try {
            // Extraire l'email du token
            userEmail = jwtService.extractUsername(jwt);

            // Si l'email existe et l'utilisateur n'est pas déjà authentifié
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Charger l'utilisateur
                var user = userService.findByEmail(userEmail);

                if (user.isPresent() && jwtService.isTokenValid(jwt, user.get().getEmail())) {
                    // Créer l'authentification
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            user.get(),
                            null,
                            user.get().getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Définir l'authentification dans le contexte de sécurité
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token invalide, continuer sans authentification
            System.err.println("Erreur JWT: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}