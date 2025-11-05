package com.wipro.poc.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "loan_application")
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false, length = 20)
    private String loanType; // HOME, CAR, PERSONAL

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private Integer termMonths;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate; // e.g., 12.50

    @Column(nullable = false, length = 20)
    private String status; // DRAFT, SUBMITTED, APPROVED, REJECTED

    private OffsetDateTime createdAt = OffsetDateTime.now();

    // 🔸 NEW: link to servicing account (nullable until APPROVED)
    @Column(name = "servicing_account_id")
    private Long servicingAccountId;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public Long getServicingAccountId() { return servicingAccountId; }
    public void setServicingAccountId(Long servicingAccountId) { this.servicingAccountId = servicingAccountId; }
}
