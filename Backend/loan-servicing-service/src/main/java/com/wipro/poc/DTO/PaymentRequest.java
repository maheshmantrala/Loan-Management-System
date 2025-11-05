package com.wipro.poc.DTO;


import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentRequest {
  @NotNull @DecimalMin("1.00") private BigDecimal amount;
  @NotNull private LocalDate paymentDate;
  @NotBlank private String mode;

  public BigDecimal getAmount() { return amount; }
  public void setAmount(BigDecimal amount) { this.amount = amount; }
  public LocalDate getPaymentDate() { return paymentDate; }
  public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
  public String getMode() { return mode; }
  public void setMode(String mode) { this.mode = mode; }
}
