package com.crm.repository;

import com.crm.entity.Share;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ShareRepository extends JpaRepository<Share, String> {
    List<Share> findByOwnerUserId(String ownerUserId);

    List<Share> findBySharedWithUserId(String sharedWithUserId);

    @Query("SELECT s FROM Share s WHERE s.sharedWithUserId = ?1 AND (s.expiresAt IS NULL OR s.expiresAt > ?2)")
    List<Share> findActiveSharesForUser(String sharedWithUserId, LocalDateTime now);

    Optional<Share> findByContactIdAndSharedWithUserId(String contactId, String sharedWithUserId);

    List<Share> findByContactId(String contactId);

    void deleteByContactId(String contactId);

    boolean existsByContactIdAndSharedWithUserId(String contactId, String sharedWithUserId);
}
