package com.wipro.poc.Entity;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "loan_account")
public class LoanAccount {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long customerId;

  @Column(nullable = false)
  private String loanType; // HOME/CAR/PERSONAL

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal principal;

  @Column(nullable = false, precision = 5, scale = 2)
  private BigDecimal annualInterestRate; // e.g. 12.50

  @Column(nullable = false)
  private Integer termMonths;

  @Column(nullable = false)
  private LocalDate startDate;

  @Column(nullable = false, length = 20)
  private String status = "ACTIVE"; // ACTIVE, CLOSED, DELINQUENT
  @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<RepaymentInstallment> installments;

  @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<PaymentTxn> payments;
  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Long getCustomerId() { return customerId; }
  public void setCustomerId(Long customerId) { this.customerId = customerId; }
  public String getLoanType() { return loanType; }
  public void setLoanType(String loanType) { this.loanType = loanType; }
  public BigDecimal getPrincipal() { return principal; }
  public void setPrincipal(BigDecimal principal) { this.principal = principal; }
  public BigDecimal getAnnualInterestRate() { return annualInterestRate; }
  public void setAnnualInterestRate(BigDecimal annualInterestRate) { this.annualInterestRate = annualInterestRate; }
  public Integer getTermMonths() { return termMonths; }
  public void setTermMonths(Integer termMonths) { this.termMonths = termMonths; }
  public LocalDate getStartDate() { return startDate; }
  public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
}

