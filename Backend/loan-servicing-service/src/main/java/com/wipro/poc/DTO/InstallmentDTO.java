package com.wipro.poc.DTO;


import java.math.BigDecimal;
import java.time.LocalDate;

public class InstallmentDTO {
  private Integer installmentNo;
  private LocalDate dueDate;
  private BigDecimal principalComponent;
  private BigDecimal interestComponent;
  private BigDecimal installmentAmount;
  private BigDecimal paidAmount;
  private String status;

  // getters/setters
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
