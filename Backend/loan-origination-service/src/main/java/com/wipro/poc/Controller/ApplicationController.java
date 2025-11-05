package com.wipro.poc.Controller;


import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.wipro.poc.DTO.ApplicationCreateRequest;
import com.wipro.poc.DTO.ApplicationDTO;
import com.wipro.poc.DTO.StatusUpdateRequest;
import com.wipro.poc.Service.ApplicationService;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

  private final ApplicationService service;

  public ApplicationController(ApplicationService service) {
    this.service = service;
  }

  @PostMapping
  public ResponseEntity<ApplicationDTO> create(@Valid @RequestBody ApplicationCreateRequest req) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApplicationDTO> get(@PathVariable Long id) {
    return ResponseEntity.ok(service.getById(id));
  }

  @GetMapping
  public ResponseEntity<List<ApplicationDTO>> list() {
    return ResponseEntity.ok(service.list());
  }

  @GetMapping("/by-customer/{customerId}")
  public ResponseEntity<List<ApplicationDTO>> listByCustomer(@PathVariable Long customerId) {
    return ResponseEntity.ok(service.listByCustomer(customerId));
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<ApplicationDTO> updateStatus(@PathVariable Long id,
                                                     @Valid @RequestBody StatusUpdateRequest req) {
    return ResponseEntity.ok(service.updateStatus(id, req.getStatus()));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
