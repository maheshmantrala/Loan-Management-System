package com.wipro.poc.Entity;


import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "notification")
public class Notification {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 10)
  private String channel; // EMAIL or SMS

  @Column(nullable = false, length = 255)
  private String toAddress; // email or phone

  @Column(length = 255)
  private String subject; // for EMAIL

  @Lob
  private String body; // email body / sms message

  @Column(nullable = false, length = 20)
  private String status = "SENT"; // SENT (stub)

  @Column(nullable = false)
  private OffsetDateTime createdAt = OffsetDateTime.now();

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getChannel() { return channel; }
  public void setChannel(String channel) { this.channel = channel; }
  public String getToAddress() { return toAddress; }
  public void setToAddress(String toAddress) { this.toAddress = toAddress; }
  public String getSubject() { return subject; }
  public void setSubject(String subject) { this.subject = subject; }
  public String getBody() { return body; }
  public void setBody(String body) { this.body = body; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
