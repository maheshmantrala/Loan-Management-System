package com.wipro.poc.Controller;

import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.wipro.poc.DTO.AccountCreateRequest;
import com.wipro.poc.DTO.AccountDTO;
import com.wipro.poc.DTO.InstallmentDTO;
import com.wipro.poc.Service.AccountService;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController {

  private final AccountService service;
  public AccountController(AccountService service) { this.service = service; }



  @GetMapping("/{id}")
  public ResponseEntity<AccountDTO> get(@PathVariable Long id) {
    return ResponseEntity.ok(service.get(id));
  }

  @GetMapping
  public ResponseEntity<List<AccountDTO>> list(@RequestParam(required = false) Long customerId) {
    return ResponseEntity.ok(service.list(customerId));
  }

  @GetMapping("/{id}/schedule")
  public ResponseEntity<List<InstallmentDTO>> schedule(@PathVariable Long id) {
    return ResponseEntity.ok(service.schedule(id));
  }
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
  @PostMapping
  public ResponseEntity<AccountDTO> create(@Valid @RequestBody AccountCreateRequest req) {
      System.out.println("📩 Received Account Create Request: " + req);
      AccountDTO created = service.create(req);
      System.out.println("✅ Account created with ID: " + created.getId());
      return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

}
