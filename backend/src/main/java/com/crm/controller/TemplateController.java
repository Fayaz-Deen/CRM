package com.crm.controller;

import com.crm.dto.TemplateDto;
import com.crm.entity.User;
import com.crm.service.TemplateService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {
    private final TemplateService templateService;

    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping
    public ResponseEntity<List<TemplateDto.TemplateResponse>> getTemplates(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(templateService.getTemplates(user.getId()));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<TemplateDto.TemplateResponse>> getTemplatesByType(
            @AuthenticationPrincipal User user,
            @PathVariable String type) {
        return ResponseEntity.ok(templateService.getTemplatesByType(user.getId(), type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemplateDto.TemplateResponse> getTemplate(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        return ResponseEntity.ok(templateService.getTemplate(user.getId(), id));
    }

    @PostMapping
    public ResponseEntity<TemplateDto.TemplateResponse> createTemplate(
            @AuthenticationPrincipal User user,
            @RequestBody TemplateDto dto) {
        return ResponseEntity.ok(templateService.createTemplate(user.getId(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TemplateDto.TemplateResponse> updateTemplate(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody TemplateDto dto) {
        return ResponseEntity.ok(templateService.updateTemplate(user.getId(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        templateService.deleteTemplate(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
