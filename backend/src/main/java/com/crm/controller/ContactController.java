package com.crm.controller;

import com.crm.dto.ContactDto;
import com.crm.entity.User;
import com.crm.service.ContactService;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public ResponseEntity<List<ContactDto>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(contactService.getAll(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getById(@PathVariable String id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(contactService.getById(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<ContactDto> create(@Valid @RequestBody ContactDto dto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(contactService.create(dto, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> update(@PathVariable String id, @Valid @RequestBody ContactDto dto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(contactService.update(id, dto, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, @AuthenticationPrincipal User user) {
        contactService.delete(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ContactDto>> search(@RequestParam String q, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(contactService.search(user.getId(), q));
    }
}
