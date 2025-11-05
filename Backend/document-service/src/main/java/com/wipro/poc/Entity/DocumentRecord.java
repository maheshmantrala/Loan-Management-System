package com.wipro.poc.Entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "document_record")
public class DocumentRecord {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 20)
  private String ownerType; // CUSTOMER/APPLICATION/ACCOUNT

  @Column(nullable = false)
  private Long ownerId;

  @Column(nullable = false, length = 50)
  private String docType;  // PAN, AADHAAR, SALARY_SLIP, PROPERTY_PAPERS, etc.

  @Column(nullable = false, length = 255)
  private String originalName;

  @Column(nullable = false, length = 255)
  private String storagePath; // path on disk (or S3 key later)

  @Column(length = 100)
  private String contentType;

  @Column(nullable = false)
  private Long sizeBytes;

  @Column(nullable = false, length = 20)
  private String status = "UPLOADED"; // UPLOADED/VERIFIED/REJECTED

  @Column(nullable = false)
  private OffsetDateTime uploadedAt = OffsetDateTime.now();

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
  public String getStoragePath() { return storagePath; }
  public void setStoragePath(String storagePath) { this.storagePath = storagePath; }
  public String getContentType() { return contentType; }
  public void setContentType(String contentType) { this.contentType = contentType; }
  public Long getSizeBytes() { return sizeBytes; }
  public void setSizeBytes(Long sizeBytes) { this.sizeBytes = sizeBytes; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public OffsetDateTime getUploadedAt() { return uploadedAt; }
  public void setUploadedAt(OffsetDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
