package com.crm.repository;

import com.crm.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, String> {
    List<Contact> findByUserId(String userId);
    List<Contact> findByUserIdAndNameContainingIgnoreCase(String userId, String name);

    @Query("SELECT c FROM Contact c WHERE c.userId = ?1 AND (MONTH(c.birthday) = ?2 AND DAY(c.birthday) BETWEEN ?3 AND ?4)")
    List<Contact> findUpcomingBirthdays(String userId, int month, int dayStart, int dayEnd);

    @Query("SELECT c FROM Contact c WHERE c.userId = ?1 AND (c.lastContactedAt IS NULL OR c.lastContactedAt < ?2)")
    List<Contact> findNeedsAttention(String userId, LocalDateTime threshold);

    long countByUserId(String userId);

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.userId = ?1 AND c.createdAt >= ?2 AND c.createdAt < ?3")
    long countByUserIdAndCreatedAtBetween(String userId, LocalDateTime start, LocalDateTime end);
}
