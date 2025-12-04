package com.crm.controller;

import com.crm.dto.MeetingDto;
import com.crm.entity.User;
import com.crm.service.MeetingService;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {
    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @GetMapping
    public ResponseEntity<List<MeetingDto>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(meetingService.getAll(user.getId()));
    }

    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<MeetingDto>> getByContact(@PathVariable String contactId) {
        return ResponseEntity.ok(meetingService.getByContact(contactId));
    }

    @GetMapping("/followups")
    public ResponseEntity<List<MeetingDto>> getFollowups(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(meetingService.getUpcomingFollowups(user.getId()));
    }

    @PostMapping
    public ResponseEntity<MeetingDto> create(@Valid @RequestBody MeetingDto dto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(meetingService.create(dto, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MeetingDto> update(@PathVariable String id, @Valid @RequestBody MeetingDto dto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(meetingService.update(id, dto, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, @AuthenticationPrincipal User user) {
        meetingService.delete(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
