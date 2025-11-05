package com.wipro.poc.Entity;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payment_txn")
public class PaymentTxn {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "account_id")
  private LoanAccount account;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal amount;

  @Column(nullable = false)
  private LocalDate paymentDate;

  @Column(length = 50)
  private String mode; // UPI, CASH, BANK, etc.

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public LoanAccount getAccount() { return account; }
  public void setAccount(LoanAccount account) { this.account = account; }
  public BigDecimal getAmount() { return amount; }
  public void setAmount(BigDecimal amount) { this.amount = amount; }
  public LocalDate getPaymentDate() { return paymentDate; }
  public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
  public String getMode() { return mode; }
  public void setMode(String mode) { this.mode = mode; }
}
