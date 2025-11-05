package com.wipro.poc.Service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.wipro.poc.DTO.CustomerDTO;
import com.wipro.poc.DTO.EmailRequest;
import com.wipro.poc.DTO.NotificationDTO;
import com.wipro.poc.DTO.SmsRequest;
import com.wipro.poc.Entity.Notification;
import com.wipro.poc.Repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository repo;
    private final WebClient webClient;

    // ✅ WebClient automatically uses baseUrl from WebClientConfig
    public NotificationService(NotificationRepository repo, WebClient webClient) {
        this.repo = repo;
        this.webClient = webClient;
    }

    /* 🔹 Send generic email */
    @Transactional
    public NotificationDTO sendEmail(EmailRequest req) {
        Notification n = new Notification();
        n.setChannel("EMAIL");
        n.setToAddress(req.getTo());
        n.setSubject(req.getSubject());
        n.setBody(req.getBody());
        n.setStatus("SENT");
        n = repo.save(n);
        System.out.println("📧 EMAIL >> to=" + req.getTo());
        return toDTO(n);
    }

    /* 🔹 Send generic SMS */
    @Transactional
    public NotificationDTO sendSms(SmsRequest req) {
        Notification n = new Notification();
        n.setChannel("SMS");
        n.setToAddress(req.getTo());
        n.setBody(req.getMessage());
        n.setStatus("SENT");
        n = repo.save(n);
        System.out.println("📱 SMS >> to=" + req.getTo());
        return toDTO(n);
    }

    /* 🔹 Convert Entity → DTO */
    private NotificationDTO toDTO(Notification n) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(n.getId());
        dto.setChannel(n.getChannel());
        dto.setToAddress(n.getToAddress());
        dto.setSubject(n.getSubject());
        dto.setBody(n.getBody());
        dto.setStatus(n.getStatus());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }

    /* 🔹 Fetch all notifications */
    @Transactional(readOnly = true)
    public List<Notification> getAllNotifications() {
        return repo.findAll();
    }

    /* 🔹 Mark as read */
    @Transactional
    public Notification markAsRead(Long id) {
        Notification n = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setStatus("READ");
        return repo.save(n);
    }

    @Transactional
    public NotificationDTO sendEmailToCustomer(String username, String subject, String body) {
        CustomerDTO customer = fetchCustomerByUsername(username);

        Notification n = new Notification();
        n.setChannel("EMAIL");
        n.setToAddress(customer.getUsername());   // ✅ store username, not email
        n.setSubject(subject);
        n.setBody(body);
        n.setStatus("SENT");
        n = repo.save(n);

        System.out.println("✅ Email sent to " + customer.getUsername());
        return toDTO(n);
    }

    @Transactional
    public NotificationDTO sendSmsToCustomer(String phone, String message) {
        CustomerDTO customer = fetchCustomerByPhone(phone);

        Notification n = new Notification();
        n.setChannel("SMS");
        n.setToAddress(customer.getUsername());   // ✅ store username, not phone
        n.setBody(message);
        n.setStatus("SENT");
        n = repo.save(n);

        System.out.println("📱 SMS sent to " + customer.getUsername());
        return toDTO(n);
    }

    /* 🔹 Fetch Customer by Username via Gateway */
    private CustomerDTO fetchCustomerByUsername(String username) {
        try {
            return webClient.get()
                    .uri("/api/customers/by-username/{username}", username)
                    .retrieve()
                    .bodyToMono(CustomerDTO.class)
                    .block();
        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND)
                throw new RuntimeException("Customer not found: " + username);
            throw new RuntimeException("Error contacting customer service: " + e.getMessage());
        }
    }

    /* 🔹 Fetch Customer by Phone via Gateway */
    private CustomerDTO fetchCustomerByPhone(String phone) {
        try {
            return webClient.get()
                    .uri("/api/customers/phone/{phone}", phone)
                    .retrieve()
                    .bodyToMono(CustomerDTO.class)
                    .block();
        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND)
                throw new RuntimeException("Customer not found with phone: " + phone);
            throw new RuntimeException("Error contacting customer service: " + e.getMessage());
        }
    }

    /* 🔹 Get notifications for a specific user (frontend use) */
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsByCustomer(String username) {
        return repo.findByToAddress(username);
    }
}
