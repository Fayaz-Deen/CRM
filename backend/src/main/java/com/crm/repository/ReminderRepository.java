package com.crm.repository;

import com.crm.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, String> {
    List<Reminder> findByUserIdAndStatus(String userId, Reminder.ReminderStatus status);
    List<Reminder> findByStatusAndScheduledAtBefore(Reminder.ReminderStatus status, LocalDateTime dateTime);
    void deleteByContactId(String contactId);
}
