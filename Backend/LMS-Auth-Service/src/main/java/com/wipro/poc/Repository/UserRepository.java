package com.wipro.poc.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wipro.poc.Entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
