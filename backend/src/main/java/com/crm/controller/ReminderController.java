package com.crm.controller;

import com.crm.entity.Reminder;
import com.crm.entity.User;
import com.crm.repository.ReminderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {
    private final ReminderRepository reminderRepository;

    public ReminderController(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reminderRepository.findByUserIdAndStatus(user.getId(), Reminder.ReminderStatus.PENDING));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Reminder>> getPending(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reminderRepository.findByUserIdAndStatus(user.getId(), Reminder.ReminderStatus.PENDING));
    }

    @PutMapping("/{id}/dismiss")
    public ResponseEntity<Reminder> dismiss(@PathVariable String id, @AuthenticationPrincipal User user) {
        Reminder reminder = reminderRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (!reminder.getUserId().equals(user.getId())) throw new RuntimeException("Access denied");
        reminder.setStatus(Reminder.ReminderStatus.DISMISSED);
        return ResponseEntity.ok(reminderRepository.save(reminder));
    }
}
