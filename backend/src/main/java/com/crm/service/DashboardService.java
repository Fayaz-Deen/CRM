package com.crm.service;

import com.crm.dto.ContactDto;
import com.crm.repository.ContactRepository;
import com.crm.repository.MeetingRepository;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final ContactRepository contactRepository;
    private final MeetingRepository meetingRepository;
    private final ContactService contactService;
    private final MeetingService meetingService;

    public DashboardService(ContactRepository contactRepository, MeetingRepository meetingRepository, ContactService contactService, MeetingService meetingService) {
        this.contactRepository = contactRepository;
        this.meetingRepository = meetingRepository;
        this.contactService = contactService;
        this.meetingService = meetingService;
    }

    public Map<String, Object> getStats(String userId) {
        Map<String, Object> stats = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime monthStart = now.withDayOfMonth(1).withHour(0).withMinute(0);
        LocalDateTime monthEnd = monthStart.plusMonths(1);

        stats.put("totalContacts", contactRepository.countByUserId(userId));
        stats.put("meetingsThisMonth", meetingRepository.countByUserIdAndDateRange(userId, monthStart, monthEnd));
        stats.put("upcomingBirthdays", getUpcomingBirthdays(userId));
        stats.put("upcomingAnniversaries", List.of());
        stats.put("pendingFollowups", meetingService.getUpcomingFollowups(userId));
        stats.put("recentlyContacted", getRecentlyContacted(userId));
        stats.put("needsAttention", getNeedsAttention(userId));
        return stats;
    }

    public List<Map<String, Object>> getMeetingsChart(String userId) {
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 7; i >= 0; i--) {
            LocalDate weekStart = today.minusWeeks(i);
            LocalDateTime start = weekStart.atStartOfDay();
            LocalDateTime end = start.plusWeeks(1);
            long count = meetingRepository.countByUserIdAndDateRange(userId, start, end);
            Map<String, Object> entry = new HashMap<>();
            entry.put("week", "W" + (8 - i));
            entry.put("count", count);
            data.add(entry);
        }
        return data;
    }

    public List<Map<String, Object>> getMediumBreakdown(String userId) {
        return meetingRepository.getMediumBreakdown(userId).stream().map(arr -> {
            Map<String, Object> m = new HashMap<>();
            m.put("medium", arr[0].toString().toLowerCase().replace("_", " "));
            m.put("count", arr[1]);
            return m;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getContactsOverTime(String userId) {
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 11; i >= 0; i--) {
            LocalDate monthStart = today.minusMonths(i).withDayOfMonth(1);
            LocalDateTime start = monthStart.atStartOfDay();
            LocalDateTime end = monthStart.plusMonths(1).atStartOfDay();

            long count = contactRepository.countByUserIdAndCreatedAtBetween(userId, start, end);

            Map<String, Object> entry = new HashMap<>();
            entry.put("month", monthStart.getMonth().toString().substring(0, 3));
            entry.put("count", count);
            data.add(entry);
        }
        return data;
    }

    private List<ContactDto> getUpcomingBirthdays(String userId) {
        LocalDate now = LocalDate.now();
        return contactRepository.findByUserId(userId).stream()
                .filter(c -> c.getBirthday() != null)
                .filter(c -> {
                    MonthDay bd = MonthDay.of(c.getBirthday().getMonth(), c.getBirthday().getDayOfMonth());
                    MonthDay today = MonthDay.now();
                    MonthDay next7 = MonthDay.from(now.plusDays(7));
                    return !bd.isBefore(today) && !bd.isAfter(next7);
                })
                .limit(5)
                .map(c -> contactService.getById(c.getId(), userId))
                .collect(Collectors.toList());
    }

    private List<ContactDto> getRecentlyContacted(String userId) {
        return contactRepository.findByUserId(userId).stream()
                .filter(c -> c.getLastContactedAt() != null)
                .sorted((a, b) -> b.getLastContactedAt().compareTo(a.getLastContactedAt()))
                .limit(5)
                .map(c -> contactService.getById(c.getId(), userId))
                .collect(Collectors.toList());
    }

    private List<ContactDto> getNeedsAttention(String userId) {
        LocalDateTime threshold = LocalDateTime.now().minusDays(30);
        return contactRepository.findNeedsAttention(userId, threshold).stream()
                .limit(5)
                .map(c -> contactService.getById(c.getId(), userId))
                .collect(Collectors.toList());
    }
}
