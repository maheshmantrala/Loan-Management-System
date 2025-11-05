package com.wipro.poc.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wipro.poc.DTO.AccountCreateRequest;
import com.wipro.poc.DTO.AccountDTO;
import com.wipro.poc.DTO.InstallmentDTO;
import com.wipro.poc.DTO.PaymentDTO;
import com.wipro.poc.DTO.PaymentRequest;
import com.wipro.poc.Entity.LoanAccount;
import com.wipro.poc.Entity.PaymentTxn;
import com.wipro.poc.Entity.RepaymentInstallment;
import com.wipro.poc.Exception.ResourceNotFoundException;
import com.wipro.poc.Mapper.AccountMapper;
import com.wipro.poc.Repository.LoanAccountRepository;
import com.wipro.poc.Repository.PaymentTxnRepository;
import com.wipro.poc.Repository.RepaymentInstallmentRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

  private final LoanAccountRepository accountRepo;
  private final RepaymentInstallmentRepository installmentRepo;
  private final PaymentTxnRepository paymentRepo;
  private final ScheduleService scheduleService;

  public AccountService(LoanAccountRepository accountRepo,
                        RepaymentInstallmentRepository installmentRepo,
                        PaymentTxnRepository paymentRepo,
                        ScheduleService scheduleService) {
    this.accountRepo = accountRepo;
    this.installmentRepo = installmentRepo;
    this.paymentRepo = paymentRepo;
    this.scheduleService = scheduleService;
  }

  /** ✅ Create new loan account + repayment schedule */
  @Transactional
  public AccountDTO create(AccountCreateRequest req) {
      System.out.println("📩 Received Account Create Request for Customer ID: " + req.getCustomerId());

      LoanAccount acc = AccountMapper.toEntity(req);

      // ✅ Set initial status
      if ("REJECTED".equalsIgnoreCase(req.getStatus())) {
          acc.setStatus("REJECTED");
      } else if ("APPROVED".equalsIgnoreCase(req.getStatus())) {
          acc.setStatus("ACTIVE");
      } else {
          acc.setStatus("PENDING");
      }

      acc = accountRepo.save(acc);
      System.out.println("✅ Loan Account saved with ID: " + acc.getId() + " and status: " + acc.getStatus());

      // ✅ Only generate schedule if approved
      if ("ACTIVE".equals(acc.getStatus()) || "APPROVED".equals(acc.getStatus())) {
          scheduleService.generateSchedule(acc);
          System.out.println("📅 Repayment schedule generated for account ID: " + acc.getId());
      } else {
          System.out.println("⛔ Schedule skipped because loan is not approved.");
      }

      return AccountMapper.toDTO(acc);
  }


  @Transactional(readOnly = true)
  public AccountDTO get(Long id) {
    return AccountMapper.toDTO(findAccount(id));
  }

  @Transactional(readOnly = true)
  public List<AccountDTO> list(Long customerId) {
    var list = (customerId == null)
            ? accountRepo.findAll()
            : accountRepo.findByCustomerId(customerId);

    return list.stream().map(AccountMapper::toDTO).collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<InstallmentDTO> schedule(Long accountId) {
    return installmentRepo.findByAccountIdOrderByInstallmentNo(accountId)
        .stream().map(AccountMapper::toDTO).collect(Collectors.toList());
  }

  /** ✅ Record a payment against loan account */
  @Transactional
  public PaymentDTO postPayment(Long accountId, PaymentRequest req) {
    LoanAccount acc = findAccount(accountId);

    // record payment txn
    PaymentTxn p = new PaymentTxn();
    p.setAccount(acc);
    p.setAmount(req.getAmount());
    p.setPaymentDate(req.getPaymentDate());
    p.setMode(req.getMode());
    p = paymentRepo.save(p);

    // allocate FIFO to installments
    BigDecimal remaining = req.getAmount();
    var openInst = installmentRepo.findByAccountIdAndStatusNotOrderByInstallmentNo(accountId, "PAID");
    for (RepaymentInstallment i : openInst) {
      if (remaining.compareTo(BigDecimal.ZERO) <= 0) break;
      BigDecimal due = i.getInstallmentAmount().subtract(i.getPaidAmount());
      BigDecimal alloc = remaining.min(due);
      i.setPaidAmount(i.getPaidAmount().add(alloc));
      i.setStatus(i.getPaidAmount().compareTo(i.getInstallmentAmount()) >= 0 ? "PAID" : "PARTIAL");
      installmentRepo.save(i);
      remaining = remaining.subtract(alloc);
    }

    // close account if all paid
    boolean allPaid = installmentRepo.findByAccountIdAndStatusNotOrderByInstallmentNo(accountId, "PAID").isEmpty();
    if (allPaid) {
      acc.setStatus("CLOSED");
      accountRepo.save(acc);
      System.out.println("🎉 Loan account ID " + accountId + " fully paid and closed.");
    }

    return AccountMapper.toDTO(p);
  }

  private LoanAccount findAccount(Long id) {
    return accountRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + id));
  }

  /** ✅ Properly delete account and related data */
  @Transactional
  public void delete(Long id) {
      LoanAccount acc = findAccount(id);
      installmentRepo.deleteAll(installmentRepo.findByAccountIdOrderByInstallmentNo(id));
      paymentRepo.deleteAll(paymentRepo.findByAccount_Id(id));
      accountRepo.delete(acc);
      System.out.println("🗑️ Deleted account ID " + id + " and related records.");
  }

  @Transactional(readOnly = true)
  public List<PaymentDTO> listPayments(Long accountId) {
      findAccount(accountId); // ensures account exists
      return paymentRepo.findByAccount_Id(accountId)
              .stream()
              .map(AccountMapper::toDTO)
              .collect(Collectors.toList());
  }
}
