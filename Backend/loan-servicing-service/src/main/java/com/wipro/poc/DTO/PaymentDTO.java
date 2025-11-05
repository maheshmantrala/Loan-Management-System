package com.wipro.poc.DTO;


import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentDTO {
  private Long id;
  private Long accountId;
  private BigDecimal amount;
  private LocalDate paymentDate;
  private String mode;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Long getAccountId() { return accountId; }
  public void setAccountId(Long accountId) { this.accountId = accountId; }
  public BigDecimal getAmount() { return amount; }
  public void setAmount(BigDecimal amount) { this.amount = amount; }
  public LocalDate getPaymentDate() { return paymentDate; }
  public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
  public String getMode() { return mode; }
  public void setMode(String mode) { this.mode = mode; }
}
