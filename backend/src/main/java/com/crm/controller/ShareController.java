package com.crm.controller;

import com.crm.dto.ShareDto;
import com.crm.entity.Contact;
import com.crm.entity.User;
import com.crm.service.ShareService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shares")
public class ShareController {
    private final ShareService shareService;

    public ShareController(ShareService shareService) {
        this.shareService = shareService;
    }

    @PostMapping
    public ResponseEntity<ShareDto.ShareResponse> shareContact(
            @AuthenticationPrincipal User user,
            @RequestBody ShareDto dto) {
        return ResponseEntity.ok(shareService.shareContact(user.getId(), dto));
    }

    @GetMapping("/by-me")
    public ResponseEntity<List<ShareDto.ShareResponse>> getSharedByMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(shareService.getSharedByMe(user.getId()));
    }

    @GetMapping("/with-me")
    public ResponseEntity<List<ShareDto.ShareResponse>> getSharedWithMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(shareService.getSharedWithMe(user.getId()));
    }

    @GetMapping("/contact/{contactId}")
    public ResponseEntity<Contact> getSharedContact(
            @AuthenticationPrincipal User user,
            @PathVariable String contactId) {
        return ResponseEntity.ok(shareService.getSharedContact(user.getId(), contactId));
    }

    @PutMapping("/{shareId}")
    public ResponseEntity<ShareDto.ShareResponse> updateShare(
            @AuthenticationPrincipal User user,
            @PathVariable String shareId,
            @RequestBody ShareDto dto) {
        return ResponseEntity.ok(shareService.updateShare(user.getId(), shareId, dto));
    }

    @DeleteMapping("/{shareId}")
    public ResponseEntity<Void> revokeShare(
            @AuthenticationPrincipal User user,
            @PathVariable String shareId) {
        shareService.revokeShare(user.getId(), shareId);
        return ResponseEntity.noContent().build();
    }
}
