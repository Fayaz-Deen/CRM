package com.crm.service;

import com.crm.dto.MeetingDto;
import com.crm.entity.Contact;
import com.crm.entity.Meeting;
import com.crm.repository.ContactRepository;
import com.crm.repository.MeetingRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeetingService {
    private final MeetingRepository meetingRepository;
    private final ContactRepository contactRepository;
    private final ReminderService reminderService;

    public MeetingService(MeetingRepository meetingRepository, ContactRepository contactRepository,
                          @Lazy ReminderService reminderService) {
        this.meetingRepository = meetingRepository;
        this.contactRepository = contactRepository;
        this.reminderService = reminderService;
    }

    public List<MeetingDto> getAll(String userId) {
        return meetingRepository.findByUserId(userId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<MeetingDto> getByContact(String contactId) {
        return meetingRepository.findByContactIdOrderByMeetingDateDesc(contactId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<MeetingDto> getUpcomingFollowups(String userId) {
        return meetingRepository.findByUserIdAndFollowupDateGreaterThanEqualOrderByFollowupDate(userId, LocalDate.now())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public MeetingDto create(MeetingDto dto, String userId) {
        Meeting meeting = toEntity(dto);
        meeting.setUserId(userId);
        meeting = meetingRepository.save(meeting);

        Contact contact = contactRepository.findById(dto.getContactId()).orElse(null);
        if (contact != null) {
            contact.setLastContactedAt(meeting.getMeetingDate());
            contactRepository.save(contact);
        }

        if (meeting.getFollowupDate() != null) {
            reminderService.createFollowupReminder(meeting);
        }

        return toDto(meeting);
    }

    public MeetingDto update(String id, MeetingDto dto, String userId) {
        Meeting meeting = meetingRepository.findById(id).orElseThrow(() -> new RuntimeException("Meeting not found"));
        if (!meeting.getUserId().equals(userId)) throw new RuntimeException("Access denied");
        updateEntity(meeting, dto);
        return toDto(meetingRepository.save(meeting));
    }

    public void delete(String id, String userId) {
        Meeting meeting = meetingRepository.findById(id).orElseThrow(() -> new RuntimeException("Meeting not found"));
        if (!meeting.getUserId().equals(userId)) throw new RuntimeException("Access denied");
        meetingRepository.delete(meeting);
    }

    private MeetingDto toDto(Meeting m) {
        MeetingDto dto = new MeetingDto();
        dto.setId(m.getId());
        dto.setContactId(m.getContactId());
        dto.setMeetingDate(m.getMeetingDate().toString());
        dto.setMedium(m.getMedium().name().toLowerCase());
        dto.setNotes(m.getNotes());
        dto.setOutcome(m.getOutcome());
        dto.setFollowupDate(m.getFollowupDate() != null ? m.getFollowupDate().toString() : null);
        dto.setCreatedAt(m.getCreatedAt() != null ? m.getCreatedAt().toString() : null);
        dto.setUpdatedAt(m.getUpdatedAt() != null ? m.getUpdatedAt().toString() : null);
        return dto;
    }

    private Meeting toEntity(MeetingDto dto) {
        Meeting m = new Meeting();
        updateEntity(m, dto);
        return m;
    }

    private void updateEntity(Meeting m, MeetingDto dto) {
        m.setContactId(dto.getContactId());
        m.setMeetingDate(LocalDateTime.parse(dto.getMeetingDate()));
        m.setMedium(Meeting.MeetingMedium.valueOf(dto.getMedium().toUpperCase()));
        m.setNotes(dto.getNotes());
        m.setOutcome(dto.getOutcome());
        m.setFollowupDate(dto.getFollowupDate() != null && !dto.getFollowupDate().isEmpty() ? LocalDate.parse(dto.getFollowupDate()) : null);
    }
}
