package com.wipro.poc.Controller;

import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.wipro.poc.DTO.PaymentDTO;
import com.wipro.poc.DTO.PaymentRequest;
import com.wipro.poc.Service.AccountService;

import java.util.List;

@RestController
@RequestMapping("/accounts/{accountId}/payments")
public class PaymentController {

  private final AccountService service;

  public PaymentController(AccountService service) {
    this.service = service;
  }

  /**
   * 🟢 Record a new payment for a loan account
   */
  @PostMapping
  public ResponseEntity<PaymentDTO> post(@PathVariable Long accountId,
                                         @Valid @RequestBody PaymentRequest req) {
    PaymentDTO dto = service.postPayment(accountId, req);
    return ResponseEntity.status(HttpStatus.CREATED).body(dto);
  }

  /**
   * 🟢 List all payments for a specific account
   */
  @GetMapping
  public ResponseEntity<List<PaymentDTO>> list(@PathVariable Long accountId) {
    List<PaymentDTO> payments = service.listPayments(accountId);
    return ResponseEntity.ok(payments);
  }
  
}
