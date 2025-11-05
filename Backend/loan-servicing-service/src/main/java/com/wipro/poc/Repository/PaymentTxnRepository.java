package com.wipro.poc.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wipro.poc.Entity.PaymentTxn;
public interface PaymentTxnRepository extends JpaRepository<PaymentTxn, Long> {
	 List<PaymentTxn> findByAccount_Id(Long accountId);
}
