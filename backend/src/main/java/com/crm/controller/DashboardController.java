package com.crm.controller;

import com.crm.entity.User;
import com.crm.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getStats(user.getId()));
    }

    @GetMapping("/meetings-chart")
    public ResponseEntity<List<Map<String, Object>>> getMeetingsChart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getMeetingsChart(user.getId()));
    }

    @GetMapping("/medium-breakdown")
    public ResponseEntity<List<Map<String, Object>>> getMediumBreakdown(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getMediumBreakdown(user.getId()));
    }

    @GetMapping("/contacts-over-time")
    public ResponseEntity<List<Map<String, Object>>> getContactsOverTime(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getContactsOverTime(user.getId()));
    }
}
