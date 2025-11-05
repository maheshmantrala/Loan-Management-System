package com.wipro.poc.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wipro.poc.DTO.DocumentDTO;
import com.wipro.poc.DTO.UploadRequest;
import com.wipro.poc.Service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/documents")
public class DocumentController {

  private final FileStorageService service;
  private final ObjectMapper objectMapper;

  public DocumentController(FileStorageService service, ObjectMapper objectMapper) {
    this.service = service;
    this.objectMapper = objectMapper;
  }

  // ---- Upload (for customers) ----
  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> upload(
      @RequestPart(name = "meta", required = false) String metaJson,
      @RequestParam(name = "ownerType", required = false) String ownerType,
      @RequestParam(name = "ownerId", required = false) Long ownerId,
      @RequestParam(name = "docType", required = false) String docType,
      @RequestPart("file") MultipartFile file
  ) throws IOException {

    UploadRequest meta;
    if (metaJson != null && !metaJson.isBlank()) {
      try {
        meta = objectMapper.readValue(metaJson, UploadRequest.class);
      } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid meta JSON", "details", e.getMessage()));
      }
    } else {
      meta = new UploadRequest();
      meta.setOwnerType(ownerType);
      meta.setOwnerId(ownerId);
      meta.setDocType(docType);
    }

    // ✅ Validation
    if (meta.getOwnerType() == null || meta.getOwnerType().isBlank())
      return ResponseEntity.badRequest().body(Map.of("error", "ownerType is required"));
    if (meta.getOwnerId() == null || meta.getOwnerId() <= 0)
      return ResponseEntity.badRequest().body(Map.of("error", "ownerId is required"));
    if (meta.getDocType() == null || meta.getDocType().isBlank())
      return ResponseEntity.badRequest().body(Map.of("error", "docType is required"));
    if (file == null || file.isEmpty())
      return ResponseEntity.badRequest().body(Map.of("error", "file is required"));

    DocumentDTO dto = service.upload(meta, file);
    return ResponseEntity.status(HttpStatus.CREATED).body(dto);
  }

  // ---- List documents (admin → all; customer → by owner) ----
  @GetMapping
  public ResponseEntity<?> list(
      @RequestParam(required = false) String ownerType,
      @RequestParam(required = false) Long ownerId
  ) {
      // ✅ If admin calls with no params → list all
      if (ownerType == null && ownerId == null) {
          List<DocumentDTO> allDocs = service.listAll();
          return ResponseEntity.ok(allDocs);
      }

      // ✅ Otherwise, validate customer query
      if (ownerType == null || ownerType.isBlank())
          return ResponseEntity.badRequest().body(Map.of("error", "ownerType is required"));
      if (ownerId == null || ownerId <= 0)
          return ResponseEntity.badRequest().body(Map.of("error", "ownerId must be positive"));

      List<DocumentDTO> docs = service.list(ownerType.trim().toUpperCase(), ownerId);
      return ResponseEntity.ok(docs);
  }

  // ---- Download ----
  @GetMapping("/{id}/download")
  public ResponseEntity<Resource> download(@PathVariable Long id) {
    var resource = service.download(id);
    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
        .body(resource);
  }

  // ---- Update status (Admin only) ----
  @PatchMapping("/{id}/status")
  public ResponseEntity<DocumentDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
    return ResponseEntity.ok(service.markStatus(id, status));
  }

  // ---- Delete (Admin only) ----
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) throws IOException {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
