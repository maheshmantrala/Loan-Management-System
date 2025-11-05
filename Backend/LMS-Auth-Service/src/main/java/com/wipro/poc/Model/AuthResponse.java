package com.wipro.poc.Model;

public class AuthResponse {
    private String token;
    private String message;
    private String username;
    private String role;
    private Long customerId; // ✅ added field

    public AuthResponse(String token, String message, String username, String role, Long customerId) {
        this.token = token;
        this.message = message;
        this.username = username;
        this.role = role;
        this.customerId = customerId;
    }

    public AuthResponse(String token, String message, String username) {
        this(token, message, username, null, null);
    }

    // Getters & Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
}
