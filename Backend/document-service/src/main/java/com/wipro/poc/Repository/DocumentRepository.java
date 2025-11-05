package com.wipro.poc.Repository;

import com.wipro.poc.Entity.DocumentRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<DocumentRecord, Long> {
  List<DocumentRecord> findByOwnerTypeAndOwnerId(String ownerType, Long ownerId);
}
