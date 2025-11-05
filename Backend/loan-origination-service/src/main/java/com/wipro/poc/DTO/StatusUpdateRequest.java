package com.wipro.poc.DTO;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class StatusUpdateRequest {

  @NotBlank
  @Pattern(regexp = "DRAFT|SUBMITTED|APPROVED|REJECTED|DISBURSED",
           message = "status must be one of DRAFT,SUBMITTED,APPROVED,REJECTED,DISBURSED")
  private String status;

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
}
