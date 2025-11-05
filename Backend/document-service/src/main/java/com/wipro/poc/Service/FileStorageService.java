package com.wipro.poc.Service;

import com.wipro.poc.DTO.DocumentDTO;
import com.wipro.poc.DTO.UploadRequest;
import com.wipro.poc.Entity.DocumentRecord;
import com.wipro.poc.Exception.ResourceNotFoundException;
import com.wipro.poc.Repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FileStorageService {

  private final Path root;
  private final DocumentRepository repo;
  private final RestClient notificationClient; // 🆕 For calling Notification microservice

  public FileStorageService(@Value("${app.storage.root}") String rootPath,
                            @Value("${notification.service.url:http://localhost:8086}") String notificationBase,
                            DocumentRepository repo) throws IOException {
    this.root = Paths.get(rootPath).toAbsolutePath().normalize();
    this.repo = repo;
    Files.createDirectories(this.root);

    // ✅ Setup Notification Client
    this.notificationClient = RestClient.builder()
            .baseUrl(notificationBase)
            .build();
  }

  @Transactional
  public DocumentDTO upload(UploadRequest meta, MultipartFile file) throws IOException {
    String original = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
    String ext = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
    String uuid = UUID.randomUUID().toString().replace("-", "");
    String savedName = uuid + ext;

    Path target = root.resolve(savedName);
    try (InputStream in = file.getInputStream()) {
      Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
    }

    DocumentRecord r = new DocumentRecord();
    r.setOwnerType(meta.getOwnerType().trim().toUpperCase());
    r.setOwnerId(meta.getOwnerId());
    r.setDocType(meta.getDocType().trim().toUpperCase());
    r.setOriginalName(original);
    r.setStoragePath(target.toString());
    r.setContentType(file.getContentType() != null ? file.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE);
    r.setSizeBytes(file.getSize());
    r = repo.save(r);

    // 📨 Notify Admin about the uploaded document
    sendUploadNotification(r);

    return toDTO(r);
  }

  private void sendUploadNotification(DocumentRecord r) {
    try {
      String subject = "New Document Uploaded";
      String body = "📁 Customer ID " + r.getOwnerId() +
              " uploaded a document (" + r.getDocType() + "): " + r.getOriginalName();

      Map<String, Object> payload = new HashMap<>();
      payload.put("to", "admin@loanportal.com"); // can be a generic admin email or distribution list
      payload.put("subject", subject);
      payload.put("body", body);

      notificationClient.post()
              .uri("/notifications/email")
              .body(payload)
              .retrieve()
              .toBodilessEntity();

      System.out.println("✅ [Document Service] Notification sent to Admin: " + body);
    } catch (Exception e) {
      System.err.println("⚠️ [Document Service] Failed to send notification: " + e.getMessage());
    }
  }

  @Transactional(readOnly = true)
  public List<DocumentDTO> list(String ownerType, Long ownerId) {
    String type = ownerType == null ? null : ownerType.trim().toUpperCase();
    return repo.findByOwnerTypeAndOwnerId(type, ownerId)
               .stream()
               .map(this::toDTO)
               .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<DocumentDTO> listAll() {
    return repo.findAll()
               .stream()
               .map(this::toDTO)
               .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public FileSystemResource download(Long id) {
    DocumentRecord r = repo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Doc not found: " + id));
    return new FileSystemResource(r.getStoragePath());
  }

  @Transactional
  public DocumentDTO markStatus(Long id, String status) {
    DocumentRecord r = repo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Doc not found: " + id));
    r.setStatus(status.trim().toUpperCase());
    return toDTO(repo.save(r));
  }

  @Transactional
  public void delete(Long id) throws IOException {
    DocumentRecord r = repo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Doc not found: " + id));
    Files.deleteIfExists(Paths.get(r.getStoragePath()));
    repo.delete(r);
  }

  private DocumentDTO toDTO(DocumentRecord r) {
    DocumentDTO dto = new DocumentDTO();
    dto.setId(r.getId());
    dto.setOwnerType(r.getOwnerType());
    dto.setOwnerId(r.getOwnerId());
    dto.setDocType(r.getDocType());
    dto.setOriginalName(r.getOriginalName());
    dto.setContentType(r.getContentType());
    dto.setSizeBytes(r.getSizeBytes());
    dto.setStatus(r.getStatus());
    dto.setUploadedAt(r.getUploadedAt());
    return dto;
  }
}
