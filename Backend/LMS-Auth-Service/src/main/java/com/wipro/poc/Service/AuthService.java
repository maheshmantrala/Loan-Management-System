package com.wipro.poc.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.wipro.poc.Config.JwtUtil;
import com.wipro.poc.Entity.User;
import com.wipro.poc.Repository.UserRepository;

import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtil jwtUtil;

    private final RestClient customerClient;

    public AuthService() {
        // 👇 Connect to Customer microservice
        this.customerClient = RestClient.builder()
                .baseUrl("http://localhost:8082/api/customers")
                .build();
    }

    public String register(String username, String password, String role) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Role cannot be null or blank during registration");
        }

        User user = new User(username, encoder.encode(password), role);
        userRepository.save(user);
        return "Registered successfully!";
    }

    public User validateUser(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    public String generateJwt(User user) {
        return jwtUtil.generateToken(user.getUsername(), user.getRole());
    }

    // ✅ Fixed version with proper deserialization and logs
    public Long getCustomerIdByUsername(String username) {
        try {
            String url = "/by-username/" + username;
            System.out.println("🌐 Calling Customer Service: " + url);

            Map<String, Object> response = customerClient.get()
                    .uri(url)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});

            System.out.println("🔁 Customer Service response: " + response);

            if (response != null && response.containsKey("customerId")) {
                Long id = ((Number) response.get("customerId")).longValue();
                System.out.println("✅ Extracted customerId: " + id);
                return id;
            } else {
                System.err.println("⚠️ No customerId found in response: " + response);
            }

        } catch (Exception e) {
            System.err.println("❌ Failed to fetch customerId from Customer Service: " + e.getMessage());
        }
        return null;
    }
}
