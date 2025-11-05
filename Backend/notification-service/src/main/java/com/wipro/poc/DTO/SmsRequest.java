package com.wipro.poc.DTO;



import jakarta.validation.constraints.*;

public class SmsRequest {
  @NotBlank @Pattern(regexp = "^[0-9]{10,15}$", message = "Provide digits only (10-15)")
  private String to;
  @NotBlank private String message;

  public String getTo() { return to; }
  public void setTo(String to) { this.to = to; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
}
