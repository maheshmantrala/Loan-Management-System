package com.wipro.poc.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wipro.poc.Entity.LoanAccount;
public interface LoanAccountRepository extends JpaRepository<LoanAccount, Long> {
List<LoanAccount> findByCustomerId(Long customerId);
}
