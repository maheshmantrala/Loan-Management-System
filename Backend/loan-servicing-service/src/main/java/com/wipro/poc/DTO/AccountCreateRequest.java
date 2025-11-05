package com.wipro.poc.DTO;


import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class AccountCreateRequest {
  @NotNull private Long customerId;
  @NotBlank private String loanType; // HOME/CAR/PERSONAL
  @NotNull @DecimalMin("10000.00") private BigDecimal principal;
  @NotNull @DecimalMin("1.00") @DecimalMax("30.00") private BigDecimal annualInterestRate;
  @NotNull @Min(6) @Max(360) private Integer termMonths;
  @NotNull private LocalDate startDate;
  private String status;
  public AccountCreateRequest(String status) {
	super();
	this.setStatus(status);
}
  // getters/setters
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
  public String getStatus() {
	return status;
  }
  public AccountCreateRequest() {
	    // required for JSON deserialization
	}

  public void setStatus(String status) {
	this.status = status;
  }
}
