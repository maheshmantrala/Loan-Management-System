package com.wipro.poc.Entity;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "repayment_installment")
public class RepaymentInstallment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "account_id")
  private LoanAccount account;

  @Column(nullable = false)
  private Integer installmentNo; // 1..N

  @Column(nullable = false)
  private LocalDate dueDate;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal principalComponent;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal interestComponent;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal installmentAmount;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal paidAmount = BigDecimal.ZERO;

  @Column(nullable = false, length = 20)
  private String status = "DUE"; // DUE, PARTIAL, PAID

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public LoanAccount getAccount() { return account; }
  public void setAccount(LoanAccount account) { this.account = account; }
  public Integer getInstallmentNo() { return installmentNo; }
  public void setInstallmentNo(Integer installmentNo) { this.installmentNo = installmentNo; }
  public LocalDate getDueDate() { return dueDate; }
  public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
  public BigDecimal getPrincipalComponent() { return principalComponent; }
  public void setPrincipalComponent(BigDecimal principalComponent) { this.principalComponent = principalComponent; }
  public BigDecimal getInterestComponent() { return interestComponent; }
  public void setInterestComponent(BigDecimal interestComponent) { this.interestComponent = interestComponent; }
  public BigDecimal getInstallmentAmount() { return installmentAmount; }
  public void setInstallmentAmount(BigDecimal installmentAmount) { this.installmentAmount = installmentAmount; }
  public BigDecimal getPaidAmount() { return paidAmount; }
  public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
}
