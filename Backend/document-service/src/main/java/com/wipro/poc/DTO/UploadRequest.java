package com.wipro.poc.DTO;


import jakarta.validation.constraints.*;

public class UploadRequest {
  @NotBlank private String ownerType; // CUSTOMER/APPLICATION/ACCOUNT
  @NotNull  private Long ownerId;
  @NotBlank private String docType;

  public String getOwnerType() { return ownerType; }
  public void setOwnerType(String ownerType) { this.ownerType = ownerType; }
  public Long getOwnerId() { return ownerId; }
  public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
  public String getDocType() { return docType; }
  public void setDocType(String docType) { this.docType = docType; }
}
