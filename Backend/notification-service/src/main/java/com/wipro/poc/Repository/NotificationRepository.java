package com.wipro.poc.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wipro.poc.Entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	 List<Notification> findByToAddress(String toAddress);
	 
}
