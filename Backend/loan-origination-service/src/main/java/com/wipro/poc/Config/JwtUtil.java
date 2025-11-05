package com.wipro.poc.Config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final String SECRET = "WIPRO_SECRET_KEY_123WIPRO_SECRET_KEY_123";
    private final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Generate JWT Token
    public String generateToken(String username, String role) {
        if (username == null || role == null) {
            throw new IllegalArgumentException("Username and role cannot be null when generating JWT");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract claims safely
    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            System.err.println("JWT parsing failed: " + e.getMessage());
            return null; // gracefully return null if token invalid/expired
        }
    }

    // Extract username
    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims != null ? claims.getSubject() : null;
    }

    // Extract role
    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        if (claims == null) {
            System.err.println("Cannot extract role — token is invalid or expired");
            return null;
        }
        return (String) claims.get("role");
    }

    // Validate token
    public boolean validateToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims != null && claims.getExpiration().after(new Date());
    }
}
