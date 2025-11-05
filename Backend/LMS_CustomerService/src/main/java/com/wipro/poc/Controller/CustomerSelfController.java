package com.wipro.poc.Controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import com.wipro.poc.Entity.Customer;
import com.wipro.poc.Repository.CustomerRepository;

@RestController
@RequestMapping("/api/customers")
public class CustomerSelfController {

    private final CustomerRepository repo;

    public CustomerSelfController(CustomerRepository repo) {
        this.repo = repo;
    }

    // ✅ Get current user's profile
    @GetMapping("/me")
    public ResponseEntity<Customer> getMyProfile(Principal principal) {
        String username = principal.getName();
        return repo.findByUsername(username)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Create or update current user's profile
    @PostMapping("/me")
    public ResponseEntity<Customer> createOrUpdateMyProfile(
            Principal principal,
            @RequestBody Customer payload) {

        String username = principal.getName();

        Customer c = repo.findByUsername(username)
                         .orElseGet(Customer::new);

        c.setUsername(username);
        c.setFullName(payload.getFullName());
        c.setEmail(payload.getEmail());
        c.setPhone(payload.getPhone());
        c.setDob(payload.getDob());
        c.setAddress(payload.getAddress());
        c.setCreditScore(payload.getCreditScore());
        c.setEmploymentType(payload.getEmploymentType());

        Customer saved = repo.save(c);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
