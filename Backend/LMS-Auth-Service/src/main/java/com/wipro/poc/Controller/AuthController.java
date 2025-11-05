package com.wipro.poc.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.wipro.poc.Model.AuthRequest;
import com.wipro.poc.Model.AuthResponse;
import com.wipro.poc.Model.RegisterRequest;
import com.wipro.poc.Service.AuthService;
import com.wipro.poc.Entity.User;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest req) {
        String response = authService.register(req.getUsername(), req.getPassword(), req.getRole());
        System.out.println("✅ Registered new user: " + req.getUsername() + " with role " + req.getRole());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        try {
            System.out.println("🔐 Login attempt for username: " + req.getUsername());

            // Validate user credentials
            User user = authService.validateUser(req.getUsername(), req.getPassword());

            // Generate JWT token
            String token = authService.generateJwt(user);
            Long customerId = null;

            // Only fetch customerId if role is CUSTOMER
            if ("CUSTOMER".equalsIgnoreCase(user.getRole())) {
                customerId = authService.getCustomerIdByUsername(user.getUsername());
                System.out.println("🔗 Linked customerId for " + user.getUsername() + ": " + customerId);
            }

            // Build and return response
            AuthResponse authResponse = new AuthResponse(
                    token,
                    "Login successful",
                    user.getUsername(),
                    user.getRole(),
                    customerId
            );

            System.out.println("✅ Login successful for: " + user.getUsername());
            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            System.err.println("❌ Login failed for user: " + req.getUsername() + " - " + e.getMessage());
            return ResponseEntity.badRequest().body(
                    new AuthResponse(null, "Login failed: " + e.getMessage(), req.getUsername(), null, null)
            );
        }
    }
}
