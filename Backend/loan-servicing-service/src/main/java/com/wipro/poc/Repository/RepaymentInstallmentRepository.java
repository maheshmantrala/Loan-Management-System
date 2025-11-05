package com.wipro.poc.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.wipro.poc.Entity.RepaymentInstallment;

import java.util.List;
public interface RepaymentInstallmentRepository extends JpaRepository<RepaymentInstallment, Long> {
List<RepaymentInstallment> findByAccountIdOrderByInstallmentNo(Long accountId);
List<RepaymentInstallment> findByAccountIdAndStatusNotOrderByInstallmentNo(Long accountId, String status);
}
