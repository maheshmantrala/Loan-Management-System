package com.wipro.poc.Mapper;

import com.wipro.poc.DTO.AccountCreateRequest;
import com.wipro.poc.DTO.AccountDTO;
import com.wipro.poc.DTO.InstallmentDTO;
import com.wipro.poc.DTO.PaymentDTO;
import com.wipro.poc.Entity.LoanAccount;
import com.wipro.poc.Entity.PaymentTxn;
import com.wipro.poc.Entity.RepaymentInstallment;

public final class AccountMapper {
  private AccountMapper() {}

  public static LoanAccount toEntity(AccountCreateRequest req) {
    LoanAccount a = new LoanAccount();
    a.setCustomerId(req.getCustomerId());
    a.setLoanType(req.getLoanType());
    a.setPrincipal(req.getPrincipal());
    a.setAnnualInterestRate(req.getAnnualInterestRate());
    a.setTermMonths(req.getTermMonths());
    a.setStartDate(req.getStartDate());
    a.setStatus("ACTIVE");
    return a;
  }

  public static AccountDTO toDTO(LoanAccount a) {
    AccountDTO dto = new AccountDTO();
    dto.setId(a.getId());
    dto.setCustomerId(a.getCustomerId());
    dto.setLoanType(a.getLoanType());
    dto.setPrincipal(a.getPrincipal());
    dto.setAnnualInterestRate(a.getAnnualInterestRate());
    dto.setTermMonths(a.getTermMonths());
    dto.setStartDate(a.getStartDate());
    dto.setStatus(a.getStatus());
    return dto;
  }

  public static InstallmentDTO toDTO(RepaymentInstallment i) {
    InstallmentDTO dto = new InstallmentDTO();
    dto.setInstallmentNo(i.getInstallmentNo());
    dto.setDueDate(i.getDueDate());
    dto.setPrincipalComponent(i.getPrincipalComponent());
    dto.setInterestComponent(i.getInterestComponent());
    dto.setInstallmentAmount(i.getInstallmentAmount());
    dto.setPaidAmount(i.getPaidAmount());
    dto.setStatus(i.getStatus());
    return dto;
  }

  public static PaymentDTO toDTO(PaymentTxn txn) {
	    PaymentDTO dto = new PaymentDTO();
	    dto.setId(txn.getId());
	    dto.setAmount(txn.getAmount());
	    dto.setPaymentDate(txn.getPaymentDate());
	    dto.setMode(txn.getMode());
	    dto.setAccountId(txn.getAccount() != null ? txn.getAccount().getId() : null);
	    return dto;
	}
  
}
