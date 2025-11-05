package com.wipro.poc.DTO;


import java.time.OffsetDateTime;

public class DocumentDTO {
  private Long id;
  private String ownerType;
  private Long ownerId;
  private String docType;
  private String originalName;
  private String contentType;
  private Long sizeBytes;
  private String status;
  private OffsetDateTime uploadedAt;

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getOwnerType() { return ownerType; }
  public void setOwnerType(String ownerType) { this.ownerType = ownerType; }
  public Long getOwnerId() { return ownerId; }
  public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
  public String getDocType() { return docType; }
  public void setDocType(String docType) { this.docType = docType; }
  public String getOriginalName() { return originalName; }
  public void setOriginalName(String originalName) { this.originalName = originalName; }
  public String getContentType() { return contentType; }
  public void setContentType(String contentType) { this.contentType = contentType; }
  public Long getSizeBytes() { return sizeBytes; }
  public void setSizeBytes(Long sizeBytes) { this.sizeBytes = sizeBytes; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public OffsetDateTime getUploadedAt() { return uploadedAt; }
  public void setUploadedAt(OffsetDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
