package com.wipro.poc.DTO;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class ApplicationDTO {
    private Long id;
    private Long customerId;
    private String loanType;
    private BigDecimal amount;
    private Integer termMonths;
    private BigDecimal interestRate;
    private String status;
    private OffsetDateTime createdAt;

    // 🔸 NEW
    private Long servicingAccountId;

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
