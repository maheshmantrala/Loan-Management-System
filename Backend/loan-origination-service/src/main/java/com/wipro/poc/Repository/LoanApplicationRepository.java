package com.wipro.poc.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.wipro.poc.Entity.LoanApplication;

import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
  List<LoanApplication> findByCustomerId(Long customerId);
  List<LoanApplication> findByStatus(String status);
}

