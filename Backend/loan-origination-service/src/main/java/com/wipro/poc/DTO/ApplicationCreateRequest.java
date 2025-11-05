package com.wipro.poc.DTO;


import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ApplicationCreateRequest {

  @NotNull(message = "customerId is required")
  private Long customerId;

  @NotBlank(message = "loanType is required")
  @Pattern(regexp = "HOME|CAR|PERSONAL", message = "loanType must be HOME, CAR, or PERSONAL")
  private String loanType;

  @NotNull @DecimalMin(value = "10000.00", message = "amount must be >= 10000")
  private BigDecimal amount;

  @NotNull @Min(value = 6) @Max(value = 360)
  private Integer termMonths;

  @NotNull @DecimalMin(value = "1.00") @DecimalMax(value = "30.00")
  private BigDecimal interestRate;

  // getters/setters
  public Long getCustomerId() { return customerId; }
  public void setCustomerId(Long customerId) { this.customerId = customerId; }

  public String getLoanType() { return loanType; }
  public void setLoanType(String loanType) { this.loanType = loanType; }

  public BigDecimal getAmount() { return amount; }
  public void setAmount(BigDecimal amount) { this.amount = amount; }

  public Integer getTermMonths() { return termMonths; }
  public void setTermMonths(Integer termMonths) { this.termMonths = termMonths; }

  public BigDecimal getInterestRate() { return interestRate; }
  public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
}
