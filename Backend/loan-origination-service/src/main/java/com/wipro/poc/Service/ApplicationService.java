package com.wipro.poc.Service;

import com.wipro.poc.DTO.ApplicationCreateRequest;
import com.wipro.poc.DTO.ApplicationDTO;
import com.wipro.poc.Entity.LoanApplication;
import com.wipro.poc.Exception.ResourceNotFoundException;
import com.wipro.poc.Mapper.ApplicationMapper;
import com.wipro.poc.Repository.LoanApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final LoanApplicationRepository repo;
    private final RestClient servicingClient;
    private final RestClient notificationClient; // 🆕 Notification microservice client

    public ApplicationService(LoanApplicationRepository repo) {
        this.repo = repo;
        this.servicingClient = RestClient.builder()
                .baseUrl("http://localhost:8084") // Servicing microservice
                .build();

        this.notificationClient = RestClient.builder()
                .baseUrl("http://localhost:8086") // ✅ Notification microservice
                .build();
    }

    @Transactional
    public ApplicationDTO create(ApplicationCreateRequest req) {
        LoanApplication entity = ApplicationMapper.toEntity(req);
        entity = repo.save(entity);
        return ApplicationMapper.toDTO(entity);
    }

    @Transactional(readOnly = true)
    public ApplicationDTO getById(Long id) {
        LoanApplication entity = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + id));
        return ApplicationMapper.toDTO(entity);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO> list() {
        return repo.findAll().stream()
                .map(ApplicationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO> listByCustomer(Long customerId) {
        return repo.findByCustomerId(customerId).stream()
                .map(ApplicationMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * 🔹 When loan is APPROVED or REJECTED → create notification + if approved, create Servicing Account.
     */
    @Transactional
    public ApplicationDTO updateStatus(Long id, String status) {
        LoanApplication app = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + id));

        app.setStatus(status);
        repo.save(app);

        // 📨 Notify Customer
        sendNotificationToCustomer(app);

        // 🔸 Auto-create servicing account when approved
        if ("APPROVED".equalsIgnoreCase(status) && app.getServicingAccountId() == null) {
            createServicingAccount(app);
        }

        return ApplicationMapper.toDTO(app);
    }

    private void sendNotificationToCustomer(LoanApplication app) {
        try {
            String email = "customer" + app.getCustomerId() + "@loanportal.com"; // or from customer service
            String subject = "Loan Application Update";
            String message;

            switch (app.getStatus().toUpperCase()) {
                case "APPROVED" ->
                        message = "🎉 Congratulations! Your " + app.getLoanType() + " loan has been approved.";
                case "REJECTED" ->
                        message = "❌ Unfortunately, your " + app.getLoanType() + " loan has been rejected.";
                default ->
                        message = "ℹ️ Your " + app.getLoanType() + " loan status is now: " + app.getStatus();
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("to", email);
            payload.put("subject", subject);
            payload.put("body", message);

            notificationClient.post()
                    .uri("/notifications/email")
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            System.out.println("📩 Notification sent to customer " + email + ": " + message);

        } catch (Exception e) {
            System.err.println("⚠️ Failed to send notification: " + e.getMessage());
        }
    }

    private void createServicingAccount(LoanApplication app) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("customerId", app.getCustomerId());
            payload.put("loanType", app.getLoanType());
            payload.put("principal", app.getAmount());
            payload.put("annualInterestRate", app.getInterestRate());
            payload.put("termMonths", app.getTermMonths());
            payload.put("startDate", LocalDate.now());
            payload.put("status", app.getStatus());

            System.out.println("➡️ [Origination] Sending account creation request to Servicing...");
            Map<?, ?> created = servicingClient.post()
                    .uri("/accounts")
                    .body(payload)
                    .retrieve()
                    .body(Map.class);

            if (created != null && created.containsKey("id")) {
                Long servicingId = ((Number) created.get("id")).longValue();
                app.setServicingAccountId(servicingId);
                repo.save(app);
                System.out.println("🔗 Linked Servicing Account ID " + servicingId + " to Application " + app.getId());
            }

        } catch (Exception e) {
            System.err.println("❌ Failed to create Servicing Account: " + e.getMessage());
        }
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Application not found: " + id);
        }
        repo.deleteById(id);
    }
}
