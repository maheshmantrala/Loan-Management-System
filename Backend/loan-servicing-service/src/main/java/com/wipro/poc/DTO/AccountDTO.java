package com.wipro.poc.DTO;


import java.math.BigDecimal;
import java.time.LocalDate;

public class AccountDTO {
  private Long id;
  private Long customerId;
  private String loanType;
  private BigDecimal principal;
  private BigDecimal annualInterestRate;
  private Integer termMonths;
  private LocalDate startDate;
  private String status;

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
