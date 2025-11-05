package com.wipro.poc.Controller;

import com.wipro.poc.DTO.EmailRequest;
import com.wipro.poc.DTO.NotificationDTO;
import com.wipro.poc.DTO.SmsRequest;
import com.wipro.poc.Entity.Notification;
import com.wipro.poc.Service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*") // ✅ Allow calls from frontend
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    /* 🔹 Send generic Email */
    @PostMapping("/email")
    public ResponseEntity<NotificationDTO> email(@Valid @RequestBody EmailRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.sendEmail(req));
    }

    /* 🔹 Send generic SMS */
    @PostMapping("/sms")
    public ResponseEntity<NotificationDTO> sms(@Valid @RequestBody SmsRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.sendSms(req));
    }

    /* 🔹 Fetch all notifications */
    @GetMapping
    public ResponseEntity<List<Notification>> listAll(
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(service.getAllNotifications());
    }

    /* 🔹 Mark notification as read */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification n = service.markAsRead(id);
        return ResponseEntity.ok(n);
    }

    /* 🔹 Send email to a specific customer by username */
    @PostMapping("/email/to-customer")
    public ResponseEntity<NotificationDTO> emailToCustomer(
            @RequestParam String username,
            @RequestParam String subject,
            @RequestParam String body) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.sendEmailToCustomer(username, subject, body));
    }

    /* 🔹 Send SMS to a specific customer by phone */
    @PostMapping("/sms/to-customer")
    public ResponseEntity<NotificationDTO> smsToCustomer(
            @RequestParam String phone,
            @RequestParam String message) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.sendSmsToCustomer(phone, message));
    }

    /* 🔹 Fetch notifications for a specific customer */
    @GetMapping("/customer/{username}")
    public ResponseEntity<List<Notification>> getNotificationsByCustomer(@PathVariable String username) {
        return ResponseEntity.ok(service.getNotificationsByCustomer(username));
    }
}
