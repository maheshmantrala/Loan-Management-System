package com.wipro.poc.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wipro.poc.Entity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
	Optional<Customer> findByUsername(String username);
	  // ✅ Added missing finder
    Optional<Customer> findByPhone(String phone);
    Optional<Customer> findByEmail(String email);

}
